# mysql-auth

## Installation

`$ npm i -g mysql-auth`

## Why?

This tool is a little framework for `authentication` and `authorization` management based in `mysql` and `node.js` mainly.

The reason was to create a tool to universally manage these topics of any kind of application in a comfortable, relaxed way.

## Features

These are some of the advantages of `mysql-auth`:

   - [✔] Comfortable object-oriented API for `authentication` and `authorization`
   - [✔] Fully based in `Promises`
   - [✔] Manages `users`, `communities` and `privileges`
   - [✔] Manages `privileges` per `user` and per `community`
   - [✔] Manages `sessions` too
   - [✔] Creates the basic tables too, by API or CLI
   - [✔] Deletes all the related tables easily too, by API or CLI
   - [✔] Easily hookable and extendable API
   - [✔] Query sanitization every input
   - [✔] Builds queries using `ejs` templating system
   - [✔] Caches the most queried table `session`
   - [✔] Flexible parametrization of API
   - [✔] History changes automatically added in different[ly prefixed] tables
   - [✔] Good coverage marks
   - [✔] Free license [(WTFPL)](https://es.wikipedia.org/wiki/WTFPL)

### Additional details

   - [✔] Unconfirmed users are not true users
   - [✔] History tables are created and updated automatically for you, too
   - [✔] User's `name` and `email` must be unique
   - [✔] User's `password` is automatically encrypted and never decrypted
   - [✔] Sessions autogenerate their `token` and `secret_token`
   - [✔] Cache is refreshed only when required
   - [✔] Cache is an in-memory map
   - [✔] Database connection is made by a pool of connections

