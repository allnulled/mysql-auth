/**
 * 
 * -----
 * 
 * ##### `auth.deleteCommunity(whereCommunity:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatDeleteCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deleteCommunity = async (whereCommunity) => {
		try {
			const { data: communitiesFound } = await this.findCommunity(whereCommunity);
			if(communitiesFound.length === 0) {
				throw new Error("Community was not found on <deleteCommunity>.");
			}
			await this.saveInHistory("$auth$community", communitiesFound);
			return await this.onQuery("deleteCommunity", [whereCommunity]);
		} catch(error) {
			throw error;
		}
	};
	
	this.formatDeleteCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};