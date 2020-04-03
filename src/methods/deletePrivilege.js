/**
 * 
 * ##### `auth.deletePrivilege()`
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
	
	this.formatDeletePrivilegeInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deletePrivilege = (...args) => {
		return this.onQuery("deletePrivilege", args);
	};
	
	this.formatDeletePrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};