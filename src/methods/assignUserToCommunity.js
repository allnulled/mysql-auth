/**
 * 
 * ##### `auth.assignUserToCommunity()`
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
	
	this.formatAssignUserToCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.assignUserToCommunity = (...args) => {
		return this.onQuery("assignUserToCommunity", args);
	};
	
	this.formatAssignUserToCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};