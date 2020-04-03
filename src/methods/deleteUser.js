/**
 * 
 * ##### `auth.deleteUser()`
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
	
	this.formatDeleteUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deleteUser = (...args) => {
		return this.onQuery("deleteUser", args);
	};
	
	this.formatDeleteUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};