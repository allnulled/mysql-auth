/**
 * 
 * ##### `auth.findCommunity()`
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
	
	this.formatFindCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.findCommunity = (...args) => {
		return this.onQuery("findCommunity", args);
	};
	
	this.formatFindCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};