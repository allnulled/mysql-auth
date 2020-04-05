/**
 * 
 * -----
 * 
 * ##### `auth.deleteUser(whereUser:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatDeleteUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.deleteUser = async (whereUser) => {
		try {
			const { data: usersFound } = await this.findUser(whereUser);
			if(usersFound.length === 0) {
				throw new Error("User was not found on <deleteUser>.");
			}
			await this.saveInHistory("$auth$user", usersFound);
			return await this.onQuery("deleteUser", [whereUser]);
		} catch(error) {
			throw error;
		}
	};
	
	this.formatDeleteUserOutput = (result, parameters, args, settings) => {
		return result;
	};

};