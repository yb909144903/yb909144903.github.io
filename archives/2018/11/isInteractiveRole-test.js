# lazy-cache [![NPM version](https://img.shields.io/npm/v/lazy-cache.svg?style=flat)](https://www.npmjs.com/package/lazy-cache) [![NPM downloads](https://img.shields.io/npm/dm/lazy-cache.svg?style=flat)](https://npmjs.org/package/lazy-cache) [![Build Status](https://img.shields.io/travis/jonschlinkert/lazy-cache.svg?style=flat)](https://travis-ci.org/jonschlinkert/lazy-cache)

> Cache requires to be lazy-loaded when needed.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install lazy-cache --save
```

If you use webpack and are experiencing issues, try using [unlazy-loader](https://github.com/doowb/unlazy-loader), a webpack loader that fixes the bug that prevents webpack from working with native javascript getters.

## Usage

```js
var utils = require('lazy-cache')(require);
```

**Use as a property on `lazy`**

The module is also added as a property to the `lazy` function
so it can be called without having to call a function first.

```js
var utils = require('lazy-cache')(require);

// `npm install glob`
utils('glob');

// glob sync
console.log(utils.glob.sync('*.js'));

// glob async
utils.glob('*.js', function (err, files) {
  console.log(files);
});
```

**Use as a function**

```js
var utils = require('lazy-cache')(require);
var glob = utils('glob');

// `glob` is a now a function that may be called when needed
glob().sync('foo/*.js');
```

## Aliases

An alias may be passed as the second argument if you don't want to use the automatically camel-cased variable name.

**Example**

```js
var utils = require('lazy-cache')(require);

// alias `ansi-yellow` as `yellow`
utils('ansi-yellow', 'yellow');
co