/**
 * 
 * ##### `auth.registerPrivilege()`
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
	
	this.formatRegisterPrivilegeInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.registerPrivilege = (...args) => {
		return this.onQuery("registerPrivilege", args);
	};
	
	this.formatRegisterPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};