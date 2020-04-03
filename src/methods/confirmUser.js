/**
 * 
 * ##### `auth.confirmUser()`
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
	
	this.formatConfirmUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.confirmUser = (...args) => {
		return this.onQuery("confirmUser", args);
	};
	
	this.formatConfirmUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};