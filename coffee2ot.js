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
import childProcess from "child_process"

const rcoffee = /\.coffee$/
const exec = childProcess.exec
const lebabTransforms = parseOptions([]).transformers
const transformer = new lebab.Transformer(lebabTransforms)

class Converter {
  constructor(files) {
    this.files = files
  }

  convertCoffee(fileData) {
    return coffee.compile(fileData, { bare: true })
  }

  convertLebab(fileData) {
    return transformer.run(fileData)
  }

  convertFile(file, fileData) {
    return this.write(file,
      this.convertLebab(
        this.convertCoffee(
          fileData
        )
      )
    )
  }

  read(file) {
    console.log("Reading file ", file)
    return new BPromise((resolve, reject) => {
      fs.readFile(file, "utf8", (err, fileData) => {
        if (err) reject(err)
        else resolve(fileData)
      })
    })
  }

  write(file, fileData) {
    const fileName = file.replace(rcoffee, ".js")
    console.log("Writing file ", fileName)
    return new BPromise((resolve, reject) => {
      fs.writeFile(fileName, fileData, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  convert(pattern, options = { ignore: ["node_modules/**/*", ".git/**/*"] }) {
    console.log("Converting ", pattern)
    const converted = new BPromise((resolve, reject) => {
      glob(pattern, options, (err, files) => {
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
    return converted.then(() =>
      new BPromise((resolve, reject) => {
        exec("./node_modules/.bin/eslint --fix ./", { cwd: process.cwd() }, (err, stdout, stderr) => {
          if (err) {
            console.error(stdout)
            reject(err)
          } else {
            resolve()
          }
        })
      })
    )
  }
}

const converter = new Converter
const files = process.argv[2]

converter.convert(files)
