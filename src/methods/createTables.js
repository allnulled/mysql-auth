/**
 * 
 * -----
 * 
 * ##### `auth.createTables():Promise`
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