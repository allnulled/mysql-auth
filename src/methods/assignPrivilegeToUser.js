/**
 * 
 * ##### `auth.assignPrivilegeToUser()`
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
	
	this.formatAssignPrivilegeToUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.assignPrivilegeToUser = (...args) => {
		return this.onQuery("assignPrivilegeToUser", args);
	};
	
	this.formatAssignPrivilegeToUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};