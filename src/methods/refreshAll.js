/**
 * 
 * -----
 * 
 * ##### `auth.refreshAll():Promise`
 * 
 */
module.exports = function() {
	
	this.formatRefreshAllInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.refreshAll = async () => {
		try {
			const allSessions = this.sessionCache;
			const allTokensPromises = Object.keys(allSessions).map(token => this.refresh({ token }, { refreshTokens: false }));
			return await Promise.all(allTokensPromises);
		} catch (error) {
			this.debugError("Error on <refresAll>:", error);
			throw error;
		}
	};
	
	this.formatRefreshAllOutput = (result, parameters, args, settings) => {
		return result;
	};

};