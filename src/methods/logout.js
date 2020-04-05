/**
 * 
 * -----
 * 
 * ##### `auth.logout(whereSession:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatLogoutInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.logout = async (sessionDetails) => {
		try {
			const { data: sessions } = await this.findSession(sessionDetails);
			if(sessions.length === 0) {
				throw new Error("No session found to <logout>");
			}
			await this.saveInHistory("$auth$session", { id: sessions[0].id });
			return await this.onQuery("logout", [{ token: sessions[0].token }]);
		} catch(error) {
			this.debugError(error);
			throw error;
		}
	}
	
	this.formatLogoutOutput = (result, parameters, args, settings) => {
		const { data: { affectedRows } } = result;
		if(affectedRows > 0) {
			const [{ token }] = parameters;
			delete this.sessionCache[token];
		}
		return result;
	};

};