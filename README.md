# mysql-auth

Still have to do some things.



##### `const AuthSystem = require("mysql-auth")`






##### `const authSystem = AuthSystem.create(...)`





##### `authSystem.initialize():Promise<?>`



**Description**:  Initializes the `auth` system:

  - creates a pool connection
  - caches the query templates




##### `authSystem.assignPrivilegeToCommunity(wherePrivilege:Object, whereCommunity:Object):Promise<?>`




##### `authSystem.assignPrivilegeToUser(wherePrivilege:Object, whereUser:Object):Promise<?>`




##### `authSystem.assignUserToCommunity(whereUser:Object, whereCommunity:Object):Promise<?>`




##### `authSystem.authenticate(token:String):Promise<?>`




##### `authSystem.checkUserUnicity(...):Promise<?>`




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




