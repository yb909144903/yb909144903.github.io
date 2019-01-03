# [postcss][postcss]-discard-comments [![Build Status](https://travis-ci.org/ben-eb/postcss-discard-comments.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/postcss-discard-comments.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/postcss-discard-comments.svg)][deps]

> Discard comments in your CSS files with PostCSS.


## Install

With [npm](https://npmjs.org/package/postcss-discard-comments) do:

```
npm install postcss-discard-comments --save
```


## Example

### Input

```css
h1/* heading */{
    margin: 0 auto
}
```

### Output

```css
h1 {
    margin: 0 auto
}
```

This module discards comments from your CSS files; by default, it will remove
all regular comments (`/* comment */`) and preserve comments marked as important
(`/*! important */`).

Note that this module does not handle source map comments because they are not
available to it; PostCSS handles this internally, so if they are removed then
you will have to [configure source maps in PostCSS][maps].

[maps]: https://github.com/postcss/postcss/blob/master/docs/source-maps.md


## API

### comments([options])

#### options

##### remove(function)

Type: `function`
Return: `boolean`
Variable: `comment` contains a comment without `/**/`

For each comment, return true to remove, or false to keep the comment.

```js
function(comment) {}
```

```js
var css = '/* headings *//*@ h1 */h1{margin:0 auto}/*@ h2 */h2{color:red}';
console.log(postcss(comments({
    remove: function(comment) { return comment[0] == "@"; }
})).process(css).css);
//=> /* headings */h1{mar