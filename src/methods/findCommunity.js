/**
 * 
 * -----
 * 
 * ##### `auth.findCommunity(whereCommunity:Object):Promise`
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