/**
 * 
 * -----
 * 
 * ##### `auth.revokeUserFromCommunity(whereUser:Object, whereCommunity:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatRevokeUserFromCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.revokeUserFromCommunity = async (...args) => {
		try {
			const [ whereUser, whereCommunity ] = args;
			const { data: foundUsersAndCommmunities } = await this.findUserAndCommunity(whereUser, whereCommunity);
			if(foundUsersAndCommmunities.length === 0) {
				throw new Error("No <userAndCommunity> rule found to <revokeUserFromCommunity>");
			}
			await this.saveInHistory("$auth$user_and_community", foundUsersAndCommmunities);
			return this.onQuery("revokeUserFromCommunity", args);
		} catch(error) {
			throw error;
		}
	};
	
	this.formatRevokeUserFromCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};