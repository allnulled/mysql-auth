/**
 * 
 * -----
 * 
 * ##### `auth.unregisterCommunity()`
 * 
 */
module.exports = function() {
	
	this.formatUnregisterCommunityInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.unregisterCommunity = async (communityDetails) => {
		try {
			let id = undefined;
			if (!("id" in communityDetails)) {
				const {
					data: matched
				} = await this.findCommunity(communityDetails);
				if (matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterCommunity>");
				}
				id = matched[0].id;
			} else {
				id = communityDetails.id;
			}
			if (typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			output.push(await this.onQuery("unregisterCommunity", [{
				id
			}]));
			output.push(await this.onQuery("deleteCommunity", [{
				id
			}]));
			return output;
		} catch (error) {
			this.debugError("Error in <unregisterCommunity>:", error);
		}
	};
	
	this.formatUnregisterCommunityOutput = (result, parameters, args, settings) => {
		return result;
	};

};