
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



