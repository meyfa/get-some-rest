# get-some-rest

[![CI](https://github.com/meyfa/get-some-rest/actions/workflows/main.yml/badge.svg)](https://github.com/meyfa/get-some-rest/actions/workflows/main.yml)

A stateful HTTP client for NodeJS. Test your routes even when mocking is infeasible.

## Usage

This package requires Node version 18.14.2 or later because it makes use of native `fetch()`,
as well as `Headers.prototype.getSetCookie`.

Additionally, it is packaged as an ES module only, so your tests have to be in ESM format, too.
