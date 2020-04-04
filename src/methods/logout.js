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
	
	this.logout = (...args) => {
		return this.onQuery("logout", args);
	};
	
	this.formatLogoutOutput = (result, parameters, args, settings) => {
		const { data: { affectedRows } } = result;
		if(affectedRows > 0) {
			const [{ token }] = parameters;
			delete this.sessionCache[token];
		}
		return result;
	};

};