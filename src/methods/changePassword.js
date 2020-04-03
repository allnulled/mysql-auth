/**
 * 
 * -----
 * 
 * ##### `auth.changePassword()`
 * 
 */
module.exports = function() {
	
	this.formatChangePasswordInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.changePassword = (...args) => {
		return this.onQuery("changePassword", args);
	};
	
	this.formatChangePasswordOutput = (result, parameters, args, settings) => {
		return result;
	};

};