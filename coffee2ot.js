/**
 * Converts coffeescript files to OpenTable's ES6 syntax
 * This is not a full parser, but handles most cases we have
 * It is not meant for the public
 */

import fs from "fs"
import coffee from "coffee-script"
import lebab from "lebab"
import parseOptions from "lebab/lib/parse-command-line-options"
import glob from "glob"
import BPromise from "bluebird"
import _ from "lodash"

const rcoffee = /\.coffee$/
const lebabTransforms = parseOptions([]).transformers
const transformer = new lebab.Transformer(lebabTransforms)

const converter = {
  start(files) {
    this.files = files
    this.convertPackageJson()
      .then(() => this.addEslintrc())
      .then(() => this.addTestEslintrc())
      .then(() => this.addBabelrc())
      .then(() => this.convertSource())
  },

  read(file) {
    console.log("Reading file ", file)
    return new BPromise((resolve, reject) => {
      fs.readFile(file, "utf8", (err, fileData) => {
        if (err) reject(err)
        else resolve(fileData)
      })
    })
  },

  write(file, fileData) {
    const fileName = file.replace(rcoffee, ".js")
    console.log("Writing file ", fileName)
    return new BPromise((resolve, reject) => {
      fs.writeFile(fileName, fileData, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  },

  writeJson(file, json) {
    return this.write(file, JSON.stringify(json, null, 2))
  },

  updateDependencies() {
    delete this.pkg.dependencies["coffee-script"]
  },

  updateDevDependencies() {
    delete this.pkg.devDependencies["coffee-coverage"]
    delete this.pkg.devDependencies.istanbul
    _.assign(this.pkg.devDependencies, {
      "babel-cli": "^6.5.1",
      "babel-preset-es2015": "^6.5.0",
      "babel-preset-es2015-loose": "^7.0.0",
      eslint: "^2.4.0",
      "eslint-config-opentable": "^2.0.1",
      isparta: "^4.0.0"
    })
  },

  updateScripts() {
    this.pkg.scripts = {
      build: "babel src -d dist",
      dev: "babel --watch src -d dist",
      lint: "eslint .",
      pretest: "npm run lint",
      test: "babel-node --debug node_modules/mocha/bin/_mocha ./test/",
      precoveralls: "npm run lint",
      coveralls: "babel-node node_modules/isparta/bin/isparta cover ./node_modules/mocha/bin/_mocha --report lcovonly ./test/ && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage"
    }
  },

  convertPackageJson() {
    return this.read("./package.json").then((fileData) => {
      this.pkg = JSON.parse(fileData)
      this.updateDependencies()
      this.updateDevDependencies()
      this.updateScripts()
      return this.writeJson("./package.json", this.pkg)
    })
  },

  addEslintrc() {
    const rc = {
      extends: "opentable",
      rules: {
        "max-len": 0
      }
    }
    return this.writeJson("./.eslintrc", rc)
  },

  addTestEslintrc() {
    const rc = {
      extends: "opentable",
      env: {
        es6: true,
        mocha: true,
        node: true,
        jasmine: true
      },
      rules: {
        "no-unused-expressions": 0,
        "max-len": 0,
        "arrow-body-style": 0
      }
    }
    return this.writeJson("./test/.eslintrc", rc)
  },

  addBabelrc() {
    const rc = {
      presets: ["es2015-loose"]
    }
    return this.writeJson("./.babelrc", rc)
  },

  convertCoffee(fileData) {
    return coffee.compile(fileData, { bare: true })
  },

  convertLebab(fileData) {
    return transformer.run(fileData)
  },

  convertFile(file, fileData) {
    return this.write(file,
      this.convertLebab(
        this.convertCoffee(
          fileData
        )
      )
    )
  },

  convertSource(options = { ignore: ["node_modules/**/*", ".git/**/*"] }) {
    console.log("Converting ", this.files)
    return new BPromise((resolve, reject) => {
      glob(this.files, options, (err, files) => {
        if (err) {
          reject(err)
          return
        }
        console.log("Found files ", files)
        Promise.all(files.map((file) =>
          this.read(file).then((fileData) => this.convertFile(file, fileData))
        )).then(resolve, reject)
      })
    })
  }
}

converter.start(process.argv[2])
