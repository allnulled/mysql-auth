/**
 * 
 * -----
 * 
 * ##### `auth.login(whereUser:Object):Promise`
 * 
 */
const bcrypt = require("bcrypt");
const utils = require(__dirname + "/../utils.js");

module.exports = function() {
	
	this.formatLoginInput = (args, settings) => {
		return this.createStandardTemplateParameters({ args });
	};
	
	this.login = async (userData) => {
		try {
			const userDataInput = Object.assign({}, userData);
			delete userDataInput.password;
			const {
				data: foundUsers
			} = await this.findUser(userDataInput);
			if (foundUsers.length !== 1) {
				throw new Error("Login error: No <user> found by specified properties");
			}
			const foundUser = foundUsers[0];
			const { password } = userData;
			const { data: sessionsFound } = await this.findSessionByUser({ id: foundUser.id });
			if(sessionsFound.length > 0) {
				return await this.authenticate({ token: sessionsFound[0].token });
			}
			await new Promise((ok, fail) => {
				bcrypt.compare(password, foundUser.password, (error, isEqual) => {
					if (error) {
						return fail(error);
					}
					if (!isEqual) {
						return fail(new Error("Login error: <password> is not correct for <" + password + ">"));
					}
					return ok(true);
				});
			});
			const sessionData = {
				token: utils.generateToken(),
				secret_token: utils.generateToken()
			};
			await this.onQuery("login", [{ id: foundUser.id }, sessionData]);
			return await this.authenticate(sessionData);
		} catch (error) {
			this.debugError("Error on <login>:", error);
			throw error;
		}
	};
	
	this.formatLoginOutput = (result, parameters, args, settings) => {
		return result;
	};

};