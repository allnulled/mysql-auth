/**
 * 
 * ##### `auth.createTables()`
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
	
	this.formatCreateTablesInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.createTables = (...args) => {
		return this.onQuery("createTables", args);
	};
	
	this.formatCreateTablesOutput = (result, parameters, args, settings) => {
		return result;
	};

};