module.exports = function() {
	
	this.formatCannotMultipleInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.cannotMultiple = (...args) => {
		return this.onQuery("cannotMultiple", args);
	};
	
	this.formatCannotMultipleOutput = (result, parameters, args, settings) => {
		return result;
	};

};