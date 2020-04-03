module.exports = function() {
	
	this.formatFindUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.findUser = (...args) => {
		return this.onQuery("findUser", args);
	};
	
	this.formatFindUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};