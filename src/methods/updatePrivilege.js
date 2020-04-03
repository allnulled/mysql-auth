/**
 * 
 * ##### `auth.updatePrivilege()`
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
	
	this.formatUpdatePrivilegeInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.updatePrivilege = (...args) => {
		return this.onQuery("updatePrivilege", args);
	};
	
	this.formatUpdatePrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};