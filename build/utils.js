'use strict'
const path = require('path')
const config = require('../config')
var glob = require('glob')
const utils = require('./utils')
const appConfig = require('../appConfig')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.entry = (function () {
  var entry = {}
  glob.sync('./src/pages/*').forEach(function (name) {
    // var n = name.slice(12, name.length - 3);
    var n = name.slice(12, name.length - 0)
    // n = n.slice(0, n.lastIndexOf('/'));
    //接着我对路径字符串进行了一些裁剪成想要的路径
    // entry[n] = name;
    appConfig.pages.forEach(function(page) {
      if (page.filename === n) {
        entry[n] = name + '/index.js'
      }
    })
  })
  return entry
})()

/**
 * 环境
 * development: 开发
 * testing: 测试环境
 * production: 生产环境（默认）
 */
exports.env = (function () {
  var env = process.argv[2] || 'production';
  return env
})()
