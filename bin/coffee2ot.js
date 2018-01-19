#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _coffeeScript = require("coffee-script");

var _coffeeScript2 = _interopRequireDefault(_coffeeScript);

var _lebab = require("lebab");

var _lebab2 = _interopRequireDefault(_lebab);

var _parseCommandLineOptions = require("lebab/lib/parse-command-line-options");

var _parseCommandLineOptions2 = _interopRequireDefault(_parseCommandLineOptions);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rcoffee = /\.coffee$/; /**
                            * Converts coffeescript files to OpenTable's ES6 syntax
                            * This is not a full parser, but handles most cases we have
                            * It is not meant for the public
                            */

var lebabTransforms = (0, _parseCommandLineOptions2.default)([]).transformers;
var transformer = new _lebab2.default.Transformer(lebabTransforms);

var converter = {
  start: function start(files) {
    var _this = this;

    this.files = files;
    this.convertPackageJson().then(function () {
      return _this.addEslintrc();
    }).then(function () {
      return _this.addTestEslintrc();
    }).then(function () {
      return _this.addBabelrc();
    }).then(function () {
      return _this.addEditorConfig();
    }).then(function () {
      return _this.convertSource();
    });
  },
  read: function read(file) {
    console.log("Reading file ", file);
    return new _bluebird2.default(function (resolve, reject) {
      _fs2.default.readFile(file, "utf8", function (err, fileData) {
        if (err) reject(err);else resolve(fileData);
      });
    });
  },
  write: function write(file, fileData) {
    var fileName = file.replace(rcoffee, ".js");
    console.log("Writing file ", fileName);
    return new _bluebird2.default(function (resolve, reject) {
      _fs2.default.writeFile(fileName, fileData, function (err) {
        if (err) reject(err);else resolve();
      });
    });
  },
  writeJson: function writeJson(file, json) {
    return this.write(file, JSON.stringify(json, null, 2));
  },
  updateDependencies: function updateDependencies() {
    delete this.pkg.dependencies["coffee-script"];
  },
  updateDevDependencies: function updateDevDependencies() {
    delete this.pkg.devDependencies["coffee-coverage"];
    delete this.pkg.devDependencies.istanbul;
    _lodash2.default.assign(this.pkg.devDependencies, {
      "babel-cli": "^6.5.1",
      "babel-preset-es2015": "^6.5.0",
      "babel-preset-es2015-loose": "^7.0.0",
      eslint: "^2.4.0",
      "eslint-config-opentable": "^2.0.1",
      isparta: "^4.0.0"
    });
  },
  updateScripts: function updateScripts() {
    this.pkg.scripts = {
      build: "babel src -d dist",
      dev: "babel --watch src -d dist",
      lint: "eslint .",
      pretest: "npm run lint",
      test: "babel-node --debug node_modules/mocha/bin/_mocha ./test/",
      precoveralls: "npm run lint",
      coveralls: "babel-node node_modules/isparta/bin/isparta cover ./node_modules/mocha/bin/_mocha --report lcovonly ./test/ && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage"
    };
  },
  convertPackageJson: function convertPackageJson() {
    var _this2 = this;

    return this.read("./package.json").then(function (fileData) {
      _this2.pkg = JSON.parse(fileData);
      _this2.updateDependencies();
      _this2.updateDevDependencies();
      _this2.updateScripts();
      return _this2.writeJson("./package.json", _this2.pkg);
    });
  },
  addEslintrc: function addEslintrc() {
    var rc = {
      extends: "opentable",
      rules: {
        "max-len": 0
      }
    };
    return this.writeJson("./.eslintrc", rc);
  },
  addTestEslintrc: function addTestEslintrc() {
    var rc = {
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
    };
    return this.writeJson("./test/.eslintrc", rc);
  },
  addBabelrc: function addBabelrc() {
    var rc = {
      presets: ["es2015-loose"]
    };
    return this.writeJson("./.babelrc", rc);
  },
  addEditorConfig: function addEditorConfig() {
    var config = "\n# http://EditorConfig.org\nroot = true\n\n[*]\nindent_style = space\nindent_size = 2\nend_of_line = lf\ncharset = utf-8\ntrim_trailing_whitespace = true\ninsert_final_newline = true\n";
    return this.write("./.editorconfig", config);
  },
  convertCoffee: function convertCoffee(fileData) {
    return _coffeeScript2.default.compile(fileData, { bare: true });
  },
  convertLebab: function convertLebab(fileData) {
    return transformer.run(fileData);
  },
  convertFile: function convertFile(file, fileData) {
    return this.write(file, this.convertLebab(this.convertCoffee(fileData)));
  },
  convertSource: function convertSource() {
    var _this3 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? { ignore: ["node_modules/**/*", ".git/**/*"] } : arguments[0];

    console.log("Converting ", this.files);
    if (!this.files) return _bluebird2.default.resolve();

    return new _bluebird2.default(function (resolve, reject) {
      (0, _glob2.default)(_this3.files, options, function (err, files) {
        if (err) {
          reject(err);
          return;
        }
        console.log("Found files ", files);
        _bluebird2.default.all(files.map(function (file) {
          return _this3.read(file).then(function (fileData) {
            return _this3.convertFile(file, fileData);
          });
        })).then(resolve, reject);
      });
    });
  }
};

converter.start(process.argv[2]);

