/**
 * 
 * -----
 * 
 * ##### `auth.authenticate(whereSession:Object, settings:Object):Promise`
 * 
 */
const utils = require(__dirname + "/../utils.js");

module.exports = function() {
	
	this.formatAuthenticateInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.authenticate = (...args) => {
		return this.onQuery("authenticate", args);
	};
	
	this.formatAuthenticateOutput = async (result, parameters, args, settings) => {
		try {
			const [{ token }] = parameters;
			const queryData = result.data;
			if (queryData === null || queryData.length === 0) {
				throw new Error("Authentication error: provided credentials were not matched");
			}
			const sessionData = {
				user: utils.rowsToObject(queryData, "user", "id"),
				community: utils.rowsToObject(queryData, "community", "id"),
				privilege: utils.rowsToObject(queryData, "privilege", "id"),
				session: utils.rowsToObject(queryData, "session", "id"),
			};
			if (sessionData.user.length !== 1) {
				throw new Error("Authentication error: no <user> found for provided credentials");
			}
			if (sessionData.session.length !== 1) {
				throw new Error("Authentication error: no <session> found for provided credentials");
			}
			sessionData.user = sessionData.user[0];
			sessionData.session = sessionData.session[0];
			const output = {
				data: sessionData,
				originalData: result,
				fields: result.fields
			};
			this.setSessionCacheToken(token, output);
			return output;
		} catch(error) {
			this.debugError("Error on <authenticate>:", error);
			throw error;
		}
	};

};