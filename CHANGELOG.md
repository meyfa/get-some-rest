# Changelog

## [0.5.0](https://github.com/meyfa/get-some-rest/compare/v0.4.0...v0.5.0) (2023-03-25)


### ⚠ BREAKING CHANGES

* Engine version requirement raised to Node `>=18.14.2`.

### Features

* Parse "Expires" cookie attribute ([#69](https://github.com/meyfa/get-some-rest/issues/69)) ([e6ef2c5](https://github.com/meyfa/get-some-rest/commit/e6ef2c538c3c8daea11042ccf19c464ec358c7ef))


### Bug Fixes

* Use `Headers.prototype.append` for 'cookie' header ([#65](https://github.com/meyfa/get-some-rest/issues/65)) ([286ba27](https://github.com/meyfa/get-some-rest/commit/286ba27141c1e16b4bcb3d59f9b60e368ce67d01))
* Use `Headers.prototype.getSetCookie` to avoid comma-splitting ([#67](https://github.com/meyfa/get-some-rest/issues/67)) ([1541794](https://github.com/meyfa/get-some-rest/commit/154179401a28189bc73edafe43c5c9385db7379e))

## [0.4.0](https://github.com/meyfa/get-some-rest/compare/v0.3.1...v0.4.0) (2022-12-02)


### Features

* Add a `getCookie(key)` method to StatefulHttpClient ([#38](https://github.com/meyfa/get-some-rest/issues/38)) ([992a64e](https://github.com/meyfa/get-some-rest/commit/992a64e553cd1df4562f4d0ce103150a88dcbca5))
* Support setting custom headers ([#40](https://github.com/meyfa/get-some-rest/issues/40)) ([655b9de](https://github.com/meyfa/get-some-rest/commit/655b9de966654461b175ba0ab426f8f3f21392e1))

## [0.3.1](https://github.com/meyfa/get-some-rest/compare/v0.3.0...v0.3.1) (2022-11-25)


### Bug Fixes

* Allow cookies to be overwritten in memory store ([#36](https://github.com/meyfa/get-some-rest/issues/36)) ([be73ae8](https://github.com/meyfa/get-some-rest/commit/be73ae829df21a67fb18af5c21674f6401f11831))

## [0.3.0](https://github.com/meyfa/get-some-rest/compare/v0.2.0...v0.3.0) (2022-07-17)


### Features

* Support awaiting a request directly ([#10](https://github.com/meyfa/get-some-rest/issues/10)) ([956655c](https://github.com/meyfa/get-some-rest/commit/956655cd094d3a700d02e574a610ffc2afe3c64f))

## [0.2.0](https://github.com/meyfa/get-some-rest/compare/v0.1.0...v0.2.0) (2022-07-12)


### ⚠ BREAKING CHANGES

* Only StatefulHttpClient offers setCookie() now.

### Features

* Add raw() method to HttpRequest ([#7](https://github.com/meyfa/get-some-rest/issues/7)) ([eb8233f](https://github.com/meyfa/get-some-rest/commit/eb8233fb0c720069cb76e459c5be988eb47416d5))
* Implement middleware system for modifying requests/responses ([#5](https://github.com/meyfa/get-some-rest/issues/5)) ([15d18a2](https://github.com/meyfa/get-some-rest/commit/15d18a201cf77e74252c26974bd85b8b24f03bf5))

## 0.1.0 (2022-07-07)


### Features

* Create project ([#1](https://github.com/meyfa/get-some-rest/issues/1)) ([f670700](https://github.com/meyfa/get-some-rest/commit/f670700bc79466c24e9dcd4082c1f58380ccf60e))
* Implement a basic fetch-based client ([#4](https://github.com/meyfa/get-some-rest/issues/4)) ([0f7b578](https://github.com/meyfa/get-some-rest/commit/0f7b578768b963732f53b5dbb6f82e2c1256a3fa))
