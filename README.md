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





##### `authSystem.initialize():Promise<?>`




##### `authSystem.assignPrivilegeToCommunity(wherePrivilege:Object, whereCommunity:Object):Promise<?>`




##### `authSystem.assignPrivilegeToUser(wherePrivilege:Object, whereUser:Object):Promise<?>`




##### `authSystem.assignUserToCommunity(whereUser:Object, whereCommunity:Object):Promise<?>`




##### `authSystem.authenticate(token:String):Promise<?>`




##### `authSystem.can(token:String, privilege:String):Promise<?>`




##### `authSystem.cannot(token:String, privilege:String):Promise<?>`




##### `authSystem.canMultiple(token:String, privilege:Array<String>):Promise<?>`




##### `authSystem.cannotMultiple(token:String, privilege:Array<String>):Promise<?>`




##### `authSystem.changePassword(oldPassword:String, newPassword:String):Promise<?>`




##### `authSystem.checkUserUnicity(whereUser:Object):Promise<?>`




##### `authSystem.confirmUser(whereUser:Object):Promise<?>`




##### `authSystem.createTables():Promise<?>`




##### `authSystem.deleteCommunity(whereCommunity:Object):Promise<?>`




##### `authSystem.deleteUser(whereUser:Object):Promise<?>`




##### `authSystem.deletePrivilege(wherePrivilege:Object):Promise<?>`




##### `authSystem.deleteTables():Promise<?>`




##### `authSystem.deleteUnconfirmedUser(whereUnconfirmedUser:Object):Promise<?>`




##### `authSystem.findUnconfirmedUser(whereUnconfirmedUser:Object):Promise<?>`




##### `authSystem.findCommunity(whereCommunity:Object):Promise<?>`




##### `authSystem.findPrivilege(wherePrivilege:Object):Promise<?>`




##### `authSystem.findUser(whereUser:Object):Promise<?>`




##### `authSystem.registerUnconfirmedUser(user:Object):Promise<?>`




##### `authSystem.login(user:Object):Promise<?>`




##### `authSystem.logout(token:String):Promise<?>`




##### `authSystem.refresh(whereSession:String):Promise<?>`




##### `authSystem.refresh(whereUser:String):Promise<?>`




##### `authSystem.registerCommunity(community:Object):Promise<?>`




##### `authSystem.registerPrivilege(privilege:Object):Promise<?>`




##### `authSystem.revokePrivilegeFromCommunity(wherePrivilege:Object, whereCommunity:Object):Promise<?>`




##### `authSystem.revokePrivilegeFromUser(wherePrivilege:Object, whereUser:Object):Promise<?>`




##### `authSystem.revokeUserFromCommunity(whereUser:Object, whereCommunity:Object):Promise<?>`




##### `authSystem.unregisterCommunity(whereCommunity:Object):Promise<?>`




##### `authSystem.unregisterPrivilege(wherePrivilege:Object):Promise<?>`




##### `authSystem.unregisterUser(whereUser:Object):Promise<?>`




##### `authSystem.updateCommunity(whereCommunity:Object, values:Object):Promise<?>`




##### `authSystem.updatePrivilege(wherePrivilege:Object, values:Object):Promise<?>`




##### `authSystem.updateUser(whereUser:Object, values:Object):Promise<?>`





## License

This project is under [WTFPL or What The Fuck Public License](https://es.wikipedia.org/wiki/WTFPL), which basically means *'do what you want'*.

## Issues

Please, share issues and suggestions [here](https://github.com/allnulled/mysql-auth).
