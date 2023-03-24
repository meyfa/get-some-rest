# get-some-rest

[![CI](https://github.com/meyfa/get-some-rest/actions/workflows/main.yml/badge.svg)](https://github.com/meyfa/get-some-rest/actions/workflows/main.yml)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1cd0077bc5595e556c51/test_coverage)](https://codeclimate.com/github/meyfa/get-some-rest/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/1cd0077bc5595e556c51/maintainability)](https://codeclimate.com/github/meyfa/get-some-rest/maintainability)

A stateful HTTP client for NodeJS. Test your routes even when mocking is infeasible.

## Usage

This package requires Node version 18.14.2 or later because it makes use of native `fetch()`,
as well as `Headers.prototype.getSetCookie`.

Additionally, it is packaged as an ES module only, so your tests have to be in ESM format, too.
