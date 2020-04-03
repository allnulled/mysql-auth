/**
 * 
 * ##### `auth.revokeUserFromCommunity()`
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