module.exports = function() {
	
	this.formatDeleteUnconfirmedUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deleteUnconfirmedUser = (...args) => {
		return this.onQuery("deleteUnconfirmedUser", args);
	};
	
	this.formatDeleteUnconfirmedUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};