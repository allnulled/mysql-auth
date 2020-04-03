/**
 * 
 * ##### `auth.findUser()`
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
	
	this.formatFindUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.findUser = (...args) => {
		return this.onQuery("findUser", args);
	};
	
	this.formatFindUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};