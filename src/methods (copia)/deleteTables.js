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