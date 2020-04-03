/**
 * 
 * -----
 * 
 * ##### `auth.revokePrivilegeFromUser()`
 * 
 */
module.exports = function() {
	
	this.formatRevokePrivilegeFromUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.revokePrivilegeFromUser = (...args) => {
		return this.onQuery("revokePrivilegeFromUser", args);
	};
	
	this.formatRevokePrivilegeFromUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};