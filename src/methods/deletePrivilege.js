/**
 * 
 * -----
 * 
 * ##### `auth.deletePrivilege(wherePrivilege:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatDeletePrivilegeInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deletePrivilege = async (wherePrivilege) => {
		try {
			const { data: privilegesFound } = await this.findPrivilege(wherePrivilege);
			if(privilegesFound.length === 0) {
				throw new Error("Privilege was not found on <deletePrivilege>.");
			}
			await this.saveInHistory("$auth$privilege", privilegesFound);
			return await this.onQuery("deletePrivilege", [wherePrivilege]);
		} catch(error) {
			throw error;
		}
	};
	
	this.formatDeletePrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};