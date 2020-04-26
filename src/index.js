const Debug = require("debug");
const SQL = require("sqlstring");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const AuthClient = require(__dirname + "/auth-client.js");
const utils = require(__dirname + "/utils.js");

/*
global.dd = function(...args) {
	console.log(...args)
	console.log("----- PROGRAM DIED -----");
	process.exit(0);
}
//*/

/**
 * 
 * -----
 * 
 * ##### `const AuthSystem = require("mysql-auth")`
 * 
 */
class AuthSystem {

	/**
	 * 
	 * -----
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
			sessionCache: {},
			debug: false,
			trace: false,
			clients: [],
			sharedMethods: []
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

	static get DEFAULT_SESSION_CACHE() {
		return {};
	}

	static get DEFAULT_SHARED_METHODS() {
		return [];
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
			"findSession": __dirname + "/queries/find session.sql.ejs",
			"findSessionByUser": __dirname + "/queries/find session by user.sql.ejs",
			"findUser": __dirname + "/queries/find user.sql.ejs",
			"findUserAndCommunity": __dirname + "/queries/find user and community.sql.ejs",
			"findUserAndPrivilege": __dirname + "/queries/find user and privilege.sql.ejs",
			"findCommunityAndPrivilege": __dirname + "/queries/find community and privilege.sql.ejs",
			"findUnconfirmedUser": __dirname + "/queries/find unconfirmed user.sql.ejs",
			"login": __dirname + "/queries/login.sql.ejs",
			"logout": __dirname + "/queries/logout.sql.ejs",
			"logoutByUser": __dirname + "/queries/logout by user.sql.ejs",
			"refresh": __dirname + "/queries/refresh.sql.ejs",
			"refreshAll": __dirname + "/queries/refresh all.sql.ejs",
			"registerCommunity": __dirname + "/queries/register community.sql.ejs",
			"registerPrivilege": __dirname + "/queries/register privilege.sql.ejs",
			"registerUnconfirmedUser": __dirname + "/queries/register unconfirmed user.sql.ejs",
			"revokePrivilegeFromCommunity": __dirname + "/queries/revoke privilege from community.sql.ejs",
			"revokePrivilegeFromUser": __dirname + "/queries/revoke privilege from user.sql.ejs",
			"revokeUserFromCommunity": __dirname + "/queries/revoke user from community.sql.ejs",
			"saveInHistory": __dirname + "/queries/save in history.sql.ejs",
			"unregisterCommunity": __dirname + "/queries/unregister community.sql.ejs",
			"unregisterPrivilege": __dirname + "/queries/unregister privilege.sql.ejs",
			"unregisterUser": __dirname + "/queries/unregister user.sql.ejs",
			"updateCommunity": __dirname + "/queries/update community.sql.ejs",
			"updatePrivilege": __dirname + "/queries/update privilege.sql.ejs",
			"updateUser": __dirname + "/queries/update user.sql.ejs",
		};
	}

	static encryptPassword(password, salts, callback) {
		return new Promise((ok, fail) => {
			bcrypt.hash(password, salts, (error, hash) => {
				/* istanbul ignore if  */
				if (error) {
					return fail(error);
				}
				return ok(hash);
			});
		});
	}

	constructor(options = {}) {
		Object.assign(this, this.constructor.DEFAULT_OPTIONS, options);
		this.connectionSettings = Object.assign({}, this.constructor.DEFAULT_CONNECTION_SETTINGS, options.connectionSettings || {});
		this.queryTemplates = Object.assign({}, this.constructor.DEFAULT_QUERY_TEMPLATES, options.queryTemplates || {});
		this.sharedMethods = ["registerMethod"].concat(this.constructor.DEFAULT_SHARED_METHODS).concat(options.sharedMethods || []);
		this.sessionCache = Object.assign({}, this.constructor.DEFAULT_SESSION_CACHE, options.sessionCache || {});
		this.debugError = Debug("mysql-auth:error");
		this.debugTrace = Debug("mysql-auth:trace");
		this.debugSQL = Debug("mysql-auth:sql");
		Debug.enable((this.debug ? "mysql-auth:sql," : "") + (this.trace ? "mysql-auth:trace," : "") + "mysql-auth:error");
		this.debugTrace("Connection settings:", this.connectionSettings);
		this.initialize();
	}

	initialize() {
		this.debugTrace("<Initialize>");
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
		fs.readdirSync(__dirname + "/methods").forEach(file => {
			const filepath = path.resolve(__dirname + "/methods/" + file);
			const method = require(filepath);
			if(typeof method !== "function") {
				throw new Error("Required file <src/methods/" + file + "> to be a function module");
			} else {
				method.call(this);
			}
		}, {});
		return this;
	}

	createClient(options = {}) {
		const ClientClass = this.constructor.CLIENT_CLASS;
		return new ClientClass(Object.assign({
			system: this
		}, options));
	}

	formatTemplateInput(template, parameters, settings) {
		this.debugTrace("<Format Parameters By Template>", template);
		const methodName = "format" + template.substr(0, 1).toUpperCase() + template.substr(1) + "Input";
		if (!(methodName in this)) {
			throw new Error("Required method AuthSystem#<" + methodName + ">");
		}
		return this[methodName](parameters, settings);
	}

	formatTemplateOutput(template, result, parameters, settings) {
		this.debugTrace("<Format Result By Template>", template);
		const methodName = "format" + template.substr(0, 1).toUpperCase() + template.substr(1) + "Output";
		if (!(methodName in this)) {
			throw new Error("Required method AuthSystem#<" + methodName + ">");
		}
		return this[methodName](result, parameters, settings);
	}

	createStandardTemplateParameters(parameters) {
		this.debugTrace("<Create Standard Template Parameters>");
		return {
			authSystem: this,
			require: require,
			process: process,
			ejs: ejs,
			path: path,
			debug: this.debug,
			utils: utils,
			SQL: SQL,
			...parameters
		}
	}

	$query(query) {
		this.debugTrace("<Query>");
		this.debugSQL("[SQL] " + query);
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

	setSessionCacheToken(token, data) {
		this.sessionCache[token] = data;
	}

	getSessionCacheByToken(parameters) {
		const [{ token }, options = {}] = parameters;
		if(options.avoidCache) {
			return;
		}
		if(token in this.sessionCache) {
			return this.sessionCache[token];
		}
		return;
	}

	getFromCache(template, parameters, settings) {
		this.debugTrace("<Got From Cache>");
		if(template === "authenticate") {
			return this.getSessionCacheByToken(parameters);
		}
		return;
	}

	async onQuery(template, parameters, settings) {
		this.debugTrace("<Query By Template>", template);
		try {
			const queryTemplate = this.queries[template];
			if (typeof queryTemplate !== "string") {
				throw new Error("Query MySQLAuth#queries.<" + queryTemplate + "> is of type " + typeof(queryTemplate) + " instead of <string> for template <" + template + ">");
			}
			// get from cache, if any!
			const hasCached = await this.getFromCache(template, parameters, settings);
			if (typeof hasCached !== "undefined") {
				return hasCached;
			}
			const queryParameters = await this.formatTemplateInput(template, parameters, settings);
			//await nodelive.editor({ auth:this, template, queryTemplate, queryParameters });
			let querySource;
			try {
				querySource = ejs.render(queryTemplate, queryParameters, {});
			} catch (error) {
				this.debugError("Error rendering <" + template + ">:", error);
				throw error;
			}
			const result = await this.$query(querySource);
			const formattedResult = await this.formatTemplateOutput(template, result, parameters, settings);
			return formattedResult;
		} catch (error) {
			this.debugError("Error querying <" + template + ">:", error);
			throw error;
		}
	}

	registerMethod(name, method) {
		this[name] = method.bind(this);
		this.clients.forEach(client => client[name] = method.bind(this));
	}

}

module.exports = AuthSystem;