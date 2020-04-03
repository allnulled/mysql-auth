/**
 * 
 * -----
 * 
 * ##### `auth.registerCommunity()`
 * 
 */
module.exports = function() {
	
	this.formatRegisterCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.registerCommunity = (...args) => {
		return this.onQuery("registerCommunity", args);
	};
	
	this.formatRegisterCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};