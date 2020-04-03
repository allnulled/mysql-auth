# mysql-auth

Authentication and authorization system for MySQL and Node.js: users, communities and privileges.

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
   - [✔] Query sanitization in every input
   - [✔] Builds queries using `ejs` templating system
   - [✔] Caches the most queried table `session`
   - [✔] Flexible parametrization of API
   - [✔] Historical data automatically stored in different[ly prefixed] tables
   - [✔] Good coverage marks
   - [✔] There is not an enterprise version of this software
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


## Usage

### CLI usage

```sh
...
```

### API usage

##### Initialize a client

```js
const MySQLAuthSystem = require("mysql-auth");
// 1. Create an auth system (this is to manage cache centralizedly):
const authSystem = MySQLAuthSystem.create();
// 2. Create clients of this auth system:
const auth1 = authSystem.createClient();
const auth2 = authSystem.createClient();
const auth3 = authSystem.createClient();
```

##### Play with the API

```js
// 1. register unconfirmed user:
await auth1.registerUnconfirmedUser({ name: "user1", password: "1", email: "user1@email.com" });
// 2. confirm user:
await auth1.confirmUser({ name: "user1" });
// 3. login user:
const { data } = await auth1.login({ name: "user1", password: "1" });
// 4. assign privilege to user:
await auth1.assignPrivilegeToUser({ name: "speak" }, { name: "user1" });
// 5. assign community to user:
await auth1.assignCommunityToUser({ name: "community 1" }, { name: "user1" });
// 6. assign privilege to community:
await auth1.assignPrivilegeToCommunity({ name: "vote" }, { name: "humans" });
```


## Reference



##### `const AuthSystem = require("mysql-auth")`






##### `const authSystem = AuthSystem.create(...)`





##### `auth.assignPrivilegeToCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.assignPrivilegeToUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.assignUserToCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.authenticate()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.can()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.canMultiple()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.changePassword()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.checkUserUnicity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.confirmUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.createTables()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.deleteCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.cannotMultiple()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.deletePrivilege()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.deleteTables()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.findCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.deleteUnconfirmedUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.findPrivilege()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.deleteUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.findUnconfirmedUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.findUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.logout()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.login()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.refresh()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.refreshByUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.registerCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.registerPrivilege()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.registerUnconfirmedUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.revokePrivilegeFromCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.revokePrivilegeFromUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.unregisterCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.updateCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.updatePrivilege()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.updateUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.unregisterUser()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.revokeUserFromCommunity()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.cannot()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...




##### `auth.unregisterPrivilege()`



**Class Method**.


**Asynchronous**.


**Parameter**:  


 `one:String` - 


 `two:String` - 


**Throws**:  `Error` - 


**Returns**:  `Promise<?>` - 


**Description**:  ...





## License

This project is under [WTFPL or What The Fuck Public License](https://es.wikipedia.org/wiki/WTFPL), which basically means *'do what you want'*.

## Issues

Please, share issues and suggestions [here](https://github.com/allnulled/mysql-auth).
