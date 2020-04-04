/**
 * 
 * -----
 * 
 * ##### `auth.logoutByUser(whereUser:Object):Promise`
 * 
 */
module.exports = function() {
	
	this.formatLogoutByUserInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.logoutByUser = async (userDetails) => {
		try {
			const { data: sessions } = await this.findSessionByUser(userDetails);
			if(sessions.length === 0) {
				throw new Error("No session found to <logoutByUser>");
			}
			const logoutParameters = [userDetails, { token: sessions[0].token }];
			return await this.onQuery("logoutByUser", logoutParameters);
		} catch(error) {
			this.debugError(error);
			throw error;
		}
	};
	
	this.formatLogoutByUserOutput = (result, parameters, args, settings) => {
		const { data: { affectedRows } } = result;
		if(affectedRows > 0) {
			const [userDetails, { token }] = parameters;
			if(!token in this.sessionCache) {
				throw new Error("No session cached found to <logoutByUser>");
			}
			delete this.sessionCache[token];
		}
		return result;
	};

};