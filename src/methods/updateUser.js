/**
 * 
 * ##### `auth.updateUser()`
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
	
	this.formatUpdateUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.updateUser = (...args) => {
		return this.onQuery("updateUser", args);
	};
	
	this.formatUpdateUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};