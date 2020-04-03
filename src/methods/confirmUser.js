/**
 * 
 * -----
 * 
 * ##### `auth.confirmUser()`
 * 
 */
module.exports = function() {
	
	this.formatConfirmUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.confirmUser = (...args) => {
		return this.onQuery("confirmUser", args);
	};
	
	this.formatConfirmUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};