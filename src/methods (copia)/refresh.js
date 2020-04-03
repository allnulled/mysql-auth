const utils = require(__dirname + "/../utils.js");

module.exports = function() {
	
	this.formatRefreshInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.refresh = async (sessionData) => {
		try {
			const newSessionData = {
				token: utils.generateToken(),
				secret_token: utils.generateToken()
			};
			await this.onQuery("refresh", [sessionData, newSessionData]);
			return await this.authenticate(newSessionData);
		} catch (error) {
			this.debugError("Error on login", error);
		}
	};
	
	this.formatRefreshOutput = (result, parameters, args, settings) => {
		return result;
	};

};