/**
 * 
 * ##### `auth.deleteTables()`
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
	
	this.formatDeleteTablesInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deleteTables = (...args) => {
		return this.onQuery("deleteTables", args);
	};
	
	this.formatDeleteTablesOutput = (result, parameters, args, settings) => {
		return result;
	};

};