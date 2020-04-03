/**
 * 
 * -----
 * 
 * ##### `auth.unregisterPrivilege()`
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
			output.push(await this.onQuery("unregisterPrivilege", [{
				id
			}]));
			output.push(await this.onQuery("deletePrivilege", [{
				id
			}]));
			return output;
		} catch (error) {
			this.debugError("Error on <unregisterPrivilege>:", error);
		}
	};
	
	this.formatUnregisterPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};