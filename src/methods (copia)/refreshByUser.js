module.exports = function() {
	
	this.formatRefreshInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.refreshByUser = async (sessionData) => {
		try {
			const sessionData = {
				token: utils.generateToken(),
				secret_token: utils.generateToken()
			};
			await this.onQuery("refreshByUser", [whereUser, sessionData]);
			return await this.authenticate(sessionData);
		} catch (error) {
			this.debugError("Error on login", error);
		}
	};
	
	this.formatRefreshOutput = (result, parameters, args, settings) => {
		return result;
	};

};