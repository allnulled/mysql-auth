/**
 * 
 * ##### `auth.cannot()`
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
	
	this.formatCannotInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.cannot = (...args) => {
		return this.onQuery("cannot", args);
	};
	
	this.formatCannotOutput = (result, parameters, args, settings) => {
		return result;
	};

};