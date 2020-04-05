/**
 * 
 * -----
 * 
 * ##### `auth.revokePrivilegeFromCommunity(wherePrivilege:Object, whereCommunity:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatRevokePrivilegeFromCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.revokePrivilegeFromCommunity = async (...args) => {
		try {
			const [ wherePrivilege, whereCommunity ] = args;
			const { data: foundPrivilegesAndCommmunities } = await this.findCommunityAndPrivilege(whereCommunity, wherePrivilege);
			if(foundPrivilegesAndCommmunities.length === 0) {
				throw new Error("No <communityAndPrivilege> rule found to <revokePrivilegeFromCommunity>");
			}
			await this.saveInHistory("$auth$community_and_privilege", foundPrivilegesAndCommmunities);
			return this.onQuery("revokePrivilegeFromCommunity", args);
		} catch(error) {
			throw error;
		}
	};
	
	this.formatRevokePrivilegeFromCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};