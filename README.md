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


## API Reference

These are the signatures of the methods of the `mysql-auth` API.



-----

##### `const AuthSystem = require("mysql-auth")`




-----

##### `const authSystem = AuthSystem.create(...)`




-----

##### `auth.assignPrivilegeToCommunity(wherePrivilege:Object, whereCommunity:Object):Promise`




-----

##### `auth.assignPrivilegeToUser(wherePrivilege:Object, whereUser:Object):Promise`




-----

##### `auth.assignUserToCommunity(whereUser:Object, whereCommunity:Object):Promise`




-----

##### `auth.authenticate(whereSession:Object, settings:Object):Promise`




-----

##### `auth.can(token:String, privilege:Object, defaultPolicy:Boolean):Promise`




-----

##### `auth.canMultiple(token:String, canArgsList:Array<Object>):Promise`




-----

##### `auth.cannot(token:String, privilege:Object, defaultPolicy:Boolean):Promise`




-----

##### `auth.cannotMultiple(token:String, canArgsList:Array<Object>):Promise`













-----

##### `auth.confirmUser(user:Object):Promise`




-----

##### `auth.deleteCommunity(whereCommunity:Object):Promise`




-----

##### `auth.createTables():Promise`




-----

##### `auth.deletePrivilege(wherePrivilege:Object):Promise`




-----

##### `auth.deleteUnconfirmedUser(whereUnconfirmedUser:Object):Promise`




-----

##### `auth.deleteTables():Promise`




-----

##### `auth.findCommunity(whereCommunity:Object):Promise`




-----

##### `auth.deleteUser(whereUser:Object):Promise`




-----

##### `auth.findCommunityAndPrivilege(whereCommunity:Object, wherePrivilege:Object):Promise`




-----

##### `auth.findPrivilege(wherePrivilege:Object):Promise`




-----

##### `auth.findSession(whereUser:Object):Promise`




-----

##### `auth.findSessionByUser(whereUser:Object):Promise`




-----

##### `auth.findUnconfirmedUser(whereUnconfirmedUser:Object):Promise`




-----

##### `auth.findUser(whereUser:Object):Promise`




-----

##### `auth.findUserAndCommunity(whereUser:Object, whereCommunity:Object):Promise`




-----

##### `auth.findUserAndPrivilege(whereUser:Object, wherePrivilege:Object):Promise`




-----

##### `auth.login(whereUser:Object):Promise`




-----

##### `auth.logout(whereSession:Object):Promise`




-----

##### `auth.logoutByUser(whereUser:Object):Promise`




-----

##### `auth.refresh(whereSession:Object):Promise`




-----

##### `auth.refreshAll():Promise`




-----

##### `auth.registerCommunity(communityDetails:Object):Promise`




-----

##### `auth.registerPrivilege(privilegeDetails:Object):Promise`




-----

##### `auth.registerUnconfirmedUser(userDetails:Object):Promise`




-----

##### `auth.revokePrivilegeFromCommunity(wherePrivilege:Object, whereCommunity:Object):Promise`




-----

##### `auth.revokePrivilegeFromUser(wherePrivilege:Object, whereUser:Object):Promise`




-----

##### `auth.revokeUserFromCommunity(whereUser:Object, whereCommunity:Object):Promise`




-----

##### `auth.unregisterCommunity(whereCommunity:Object):Promise`




-----

##### `auth.unregisterPrivilege(wherePrivilege:Object):Promise`




-----

##### `auth.unregisterUser(whereUser:Object):Promise`




-----

##### `auth.updateCommunity(whereCommunity:Object):Promise`




-----

##### `auth.updatePrivilege(wherePrivilege:Object):Promise`




-----

##### `auth.updateUser(whereUser:Object):Promise`





## License

This project is under [WTFPL or What The Fuck Public License](https://es.wikipedia.org/wiki/WTFPL), which basically means *'do what you want'*.

## Issues

Please, share issues and suggestions [here](https://github.com/allnulled/mysql-auth).
