const Debug = require("debug");
const debug = Debug("mysql-auth");
const SQL = require("sqlstring");
const mysql = require("mysql");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const AuthClient = require(__dirname + "/auth-client.js");
const utils = require(__dirname + "/utils.js");
const debugError = Debug("mysql-auth:error");

global.dd = function(...args) {
	console.log(...args)
	console.log("----- PROGRAM DIED -----");
	process.exit(0);
}

class AuthSystem {

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
			multipleStatements: true
		}
	}

	static get NOT_CACHED() {
		return {};
	}

	/**
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 */
	static get DEFAULT_QUERY_TEMPLATES() {
		return {
			/*
			"createTables": __dirname + "/queries/create tables.sql.ejs",
			"insertUnconfirmedUser": __dirname + "/queries/insert unconfirmed user.sql.ejs",
			"confirmUser": __dirname + "/queries/confirm user.sql.ejs",
			"deleteUnconfirmedUser": __dirname + "/queries/delete unconfirmed user.sql.ejs",
			"login": __dirname + "/queries/login.sql.ejs",
			"logout": __dirname + "/queries/logout.sql.ejs",
			"refresh": __dirname + "/queries/refresh.sql.ejs",
			"authenticate": __dirname + "/queries/authenticate.sql.ejs",
			"deleteTables": __dirname + "/queries/delete tables.sql.ejs",
			//*/
			"assignPrivilegeToCommunity": __dirname + "/queries/assign privilege to community.sql.ejs",
			"assignPrivilegeToUser": __dirname + "/queries/assign privilege to user.sql.ejs",
			"assignUserToCommunity": __dirname + "/queries/assign user to community.sql.ejs",
			"authenticate": __dirname + "/queries/authenticate.sql.ejs",
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
			"insertUnconfirmedUser": __dirname + "/queries/insert unconfirmed user.sql.ejs",
			"login": __dirname + "/queries/login.sql.ejs",
			"logout": __dirname + "/queries/logout.sql.ejs",
			"refresh": __dirname + "/queries/refresh.sql.ejs",
			"registerCommunity": __dirname + "/queries/register community.sql.ejs",
			"registerPrivilege": __dirname + "/queries/register privilege.sql.ejs",
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

	constructor(options = {}) {
		Object.assign(this, this.constructor.DEFAULT_OPTIONS, options);
		if(this.debug) {
			Debug.enable("mysql-auth,mysql-auth:error");
		} else if(this.silence === false) {
			Debug.enable("mysql-auth:error");
		}
		this.connectionSettings = Object.assign({}, this.constructor.DEFAULT_CONNECTION_SETTINGS, options.connectionSettings || {});
		this.queryTemplates = Object.assign({}, this.constructor.DEFAULT_QUERY_TEMPLATES, options.queryTemplates || {});
		debug("connection settings:", this.connectionSettings);
	}

	createClient(options = {}) {
		const ClientClass = this.constructor.CLIENT_CLASS;
		return new ClientClass(Object.assign({
			system: this
		}, options));
	}

	initialize() {
		this.connection = mysql.createPool(this.connectionSettings);
		this.queries = Object.keys(this.queryTemplates).reduce((output, method) => {
			const filename = this.queryTemplates[method];
			if(typeof filename !== "string") {
				throw new Error("")
				throw new Error("Property AuthSystem#queryTemplates.<" + method + "> should exist");
			}
			const filepath = path.resolve(filename);
			if(!fs.existsSync(filepath)) {
				throw new Error("Property AuthSystem#queryTemplates.<" + method + "> should be an existing file");
			}
			const contents = fs.readFileSync(filepath).toString();
			output[method] = contents;
			return output;
		}, {});
		return this;
	}

	formatParametersByTemplate(template, parameters, settingsargs, settings) {
		const methodName = "formatParametersFor" + template.substr(0,1).toUpperCase() + template.substr(1);
		if(!(methodName in this)) {
			throw new Error("Required method AuthSystem#<" + methodName + ">");
		}
		return this[methodName](parameters, settings);
	}

	formatResultByTemplate(template, result, parameters, settings) {
		const methodName = "formatResultFor" + template.substr(0,1).toUpperCase() + template.substr(1);
		if(!(methodName in this)) {
			throw new Error("Required method AuthSystem#<" + methodName + ">");
		}
		return this[methodName](result, parameters, settings);
	}

	createStandardTemplateParameters(parameters) {
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
		debug("[SQL] " + query);
		return new Promise((ok, fail) => {
			this.connection.query(query, (error, data, fields) => {
				if(error) {
					return fail(error);
				}
				return ok({ data, fields });
			});
		});
	}

	gotFromCache(template, parameters, settings) {
		// @TODO: make cache system work
		return;
	}

	async queryByTemplate(template, parameters, settings) {
		try {
			// get from cache, if any!
			const hasCached = await this.gotFromCache(template, parameters, settings);
			if(typeof hasCached !== "undefined") {
				return hasCached;
			}
			const queryTemplate = this.queries[template];
			if(typeof queryTemplate !== "string") {
				throw new Error("Query MySQLAuth#queries.<" + queryTemplate + "> is of type " + typeof(queryTemplate) + " instead of <string>");
			}
			const queryParameters = await this.formatParametersByTemplate(template, parameters, settings);
			//await nodelive.editor({ auth:this, template, queryTemplate, queryParameters });
			let querySource;
			try {
				querySource = ejs.render(queryTemplate, queryParameters, {});
			} catch(error) {
				debugError("Error rendering <" + template + ">:", error);
				throw error;
			}
			const result = await this.$query(querySource);
			const formattedResult = await this.formatResultByTemplate(template, result, parameters, settings);
			return formattedResult;
		} catch(error) {
			debugError("Error querying <" + template + ">:", error);
			throw error;
		}
	}

	assignPrivilegeToCommunity(...args) {
		return this.queryByTemplate("assignPrivilegeToCommunity", args);
	}

	assignPrivilegeToUser(...args) {
		return this.queryByTemplate("assignPrivilegeToUser", args);
	}

	assignUserToCommunity(...args) {
		return this.queryByTemplate("assignUserToCommunity", args);
	}

	authenticate(...args) {
		return this.queryByTemplate("authenticate", args);
	}

	can(...args) {
		return this.queryByTemplate("can", args);
	}

	cannot(...args) {
		return this.queryByTemplate("cannot", args);
	}

	canMultiple(...args) {
		return this.queryByTemplate("canMultiple", args);
	}

	cannotMultiple(...args) {
		return this.queryByTemplate("cannotMultiple", args);
	}

	changePassword(...args) {
		return this.queryByTemplate("changePassword", args);
	}

	checkUserUnicity(...args) {
		return this.queryByTemplate("checkUserUnicity", args);
	}

	confirmUser(...args) {
		return this.queryByTemplate("confirmUser", args);
	}

	createTables(...args) {
		return this.queryByTemplate("createTables", args);
	}

	deleteCommunity(...args) {
		return this.queryByTemplate("deleteCommunity", args);
	}

	deleteUser(...args) {
		return this.queryByTemplate("deleteUser", args);
	}

	deletePrivilege(...args) {
		return this.queryByTemplate("deletePrivilege", args);
	}

	deleteTables(...args) {
		return this.queryByTemplate("deleteTables", args);
	}

	deleteUnconfirmedUser(...args) {
		return this.queryByTemplate("deleteUnconfirmedUser", args);
	}

	findUnconfirmedUser(...args) {
		return this.queryByTemplate("findUnconfirmedUser", args);
	}

	findCommunity(...args) {
		return this.queryByTemplate("findCommunity", args);
	}

	findPrivilege(...args) {
		return this.queryByTemplate("findPrivilege", args);
	}

	findUser(...args) {
		return this.queryByTemplate("findUser", args);
	}

	insertUnconfirmedUser(...args) {
		return this.queryByTemplate("insertUnconfirmedUser", args);
	}

	async login(userData) {
		try {
			const sessionData = {
				token: utils.generateToken(),
				secret_token: utils.generateToken()
			};
			await this.queryByTemplate("login", [userData, sessionData]);
			return await this.authenticate(sessionData);
		} catch(error) {
			debugError("Error on login", error);
		}
	}

	logout(...args) {
		return this.queryByTemplate("logout", args);
	}

	async refresh(userData) {
		try {
			const sessionData = {
				token: utils.generateToken(),
				secret_token: utils.generateToken()
			};
			await this.queryByTemplate("refresh", [userData, sessionData]);
			return await this.authenticate(sessionData);
		} catch(error) {
			debugError("Error on login", error);
		}
	}

	registerCommunity(...args) {
		return this.queryByTemplate("registerCommunity", args);
	}

	registerPrivilege(...args) {
		return this.queryByTemplate("registerPrivilege", args);
	}

	resetSchema(...args) {
		return this.queryByTemplate("resetSchema", args);
	}

	revokePrivilegeFromCommunity(...args) {
		return this.queryByTemplate("revokePrivilegeFromCommunity", args);
	}

	revokePrivilegeFromUser(...args) {
		return this.queryByTemplate("revokePrivilegeFromUser", args);
	}

	revokeUserFromCommunity(...args) {
		return this.queryByTemplate("revokeUserFromCommunity", args);
	}

	async unregisterCommunity(communityDetails) {
		try {
			let id = undefined;
			if(!("id" in communityDetails)) {
				const { data: matched } = await this.findCommunity(communityDetails);
				if(matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterCommunity>");
				}
				id = matched[0].id;
			} else {
				id = communityDetails.id;
			}
			if(typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			output.push(await this.queryByTemplate("unregisterCommunity", [{ "$auth$community.id": id }]));
			output.push(await this.queryByTemplate("deleteCommunity", [{ "$auth$community.id": id }]));
			return output;
		} catch(error) {
			debugError("Error on unregisterCommunity:", error);
		}
	}

	async unregisterPrivilege(privilegeDetails) {
		try {
			let id = undefined;
			if(!("id" in privilegeDetails)) {
				privilegesData = await this.findPrivilege(privilegeDetails);
				const { data: matched } = privilegesData;
				if(matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterPrivilege>");
				}
				id = matched[0].id;
			} else {
				id = privilegeDetails.id;
			}
			if(typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			output.push(await this.queryByTemplate("unregisterPrivilege", [{ "$auth$privilege.id": id }]));
			output.push(await this.queryByTemplate("deletePrivilege", [{ "$auth$privilege.id": id }]));
			return output;
		} catch(error) {
			debugError("Error on unregisterPrivilege:", error);
		}
	}

	async unregisterUser(userDetails) {
		try {
			let id = undefined;
			if(!("id" in userDetails)) {
				const { data: matched } = await this.findUser(userDetails);
				if(matched.length === 0) {
					throw new Error("Required 1 match minimum to <unregisterUser>");
				}
				id = matched[0].id;
			} else {
				id = userDetails.id;
			}
			if(typeof id === "undefined") {
				throw new Error("Property <id> of argument 1 must be a valid ID");
			}
			let output = [];
			output.push(await this.queryByTemplate("unregisterUser", [{ "$auth$user.id": id }]));
			output.push(await this.queryByTemplate("deleteUser", [{ "$auth$user.id": id }]));
			return output;
		} catch(error) {
			debugError("Error on unregisterUser:", error);
		}
	}

	updateCommunity(...args) {
		return this.queryByTemplate("updateCommunity", args);
	}

	updatePrivilege(...args) {
		return this.queryByTemplate("updatePrivilege", args);
	}

	updateUser(...args) {
		return this.queryByTemplate("updateUser", args);
	}

	formatParametersForAssignPrivilegeToCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForAssignPrivilegeToUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForAssignUserToCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForAuthenticate(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForCan(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForCannot(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForCanMultiple(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForCannotMultiple(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForChangePassword(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForCheckUserUnicity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForConfirmUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForCreateTables(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForDeleteTables(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForDeleteUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForDeleteCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForDeletePrivilege(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForDeleteUnconfirmedUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForFindUnconfirmedUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForFindUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForFindCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForFindPrivilege(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForInsertUnconfirmedUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForLogin(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForLogout(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForRefresh(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForRegisterCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForRegisterPrivilege(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForResetSchema(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForRevokePrivilegeFromCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForRevokePrivilegeFromUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForRevokeUserFromCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForUnregisterCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForUnregisterPrivilege(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForUnregisterUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForUpdateCommunity(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForUpdatePrivilege(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatParametersForUpdateUser(args, settings) {
		return this.createStandardTemplateParameters({ args });
	}

	formatResultForAssignPrivilegeToCommunity(result, settings) {
		return result;
	}

	formatResultForAssignPrivilegeToUser(result, settings) {
		return result;
	}

	formatResultForAssignUserToCommunity(result, settings) {
		return result;
	}

	formatResultForAuthenticate(result, settings) {
		if(Array.isArray(result)) {
			throw new Error("Parameters <result> must be an array to <authenticate>");
		}
		if(result.length === 0) {
			throw new Error("Parameters <result> must be have at leat 1 item to <authenticate>");
		}
		const queryData = result.data;
		if(queryData === null || queryData.length === 0) {
			throw new Error("Authentication error: provided credentials were not matched");
		}
		const sessionData = {
			user: utils.rowsToObject(queryData, "user", "id"),
			community: utils.rowsToObject(queryData, "community", "id"),
			privilege: utils.rowsToObject(queryData, "privilege", "id"),
			session: utils.rowsToObject(queryData, "session", "id"),
		};
		if(sessionData.user.length !== 1) {
			throw new Error("Authentication error: no <user> found for provided credentials");
		}
		if(sessionData.session.length !== 1) {
			throw new Error("Authentication error: no <session> found for provided credentials");
		}
		sessionData.user = sessionData.user[0];
		sessionData.session = sessionData.session[0];
		return { data: sessionData, originalData: result, fields: result.fields };
	}

	formatResultForCan(result, settings) {
		return result;
	}

	formatResultForCannot(result, settings) {
		return result;
	}

	formatResultForCanMultiple(result, settings) {
		return result;
	}

	formatResultForCannotMultiple(result, settings) {
		return result;
	}

	formatResultForChangePassword(result, settings) {
		return result;
	}

	formatResultForCheckUserUnicity(result, settings) {
		return result;
	}

	formatResultForConfirmUser(result, settings) {
		return result;
	}

	formatResultForCreateTables(result, settings) {
		return result;
	}

	formatResultForDeleteTables(result, settings) {
		return result;
	}

	formatResultForDeleteUser(result, settings) {
		return result;
	}

	formatResultForDeletePrivilege(result, settings) {
		return result;
	}

	formatResultForDeleteCommunity(result, settings) {
		return result;
	}

	formatResultForDeleteUnconfirmedUser(result, settings) {
		return result;
	}

	formatResultForFindUnconfirmedUser(result, settings) {
		if(result.length === 0) {
			throw new Error("No unconfirmed user found");
		} else {
			return result[0];
		}
	}

	formatResultForFindUser(result, settings) {
		return result;
	}

	formatResultForFindCommunity(result, settings) {
		return result;
	}

	formatResultForFindPrivilege(result, settings) {
		return result;
	}

	formatResultForInsertUnconfirmedUser(result, settings) {
		return result;
	}

	formatResultForLogin(result, settings) {
		return result;
	}

	formatResultForLogout(result, settings) {
		return result;
	}

	formatResultForRefresh(result, settings) {
		return result;
	}

	formatResultForRegisterCommunity(result, settings) {
		return result;
	}

	formatResultForRegisterPrivilege(result, settings) {
		return result;
	}

	formatResultForResetSchema(result, settings) {
		return result;
	}

	formatResultForRevokePrivilegeFromCommunity(result, settings) {
		return result;
	}

	formatResultForRevokePrivilegeFromUser(result, settings) {
		return result;
	}

	formatResultForRevokeUserFromCommunity(result, settings) {
		return result;
	}

	formatResultForUnregisterCommunity(result, settings) {
		return result;
	}

	formatResultForUnregisterPrivilege(result, settings) {
		return result;
	}

	formatResultForUnregisterUser(result, settings) {
		return result;
	}

	formatResultForUpdateCommunity(result, settings) {
		return result;
	}

	formatResultForUpdatePrivilege(result, settings) {
		return result;
	}

	formatResultForUpdateUser(result, settings) {
		return result;
	}



}

module.exports = AuthSystem;