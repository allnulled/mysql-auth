/**
 * 
 * ##### `auth.logout()`
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
	
	this.formatLogoutInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.logout = (...args) => {
		return this.onQuery("logout", args);
	};
	
	this.formatLogoutOutput = (result, parameters, args, settings) => {
		return result;
	};

};