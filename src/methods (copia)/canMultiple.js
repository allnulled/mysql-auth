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