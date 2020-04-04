/**
 * 
 * -----
 * 
 * ##### `auth.unregisterUser(whereUser:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatUnregisterUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.unregisterUser = async (userDetails) => {
		try {
			let id = undefined;
			if (!("id" in userDetails)) {
				const { data: matched } = await this.findUser(userDetails);
				if (matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterUser>");
				}
				id = matched[0].id;
			} else {
				id = userDetails.id;
			}
			if (typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			const logoutResult = await this.logoutByUser({ id });
			const unregisterResult = await this.onQuery("unregisterUser", [{ id }]);
			const deleteResult = await this.deleteUser({ id });
			return { logoutResult, unregisterResult, deleteResult};
		} catch (error) {
			this.debugError("Error on <unregisterUser>:", error);
			throw error;
		}
	};
	
	this.formatUnregisterUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};