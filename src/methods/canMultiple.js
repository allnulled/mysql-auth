/**
 * 
 * ##### `auth.canMultiple()`
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
	
	this.formatCanMultipleInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.canMultiple = (...args) => {
		return this.onQuery("canMultiple", args);
	};
	
	this.formatCanMultipleOutput = (result, parameters, args, settings) => {
		return result;
	};

};