/**
 * 
 * -----
 * 
 * ##### `auth.findPrivilege()`
 * 
 */
module.exports = function() {
	
	this.formatFindPrivilegeInput = async (args, settings) => {
		try {
			const [userDetails] = args;
			if (!("password" in userDetails)) {
				throw new Error("Required property <password> in argument 1 to <formatInForRegisterUnconfirmedUser>");
			}
			if (typeof(userDetails.password) !== "string") {
				throw new Error("Required property <password> in argument 1 to be a string to <formatInForRegisterUnconfirmedUser>");
			}
			if (userDetails.password.length < 6) {
				throw new Error("Required property <password> in argument 1 to be a string of 6 characters minimum to <formatInForRegisterUnconfirmedUser>");
			}
			if (userDetails.password.length > 20) {
				console.log(userDetails.password.length);
				throw new Error("Required property <password> in argument 1 to be a string of 20 characters maximum to <formatInForRegisterUnconfirmedUser>");
			}
			const {
				data: [{
					total: usernamesMatched
				}]
			} = await this.$query("SELECT COUNT(*) AS 'total' FROM $auth$user LEFT JOIN $auth$unconfirmed_user ON 1=1 WHERE $auth$user.name = " + SQL.escape(userDetails.name) + " OR $auth$unconfirmed_user.name = " + SQL.escape(userDetails.name) + ";");
			if (usernamesMatched !== 0) {
				throw new Error("Required property <name> to be unique to register a user");
			}
			const password = await this.encryptPassword(userDetails.password, 10);
			return this.createStandardTemplateParameters({
				args: [Object.assign({}, userDetails, {
					password
				})]
			});
		} catch (error) {
			this.debugError("Error in <formatInForRegisterUnconfirmedUser>:", error);
			throw error;
		}
	};
	
	this.findPrivilege = (...args) => {
		return this.onQuery("findPrivilege", args);
	};
	
	this.formatFindPrivilegeOutput = (result, parameters, args, settings) => {
		return result;
	};

};