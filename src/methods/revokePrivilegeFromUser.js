/**
 * 
 * -----
 * 
 * ##### `auth.revokePrivilegeFromUser(wherePrivilege:Object, whereUser:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatRevokePrivilegeFromUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.revokePrivilegeFromUser = async (...args) => {
		try {
			const [ wherePrivilege, whereUser ] = args;
			const { data: foundUsersAndPrivileges } = await this.findUserAndPrivilege(whereUser, wherePrivilege);
			if(foundUsersAndPrivileges.length === 0) {
				throw new Error("No <userAndPrivilege> rule found to <revokePrivilegeFromUser>");
			}
			await this.saveInHistory("$auth$user_and_privilege", foundUsersAndPrivileges);
			return this.onQuery("revokePrivilegeFromUser", args);
		} catch(error) {
			throw error;
		}
	};
	
	this.formatRevokePrivilegeFromUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};