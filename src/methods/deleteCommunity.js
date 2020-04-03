/**
 * 
 * ##### `auth.deleteCommunity()`
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
	
	this.formatDeleteCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deleteCommunity = (...args) => {
		return this.onQuery("deleteCommunity", args);
	};
	
	this.formatDeleteCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};