/**
 * 
 * -----
 * 
 * ##### `auth.refresh(whereSession:Object):Promise`
 * 
 */
const utils = require(__dirname + "/../utils.js");
const DEFAULT_REFRESH_SETTINGS = { refreshTokens: true }

module.exports = function() {
	
	this.formatRefreshInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};

	
	this.refresh = async (sessionData, settingsParameter = {}) => {
		try {
			const settings = Object.assign({}, DEFAULT_REFRESH_SETTINGS, settingsParameter);
			let newSessionData = sessionData;
			if(settings.refreshTokens) {
				newSessionData = {
					token: utils.generateToken(),
					secret_token: utils.generateToken()
				};
				await this.onQuery("refresh", [sessionData, newSessionData]);
			}
			if(typeof sessionData !== "object") {
				throw new Error("Argument 1 must be an object to <refresh>");
			}
			if(!("token" in sessionData)) {
				throw new Error("Property <token> in argument 1 must exist to <refresh>");
			}
			if(typeof sessionData.token !== "string") {
				throw new Error("Property <token> in argument 1 must be an string to <refresh>");
			}
			const { token } = sessionData;
			const newAuthentication = await this.authenticate(newSessionData, { avoidCache: true });
			delete this.sessionCache[token];
			this.sessionCache[newAuthentication.data.session.token] = newAuthentication;
			return newAuthentication;
		} catch (error) {
			this.debugError("Error on <refresh>", error);
			throw error;
		}
	};
	
	this.formatRefreshOutput = (result, parameters, args, settings) => {
		return result;
	};

};