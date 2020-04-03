/**
 * 
 * ##### `auth.checkUserUnicity()`
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
	
	this.formatCheckUserUnicityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.checkUserUnicity = (...args) => {
		return this.onQuery("checkUserUnicity", args);
	};
	
	this.formatCheckUserUnicityOutput = (result, parameters, args, settings) => {
		return result;
	};

};