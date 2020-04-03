/**
 * 
 * ##### `auth.registerCommunity()`
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