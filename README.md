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
   - [✔] Database connection is made by a pool of connections (and it must be closed manually from API)
   - [✔] Fuck the rich people
   - [✔] Fuck fucking Bill Gates and friends


## Usage

### CLI usage

*Note: CLI is only to create and delete the tables that will manage the auth*

```sh
mysql-auth 
   --command create     # or <delete>
   --host 127.0.0.1     # db host
   --port 3306          # db port
   --database test      # db name
   --user test          # db user
   --password test      # db password
```

### API usage

##### Initialize a client

```js
const MySQLAuthSystem = require("mysql-auth");
// 1. Create an auth system (this is to manage cache centralizedly):
const auth = MySQLAuthSystem.create({
   connectionSettings: {
      host: ...,
      port: ...,
      database: ...,
      user: ...,
      password: ...,
   },
   debug: true, // this will log all SQL queries made by the framework
   trace: false // this will log by console everytime a method of the API is called
});
```

##### Play with the API

```js
await auth.registerUnconfirmedUser({ name: "user1", password: "1", email: "user1@email.com" });
await auth.confirmUser({ name: "user1" });
const { data } = await auth.login({ name: "user1", password: "1" });
await auth.assignPrivilegeToUser({ name: "speak" }, { name: "user1" });
await auth.assignCommunityToUser({ name: "community 1" }, { name: "user1" });
await auth.assignPrivilegeToCommunity({ name: "vote" }, { name: "humans" });
// ...
```


## API Reference

### API database schema

The API database schema of the `mysql-auth` package is created by a SQL query located at:

   - [https://raw.githubusercontent.com/allnulled/mysql-auth/master/src/queries/create%20tables.sql.ejs](https://raw.githubusercontent.com/allnulled/mysql-auth/master/src/queries/create%20tables.sql.ejs)

Check it to have a better understanding of how the database is altered to have **authentication** and **authorization**.

### API methods list

```js
Auth = require("mysql-auth");
auth = Auth.create({
   connectionSettings: {
      host: "127.0.0.1",
      port: 3306,
      database: "test",
      user: "test",
      password: "test"
   },
   debug: false,
   trace: false,
})
auth.assignPrivilegeToUser(wherePrivilege, whereUser)
auth.assignUserToCommunity(whereUser, whereCommunity)
auth.authenticate(whereSession, settings)
auth.can(token, privilege, defaultPolicy)
auth.canMultiple(token, canArgsList)
auth.cannot(token, privilege, defaultPolicy)
auth.cannotMultiple(token, canArgsList)
auth.confirmUser(user)
auth.createTables()
auth.deleteCommunity(whereCommunity)
auth.deletePrivilege(wherePrivilege)
auth.deleteTables()
auth.deleteUnconfirmedUser(whereUnconfirmedUser)
auth.deleteUser(whereUser)
auth.findCommunity(whereCommunity)
auth.findCommunityAndPrivilege(whereCommunity, wherePrivilege)
auth.findPrivilege(wherePrivilege)
auth.findSession(whereUser)
auth.findSessionByUser(whereUser)
auth.findUnconfirmedUser(whereUnconfirmedUser)
auth.findUser(whereUser)
auth.findUserAndCommunity(whereUser, whereCommunity)
auth.findUserAndPrivilege(whereUser, wherePrivilege)
auth.login(whereUser)
auth.logout(whereSession)
auth.logoutByUser(whereUser)
auth.refresh(whereSession)
auth.refreshAll()
auth.registerCommunity(communityDetails)
auth.registerPrivilege(privilegeDetails)
auth.revokePrivilegeFromCommunity(wherePrivilege, whereCommunity)
auth.revokePrivilegeFromUser(wherePrivilege, whereUser)
auth.registerUnconfirmedUser(userDetails)
auth.revokeUserFromCommunity(whereUser, whereCommunity)
auth.unregisterCommunity(whereCommunity)
auth.unregisterPrivilege(wherePrivilege)
auth.unregisterUser(whereUser)
auth.updateCommunity(whereCommunity)
auth.updatePrivilege(wherePrivilege)
auth.updateUser(whereUser)
```

### API `where*` parameters

The `whereToSQL` is located in the `utils.js` file, here:

 - [https://github.com/allnulled/mysql-auth/blob/master/src/utils.js](https://github.com/allnulled/mysql-auth/blob/master/src/utils.js)

This method is the one that transforms our `where*` parameters into real SQL code.

It accepts `Object` or `Array`.

When it is an `Object`, it uses operator `=` for all the properties.

When it is an `Array`, it can use other operator apart from `=` to bind the properties.

The name of the table, in some contexts, can be omitted (in most of the contexts), as the function can be provided with a default table name. However, it is up to one to override this default value. This can be easily achieved by putting a `.` in the property name to separate the table and the column names.

For more information about how you can use it, you can check the tests files, here:

 - [https://github.com/allnulled/mysql-auth/tree/master/test](https://github.com/allnulled/mysql-auth/tree/master/test)


### API signatures

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

##### `auth.can(token:String, privilege:Object|String, defaultPolicy:Boolean):Promise`




-----

##### `auth.canMultiple(token:String, canArgsList:Array<Object|String>):Promise`




-----

##### `auth.cannot(token:String, privilege:Object|String, defaultPolicy:Boolean):Promise`




-----

##### `auth.cannotMultiple(token:String, canArgsList:Array<Object|String>):Promise`













-----

##### `auth.confirmUser(user:Object):Promise`




-----

##### `auth.createTables():Promise`




-----

##### `auth.deletePrivilege(wherePrivilege:Object):Promise`




-----

##### `auth.deleteTables():Promise`




-----

##### `auth.deleteCommunity(whereCommunity:Object):Promise`




-----

##### `auth.deleteUnconfirmedUser(whereUnconfirmedUser:Object):Promise`




-----

##### `auth.deleteUser(whereUser:Object):Promise`




-----

##### `auth.findCommunity(whereCommunity:Object):Promise`




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

##### `auth.revokePrivilegeFromCommunity(wherePrivilege:Object, whereCommunity:Object):Promise`




-----

##### `auth.revokePrivilegeFromUser(wherePrivilege:Object, whereUser:Object):Promise`




-----

##### `auth.registerUnconfirmedUser(userDetails:Object):Promise`




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





-------

The signatures are not yet documented. If anyone asks for them, I can document them. Otherwise, this is enough for me.


## License

This project is under [WTFPL or What The Fuck Public License](https://es.wikipedia.org/wiki/WTFPL), which basically means *'do what you want'*.

## Issues

Please, share issues and suggestions [here](https://github.com/allnulled/mysql-auth).
