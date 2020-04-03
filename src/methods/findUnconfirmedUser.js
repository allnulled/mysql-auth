/**
 * 
 * ##### `auth.findUnconfirmedUser()`
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
	
	this.formatFindUnconfirmedUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.findUnconfirmedUser = (...args) => {
		return this.onQuery("findUnconfirmedUser", args);
	};
	
	this.formatFindUnconfirmedUserOutput = (result, parameters, args, settings) => {
		if (result.length === 0) {
			throw new Error("No unconfirmed user found");
		}
		return result[0];
	};

};