/**
 * 
 * -----
 * 
 * ##### `auth.findUserAndCommunity(whereUser:Object, whereCommunity:Object):Promise`
 * 
 */
module.exports = function() {

	this.formatFindUserAndCommunityInput = (args) => {
		return this.createStandardTemplateParameters({ args });
	};

	this.findUserAndCommunity = (...args) => {
		return this.onQuery("findUserAndCommunity", args);
	};

	this.formatFindUserAndCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};