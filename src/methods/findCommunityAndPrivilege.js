/**
 * 
 * -----
 * 
 * ##### `auth.findCommunityAndPrivilege(whereCommunity:Object, wherePrivilege:Object):Promise`
 * 
 */
module.exports = function() {

	this.formatFindCommunityAndPrivilegeInput = (args) => {
		return this.createStandardTemplateParameters({ args });
	};

	this.findCommunityAndPrivilege = (...args) => {
		return this.onQuery("findCommunityAndPrivilege", args);
	};

	this.formatFindCommunityAndPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};