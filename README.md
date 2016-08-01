# Fast-ESLint

[![APM][apm-v-image]][apm-url]
[![CircleCI][circle-image]][circle-url]
[![David][david-image]][david-url]
[![APM][apm-d-image]][apm-url]

[![semantic-release][semantic-image]][semantic-url]
[![ESLint][standard-image]][standard-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]

Lightweight ESLint plugin for Atom.

* ESLint is already highly configurable through `.eslintrc` files.
* Same behavior as: `$ cd /path/to/file && eslint src.js`.
* It's fast !

:warning: ESLint v3.0.0 now requires that you use a configuration to run. See [migrating-to-3.0.0](https://github.com/eslint/eslint/blob/master/docs/user-guide/migrating-to-3.0.0.md)

## Installation

* `apm install fast-eslint`
* choose a popular shared config (or build your own) and follow installation instructions

### Popular style guides

* Airbnb: [eslint-config-airbnb](https://github.com/airbnb/javascript)
* Standard: [eslint-config-standard](https://github.com/feross/standard)
* Google: [eslint-config-google](https://github.com/google/eslint-config-google)
* XO: [eslint-config-xo](https://github.com/sindresorhus/eslint-config-xo)

### Example Settings for `standard` & `standard-react`

* `npm install -g eslint-config-standard eslint-config-standard-react`

### Project / System configuration

Create `.eslintrc.*` file either in your project or home directory.

``` json
{
  "extends": ["standard", "standard-react"]
}
```

### Atom wide configuration

Go to `Atom` -> `Config...` and enter:

``` coffee
"*":
  "fast-eslint":
    baseConfigExtends: [
      "standard",
      "standard-react"
    ]
```

### MIT License

Copyright (c) 2016 Arnaud Dezandee

[apm-v-image]: https://img.shields.io/apm/v/fast-eslint.svg
[apm-d-image]: https://img.shields.io/apm/dm/fast-eslint.svg
[apm-url]: https://atom.io/packages/fast-eslint
[circle-image]: https://img.shields.io/circleci/project/Adezandee/fast-eslint/master.svg
[circle-url]: https://circleci.com/gh/Adezandee/fast-eslint/tree/master
[david-image]: https://img.shields.io/david/Adezandee/fast-eslint.svg
[david-url]: https://david-dm.org/Adezandee/fast-eslint
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=flat
[standard-url]: https://github.com/airbnb/javascript
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat
[commitizen-url]: http://commitizen.github.io/cz-cli/
