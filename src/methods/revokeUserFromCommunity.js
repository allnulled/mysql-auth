/**
 * 
 * -----
 * 
 * ##### `auth.revokeUserFromCommunity()`
 * 
 */
module.exports = function() {
	
	this.formatRevokeUserFromCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.revokeUserFromCommunity = (...args) => {
		return this.onQuery("revokeUserFromCommunity", args);
	};
	
	this.formatRevokeUserFromCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};