/**
 * 
 * -----
 * 
 * ##### `auth.findPrivilege(wherePrivilege:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatFindPrivilegeInput = async (args, settings) => {
		try {
			const [privilegeDetails] = args;
			if(typeof privilegeDetails !== "object") {
				throw new Error("Argument 1 must be an object to <formatFindPrivilegeInput>")
			}
			return this.createStandardTemplateParameters({
				args: [Object.assign({}, privilegeDetails)]
			});
		} catch (error) {
			this.debugError("Error on <formatFindPrivilegeInput>:", error);
			throw error;
		}
	};
	
	this.findPrivilege = (...args) => {
		return this.onQuery("findPrivilege", args);
	};
	
	this.formatFindPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};