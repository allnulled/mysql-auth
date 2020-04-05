/**
 * 
 * -----
 * 
 * ##### `auth.unregisterPrivilege(wherePrivilege:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatUnregisterPrivilegeInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.unregisterPrivilege = async (privilegeDetails) => {
		try {
			let id = undefined;
			if (!("id" in privilegeDetails)) {
				const privilegesData = await this.findPrivilege(privilegeDetails);
				const {
					data: matched
				} = privilegesData;
				if (matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterPrivilege>");
				}
				id = matched[0].id;
			} else {
				id = privilegeDetails.id;
			}
			if (typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			const unregisteredPrivilege = await this.onQuery("unregisterPrivilege", [{ id }]);
			const deletedPrivilege = await this.onQuery("deletePrivilege", [{ id }]);
			output.push(unregisteredPrivilege);
			output.push(deletedPrivilege);
			return output;
		} catch (error) {
			this.debugError("Error on <unregisterPrivilege>:", error);
			throw error;
		}
	};
	
	this.formatUnregisterPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};