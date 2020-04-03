/**
 * 
 * -----
 * 
 * ##### `auth.cannot()`
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