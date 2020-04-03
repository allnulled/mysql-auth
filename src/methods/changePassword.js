/**
 * 
 * ##### `auth.changePassword()`
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
	
	this.formatChangePasswordInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.changePassword = (...args) => {
		return this.onQuery("changePassword", args);
	};
	
	this.formatChangePasswordOutput = (result, parameters, args, settings) => {
		return result;
	};

};