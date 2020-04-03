/**
 * 
 * ##### `auth.revokePrivilegeFromUser()`
 * 
 * @class-method
 * @asynchronous
 * @parameter 
 * @parameter `one:String` - 
 * @parameter `two:String` - 
 * @throws `Error` - 
 * @returns `Promise<?>` - 
 * @description ...
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