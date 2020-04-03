/**
 * 
 * -----
 * 
 * ##### `auth.revokePrivilegeFromCommunity()`
 * 
 */
module.exports = function() {
	
	this.formatRevokePrivilegeFromCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.revokePrivilegeFromCommunity = (...args) => {
		return this.onQuery("revokePrivilegeFromCommunity", args);
	};
	
	this.formatRevokePrivilegeFromCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};