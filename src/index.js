const Debug = require("debug");
const debug = Debug("mysql-auth");
const SQL = require("sqlstring");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const AuthClient = require(__dirname + "/auth-client.js");
const utils = require(__dirname + "/utils.js");
const debugError = Debug("mysql-auth:error");
const trace = Debug("mysql-auth:trace");

global.dd = function(...args) {
	console.log(...args)
	console.log("----- PROGRAM DIED -----");
	process.exit(0);
}

/**
 * 
 * ##### `const AuthSystem = require("mysql-auth")`
 * 
 * 
 * 
 */
class AuthSystem {

	/**
	 * 
	 * ##### `const authSystem = AuthSystem.create(...)`
	 * 
	 * 
	 */
	static create(...args) {
		return new this(...args);
	}

	static get CLIENT_CLASS() {
		return AuthClient;
	}

	static get DEFAULT_OPTIONS() {
		return {
			connectionSettings: {},
			queryTemplates: {},
			sessionsCache: {},
			debug: false,
			silence: false,
		};
	}

	static get DEFAULT_CONNECTION_SETTINGS() {
		return {
			user: "test",
			password: "test",
			database: "test",
			host: "127.0.0.1",
			port: 3306,
			multipleStatements: true,
		}
	}

	static get SESSION_CACHE() {
		return {};
	}

	static get DEFAULT_QUERY_TEMPLATES() {
		return {
			"assignPrivilegeToCommunity": __dirname + "/queries/assign privilege to community.sql.ejs",
			"assignPrivilegeToUser": __dirname + "/queries/assign privilege to user.sql.ejs",
			"assignUserToCommunity": __dirname + "/queries/assign user to community.sql.ejs",
			"authenticate": __dirname + "/queries/authenticate.sql.ejs",
			"can": __dirname + "/queries/can.sql.ejs",
			"cannot": __dirname + "/queries/cannot.sql.ejs",
			"canMultiple": __dirname + "/queries/can multiple.sql.ejs",
			"cannotMultiple": __dirname + "/queries/cannot multiple.sql.ejs",
			"checkUserUnicity": __dirname + "/queries/check user unicity.sql.ejs",
			"confirmUser": __dirname + "/queries/confirm user.sql.ejs",
			"createTables": __dirname + "/queries/create tables.sql.ejs",
			"deleteCommunity": __dirname + "/queries/delete community.sql.ejs",
			"deletePrivilege": __dirname + "/queries/delete privilege.sql.ejs",
			"deleteTables": __dirname + "/queries/delete tables.sql.ejs",
			"deleteUser": __dirname + "/queries/delete user.sql.ejs",
			"deleteUnconfirmedUser": __dirname + "/queries/delete unconfirmed user.sql.ejs",
			"findCommunity": __dirname + "/queries/find community.sql.ejs",
			"findPrivilege": __dirname + "/queries/find privilege.sql.ejs",
			"findUser": __dirname + "/queries/find user.sql.ejs",
			"findUnconfirmedUser": __dirname + "/queries/find unconfirmed user.sql.ejs",
			"login": __dirname + "/queries/login.sql.ejs",
			"logout": __dirname + "/queries/logout.sql.ejs",
			"refresh": __dirname + "/queries/refresh.sql.ejs",
			"registerCommunity": __dirname + "/queries/register community.sql.ejs",
			"registerPrivilege": __dirname + "/queries/register privilege.sql.ejs",
			"registerUnconfirmedUser": __dirname + "/queries/register unconfirmed user.sql.ejs",
			"revokePrivilegeFromCommunity": __dirname + "/queries/revoke privilege from community.sql.ejs",
			"revokePrivilegeFromUser": __dirname + "/queries/revoke privilege from user.sql.ejs",
			"revokeUserFromCommunity": __dirname + "/queries/revoke user from community.sql.ejs",
			"unregisterCommunity": __dirname + "/queries/unregister community.sql.ejs",
			"unregisterPrivilege": __dirname + "/queries/unregister privilege.sql.ejs",
			"unregisterUser": __dirname + "/queries/unregister user.sql.ejs",
			"updateCommunity": __dirname + "/queries/update community.sql.ejs",
			"updatePrivilege": __dirname + "/queries/update privilege.sql.ejs",
			"updateUser": __dirname + "/queries/update user.sql.ejs",
		};
	}

	encryptPassword(password, salts, callback) {
		return new Promise((ok, fail) => {
			bcrypt.hash(password, salts, (error, hash) => {
				if (error) {
					return fail(error);
				}
				return ok(hash);
			});
		});
	}

	constructor(options = {}) {
		Object.assign(this, this.constructor.DEFAULT_OPTIONS, options);
		if (this.debug) {
			Debug.enable("mysql-auth,mysql-auth:error,mysql-auth:trace");
		} else if (this.silence === false) {
			Debug.enable("mysql-auth:error");
		}
		this.connectionSettings = Object.assign({}, this.constructor.DEFAULT_CONNECTION_SETTINGS, options.connectionSettings || {});
		this.queryTemplates = Object.assign({}, this.constructor.DEFAULT_QUERY_TEMPLATES, options.queryTemplates || {});
		debug("Connection settings:", this.connectionSettings);
	}

	createClient(options = {}) {
		const ClientClass = this.constructor.CLIENT_CLASS;
		return new ClientClass(Object.assign({
			system: this
		}, options));
	}

	/**
	 * 
	 * ##### `authSystem.initialize():Promise<?>`
	 * 
	 */
	initialize() {
		trace("initialize");
		this.connection = mysql.createPool(this.connectionSettings);
		this.queries = Object.keys(this.queryTemplates).reduce((output, method) => {
			const filename = this.queryTemplates[method];
			if (typeof filename !== "string") {
				throw new Error("")
				throw new Error("Property AuthSystem#queryTemplates.<" + method + "> should exist");
			}
			const filepath = path.resolve(filename);
			if (!fs.existsSync(filepath)) {
				throw new Error("Property AuthSystem#queryTemplates.<" + method + "> should be an existing file");
			}
			const contents = fs.readFileSync(filepath).toString();
			output[method] = contents;
			return output;
		}, {});
		return this;
	}

	formatInByTemplate(template, parameters, settings) {
		trace("format_parameters_by_template", template);
		const methodName = "formatInFor" + template.substr(0, 1).toUpperCase() + template.substr(1);
		if (!(methodName in this)) {
			throw new Error("Required method AuthSystem#<" + methodName + ">");
		}
		return this[methodName](parameters, settings);
	}

	formatOutByTemplate(template, result, parameters, settings) {
		trace("format_result_by_template", template);
		const methodName = "formatOutFor" + template.substr(0, 1).toUpperCase() + template.substr(1);
		if (!(methodName in this)) {
			throw new Error("Required method AuthSystem#<" + methodName + ">");
		}
		return this[methodName](result, parameters, settings);
	}

	createStandardTemplateParameters(parameters) {
		trace("create_standard_template_parameters");
		return {
			authSystem: this,
			require: require,
			process: process,
			ejs: ejs,
			path: path,
			debug: debug,
			utils: utils,
			SQL: SQL,
			...parameters
		}
	}

	$query(query) {
		trace("$query");
		debug("[SQL] " + query);
		return new Promise((ok, fail) => {
			this.connection.query(query, (error, data, fields) => {
				if (error) {
					return fail(error);
				}
				return ok({
					data,
					fields
				});
			});
		});
	}

	gotFromCache(template, parameters, settings) {
		trace("got_from_cache");
		// @TODO: make cache system work
		return;
	}

	async queryByTemplate(template, parameters, settings) {
		trace("query_by_template", template);
		try {
			// get from cache, if any!
			const hasCached = await this.gotFromCache(template, parameters, settings);
			if (typeof hasCached !== "undefined") {
				return hasCached;
			}
			const queryTemplate = this.queries[template];
			if (typeof queryTemplate !== "string") {
				throw new Error("Query MySQLAuth#queries.<" + queryTemplate + "> is of type " + typeof(queryTemplate) + " instead of <string>");
			}
			const queryParameters = await this.formatInByTemplate(template, parameters, settings);
			//await nodelive.editor({ auth:this, template, queryTemplate, queryParameters });
			let querySource;
			try {
				querySource = ejs.render(queryTemplate, queryParameters, {});
			} catch (error) {
				debugError("Error rendering <" + template + ">:", error);
				throw error;
			}
			const result = await this.$query(querySource);
			const formattedResult = await this.formatOutByTemplate(template, result, parameters, settings);
			return formattedResult;
		} catch (error) {
			debugError("Error querying <" + template + ">:", error);
			throw error;
		}
	}

	/**
	 * 
	 * ##### `authSystem.assignPrivilegeToCommunity(wherePrivilege:Object, whereCommunity:Object):Promise<?>`
	 * 
	 */
	assignPrivilegeToCommunity(...args) {
		return this.queryByTemplate("assignPrivilegeToCommunity", args);
	}

	/**
	 * 
	 * ##### `authSystem.assignPrivilegeToUser(wherePrivilege:Object, whereUser:Object):Promise<?>`
	 * 
	 */
	assignPrivilegeToUser(...args) {
		return this.queryByTemplate("assignPrivilegeToUser", args);
	}

	/**
	 * 
	 * ##### `authSystem.assignUserToCommunity(whereUser:Object, whereCommunity:Object):Promise<?>`
	 * 
	 */
	assignUserToCommunity(...args) {
		return this.queryByTemplate("assignUserToCommunity", args);
	}

	/**
	 * 
	 * ##### `authSystem.authenticate(token:String):Promise<?>`
	 * 
	 */
	authenticate(...args) {
		return this.queryByTemplate("authenticate", args);
	}

	/**
	 * 
	 * ##### `authSystem.can(token:String, privilege:String):Promise<?>`
	 * 
	 */
	async can(token, privilege) {

	}

	/**
	 * 
	 * ##### `authSystem.cannot(token:String, privilege:String):Promise<?>`
	 * 
	 */
	async cannot(token, privilege) {

	}

	/**
	 * 
	 * ##### `authSystem.canMultiple(token:String, privilege:Array<String>):Promise<?>`
	 * 
	 */
	async canMultiple(token, privilege) {

	}

	/**
	 * 
	 * ##### `authSystem.cannotMultiple(token:String, privilege:Array<String>):Promise<?>`
	 * 
	 */
	async cannotMultiple(token, privilege) {

	}

	/**
	 * 
	 * ##### `authSystem.changePassword(oldPassword:String, newPassword:String):Promise<?>`
	 * 
	 */
	changePassword(...args) {
		return this.queryByTemplate("changePassword", args);
	}

	/**
	 * 
	 * ##### `authSystem.checkUserUnicity(whereUser:Object):Promise<?>`
	 * 
	 */
	checkUserUnicity(...args) {
		return this.queryByTemplate("checkUserUnicity", args);
	}

	/**
	 * 
	 * ##### `authSystem.confirmUser(whereUser:Object):Promise<?>`
	 * 
	 */
	confirmUser(...args) {
		return this.queryByTemplate("confirmUser", args);
	}

	/**
	 * 
	 * ##### `authSystem.createTables():Promise<?>`
	 * 
	 */
	createTables(...args) {
		return this.queryByTemplate("createTables", args);
	}

	/**
	 * 
	 * ##### `authSystem.deleteCommunity(whereCommunity:Object):Promise<?>`
	 * 
	 */
	deleteCommunity(...args) {
		return this.queryByTemplate("deleteCommunity", args);
	}

	/**
	 * 
	 * ##### `authSystem.deleteUser(whereUser:Object):Promise<?>`
	 * 
	 */
	deleteUser(...args) {
		return this.queryByTemplate("deleteUser", args);
	}

	/**
	 * 
	 * ##### `authSystem.deletePrivilege(wherePrivilege:Object):Promise<?>`
	 * 
	 */
	deletePrivilege(...args) {
		return this.queryByTemplate("deletePrivilege", args);
	}

	/**
	 * 
	 * ##### `authSystem.deleteTables():Promise<?>`
	 * 
	 */
	deleteTables(...args) {
		return this.queryByTemplate("deleteTables", args);
	}

	/**
	 * 
	 * ##### `authSystem.deleteUnconfirmedUser(whereUnconfirmedUser:Object):Promise<?>`
	 * 
	 */
	deleteUnconfirmedUser(...args) {
		return this.queryByTemplate("deleteUnconfirmedUser", args);
	}

	/**
	 * 
	 * ##### `authSystem.findUnconfirmedUser(whereUnconfirmedUser:Object):Promise<?>`
	 * 
	 */
	findUnconfirmedUser(...args) {
		return this.queryByTemplate("findUnconfirmedUser", args);
	}

	/**
	 * 
	 * ##### `authSystem.findCommunity(whereCommunity:Object):Promise<?>`
	 * 
	 */
	findCommunity(...args) {
		return this.queryByTemplate("findCommunity", args);
	}

	/**
	 * 
	 * ##### `authSystem.findPrivilege(wherePrivilege:Object):Promise<?>`
	 * 
	 */
	findPrivilege(...args) {
		return this.queryByTemplate("findPrivilege", args);
	}

	/**
	 * 
	 * ##### `authSystem.findUser(whereUser:Object):Promise<?>`
	 * 
	 */
	findUser(...args) {
		return this.queryByTemplate("findUser", args);
	}

	/**
	 * 
	 * ##### `authSystem.registerUnconfirmedUser(user:Object):Promise<?>`
	 * 
	 */
	registerUnconfirmedUser(...args) {
		return this.queryByTemplate("registerUnconfirmedUser", args);
	}

	/**
	 * 
	 * ##### `authSystem.login(user:Object):Promise<?>`
	 * 
	 */
	async login(userData) {
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
			const {
				password
			} = userData;
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
			await this.queryByTemplate("login", [{
				id: foundUser.id
			}, sessionData]);
			return await this.authenticate(sessionData);
		} catch (error) {
			debugError("Error on login", error);
		}
	}

	/**
	 * 
	 * ##### `authSystem.logout(token:String):Promise<?>`
	 * 
	 */
	logout(...args) {
		return this.queryByTemplate("logout", args);
	}

	/**
	 * 
	 * ##### `authSystem.refresh(whereSession:String):Promise<?>`
	 * 
	 */
	async refresh(sessionData) {
		try {
			const newSessionData = {
				token: utils.generateToken(),
				secret_token: utils.generateToken()
			};
			await this.queryByTemplate("refresh", [sessionData, newSessionData]);
			return await this.authenticate(newSessionData);
		} catch (error) {
			debugError("Error on login", error);
		}
	}

	/**
	 * 
	 * ##### `authSystem.refresh(whereUser:String):Promise<?>`
	 * 
	 */
	async refreshByUser(whereUser) {
		try {
			const sessionData = {
				token: utils.generateToken(),
				secret_token: utils.generateToken()
			};
			await this.queryByTemplate("refreshByUser", [whereUser, sessionData]);
			return await this.authenticate(sessionData);
		} catch (error) {
			debugError("Error on login", error);
		}
	}

	/**
	 * 
	 * ##### `authSystem.registerCommunity(community:Object):Promise<?>`
	 * 
	 */
	registerCommunity(...args) {
		return this.queryByTemplate("registerCommunity", args);
	}

	/**
	 * 
	 * ##### `authSystem.registerPrivilege(privilege:Object):Promise<?>`
	 * 
	 */
	registerPrivilege(...args) {
		return this.queryByTemplate("registerPrivilege", args);
	}

	resetSchema(...args) {
		return this.queryByTemplate("resetSchema", args);
	}

	/**
	 * 
	 * ##### `authSystem.revokePrivilegeFromCommunity(wherePrivilege:Object, whereCommunity:Object):Promise<?>`
	 * 
	 */
	revokePrivilegeFromCommunity(...args) {
		return this.queryByTemplate("revokePrivilegeFromCommunity", args);
	}

	/**
	 * 
	 * ##### `authSystem.revokePrivilegeFromUser(wherePrivilege:Object, whereUser:Object):Promise<?>`
	 * 
	 */
	revokePrivilegeFromUser(...args) {
		return this.queryByTemplate("revokePrivilegeFromUser", args);
	}

	/**
	 * 
	 * ##### `authSystem.revokeUserFromCommunity(whereUser:Object, whereCommunity:Object):Promise<?>`
	 * 
	 */
	revokeUserFromCommunity(...args) {
		return this.queryByTemplate("revokeUserFromCommunity", args);
	}

	/**
	 * 
	 * ##### `authSystem.unregisterCommunity(whereCommunity:Object):Promise<?>`
	 * 
	 */
	async unregisterCommunity(communityDetails) {
		try {
			let id = undefined;
			if (!("id" in communityDetails)) {
				const {
					data: matched
				} = await this.findCommunity(communityDetails);
				if (matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterCommunity>");
				}
				id = matched[0].id;
			} else {
				id = communityDetails.id;
			}
			if (typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			output.push(await this.queryByTemplate("unregisterCommunity", [{
				id
			}]));
			output.push(await this.queryByTemplate("deleteCommunity", [{
				id
			}]));
			return output;
		} catch (error) {
			debugError("Error on unregisterCommunity:", error);
		}
	}

	/**
	 * 
	 * ##### `authSystem.unregisterPrivilege(wherePrivilege:Object):Promise<?>`
	 * 
	 */
	async unregisterPrivilege(privilegeDetails) {
		try {
			let id = undefined;
			if (!("id" in privilegeDetails)) {
				const privilegesData = await this.findPrivilege(privilegeDetails);
				const {
					data: matched
				} = privilegesData;
				if (matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterPrivilege>");
				}
				id = matched[0].id;
			} else {
				id = privilegeDetails.id;
			}
			if (typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			output.push(await this.queryByTemplate("unregisterPrivilege", [{
				id
			}]));
			output.push(await this.queryByTemplate("deletePrivilege", [{
				id
			}]));
			return output;
		} catch (error) {
			debugError("Error on unregisterPrivilege:", error);
		}
	}

	/**
	 * 
	 * ##### `authSystem.unregisterUser(whereUser:Object):Promise<?>`
	 * 
	 */
	async unregisterUser(userDetails) {
		try {
			let id = undefined;
			if (!("id" in userDetails)) {
				const {
					data: matched
				} = await this.findUser(userDetails);
				if (matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterUser>");
				}
				id = matched[0].id;
			} else {
				id = userDetails.id;
			}
			if (typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			output.push(await this.queryByTemplate("unregisterUser", [{
				id
			}]));
			output.push(await this.queryByTemplate("deleteUser", [{
				id
			}]));
			return output;
		} catch (error) {
			debugError("Error on unregisterUser:", error);
		}
	}

	/**
	 * 
	 * ##### `authSystem.updateCommunity(whereCommunity:Object, values:Object):Promise<?>`
	 * 
	 */
	updateCommunity(...args) {
		return this.queryByTemplate("updateCommunity", args);
	}

	/**
	 * 
	 * ##### `authSystem.updatePrivilege(wherePrivilege:Object, values:Object):Promise<?>`
	 * 
	 */
	updatePrivilege(...args) {
		return this.queryByTemplate("updatePrivilege", args);
	}

	/**
	 * 
	 * ##### `authSystem.updateUser(whereUser:Object, values:Object):Promise<?>`
	 * 
	 */
	updateUser(...args) {
		return this.queryByTemplate("updateUser", args);
	}

	formatInForAssignPrivilegeToCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForAssignPrivilegeToUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForAssignUserToCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForAuthenticate(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForCan(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForCannot(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForCanMultiple(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForCannotMultiple(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForChangePassword(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForCheckUserUnicity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForConfirmUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForCreateTables(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForDeleteTables(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForDeleteUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForDeleteCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForDeletePrivilege(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForDeleteUnconfirmedUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForFindUnconfirmedUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForFindUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForFindCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForFindPrivilege(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	async formatInForRegisterUnconfirmedUser(args, settings) {
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
			debugError("Error in <formatInForRegisterUnconfirmedUser>:", error);
			throw error;
		}
	}

	formatInForLogin(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForLogout(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForRefresh(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForRegisterCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForRegisterPrivilege(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForResetSchema(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForRevokePrivilegeFromCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForRevokePrivilegeFromUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForRevokeUserFromCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForUnregisterCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForUnregisterPrivilege(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForUnregisterUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForUpdateCommunity(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForUpdatePrivilege(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatInForUpdateUser(args, settings) {
		return this.createStandardTemplateParameters({
			args
		});
	}

	formatOutForAssignPrivilegeToCommunity(result, settings) {
		return result;
	}

	formatOutForAssignPrivilegeToUser(result, settings) {
		return result;
	}

	formatOutForAssignUserToCommunity(result, settings) {
		return result;
	}

	formatOutForAuthenticate(result, settings) {
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
		return {
			data: sessionData,
			originalData: result,
			fields: result.fields
		};
	}

	formatOutForCan(result, settings) {
		return result;
	}

	formatOutForCannot(result, settings) {
		return result;
	}

	formatOutForCanMultiple(result, settings) {
		return result;
	}

	formatOutForCannotMultiple(result, settings) {
		return result;
	}

	formatOutForChangePassword(result, settings) {
		return result;
	}

	formatOutForCheckUserUnicity(result, settings) {
		return result;
	}

	formatOutForConfirmUser(result, settings) {
		return result;
	}

	formatOutForCreateTables(result, settings) {
		return result;
	}

	formatOutForDeleteTables(result, settings) {
		return result;
	}

	formatOutForDeleteUser(result, settings) {
		return result;
	}

	formatOutForDeletePrivilege(result, settings) {
		return result;
	}

	formatOutForDeleteCommunity(result, settings) {
		return result;
	}

	formatOutForDeleteUnconfirmedUser(result, settings) {
		return result;
	}

	formatOutForFindUnconfirmedUser(result, settings) {
		if (result.length === 0) {
			throw new Error("No unconfirmed user found");
		} else {
			return result[0];
		}
	}

	formatOutForFindUser(result, settings) {
		return result;
	}

	formatOutForFindCommunity(result, settings) {
		return result;
	}

	formatOutForFindPrivilege(result, settings) {
		return result;
	}

	formatOutForRegisterUnconfirmedUser(result, settings) {
		return result;
	}

	formatOutForLogin(result, settings) {
		return result;
	}

	formatOutForLogout(result, settings) {
		return result;
	}

	formatOutForRefresh(result, settings) {
		return result;
	}

	formatOutForRegisterCommunity(result, settings) {
		return result;
	}

	formatOutForRegisterPrivilege(result, settings) {
		return result;
	}

	formatOutForResetSchema(result, settings) {
		return result;
	}

	formatOutForRevokePrivilegeFromCommunity(result, settings) {
		return result;
	}

	formatOutForRevokePrivilegeFromUser(result, settings) {
		return result;
	}

	formatOutForRevokeUserFromCommunity(result, settings) {
		return result;
	}

	formatOutForUnregisterCommunity(result, settings) {
		return result;
	}

	formatOutForUnregisterPrivilege(result, settings) {
		return result;
	}

	formatOutForUnregisterUser(result, settings) {
		return result;
	}

	formatOutForUpdateCommunity(result, settings) {
		return result;
	}

	formatOutForUpdatePrivilege(result, settings) {
		return result;
	}

	formatOutForUpdateUser(result, settings) {
		return result;
	}



}

module.exports = AuthSystem;