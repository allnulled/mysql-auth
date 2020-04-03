/**
 * 
 * ##### `auth.revokePrivilegeFromCommunity()`
 * 
 * @class-method
 * @asynchronous
 * @parameter 
 * @parameter `one:String` - 
 * @parameter `two:String` - 
 * @throws `Error` - 
 * @returns `Promise<?>` - 
 * @description ...
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