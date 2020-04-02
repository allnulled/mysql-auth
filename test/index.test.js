const { expect } = require("chai");
const MySQLAuth = require(__dirname + "/../src/index.js");
const nodelive = require("nodelive");
const bcrypt = require("bcrypt");

describe("AuthClient class", function() {

	let authSystem;
	let authClient1, authClient2, authClient3;

	before(function(done) {
		authSystem = MySQLAuth.create({
			debug: true,
			connectionSettings: {
				user: "test",
				password: "test",
				database: "database3",
				host: "127.0.0.1",
				port: 3306,
			}
		}).initialize();
		authClient = authSystem.createClient();
		authClient2 = authSystem.createClient();
		authClient3 = authSystem.createClient();
		done();
	});

	after(function(done) {
		// authSystem.connection.end();
		done();
	})

	it("creates tables", async function() {
		await authClient.deleteTables();
		await authClient.createTables();
	});

	it("can complete all auth common operations", async function() {
		this.timeout(100 * 1000);
		try {
			const userDataOriginal = {
				name: "username1",
				password: "password1",
				email: "username1@email.com",
				description: "a person",
			};
			const userData = Object.assign({}, userDataOriginal);
			// 1. INSERT UNCONFIRMED USER
			const unconfirmedUserResponse = await authClient.registerUnconfirmedUser(userData);
			const { data: [unconfirmedUser] } = await authClient.system.$query("SELECT * FROM $auth$unconfirmed_user WHERE name = 'username1';");
			expect(unconfirmedUser.name).to.equal("username1");
			expect(unconfirmedUser.password).to.not.equal("password1");
			expect(unconfirmedUser.email).to.equal("username1@email.com");
			expect(unconfirmedUser.description).to.equal("a person");
			// 2. CONFIRM USER
			const userConfirmationResponse = await authClient.confirmUser({ id: unconfirmedUser.id });
			const { data: [unconfirmedUser2 = null] } = await authClient.system.$query("SELECT * FROM $auth$unconfirmed_user WHERE name = 'username1';");
			expect(unconfirmedUser2).to.equal(null);
			const { data: [confirmedUser] } = await authClient.system.$query("SELECT * FROM $auth$user WHERE name = 'username1';");
			expect(confirmedUser.name).to.equal("username1");
			expect(confirmedUser.password).to.not.equal("password1");
			expect(confirmedUser.email).to.equal("username1@email.com");
			expect(confirmedUser.description).to.equal("a person");
			// 3. LOGIN
			// @TOFIX:
			const { data: sessionData } = await authClient.login({ name: userData.name, password: userDataOriginal.password });
			expect(typeof sessionData.user).to.equal("object");
			expect(Object.keys(sessionData.user)).to.deep.equal(["id","name","password","email","description","created_at","updated_at"]);
			expect(typeof sessionData.community).to.equal("object");
			expect(typeof sessionData.privilege).to.equal("object");
			expect(typeof sessionData.session).to.equal("object");
			// 4. REFRESH
			const { data: refreshData } = await authClient.refresh({ token: sessionData.session.token });
			expect(typeof refreshData.user).to.equal("object");
			expect(Object.keys(refreshData.user)).to.deep.equal(["id","name","password","email","description","created_at","updated_at"]);
			expect(typeof refreshData.community).to.equal("object");
			expect(typeof refreshData.privilege).to.equal("object");
			expect(typeof refreshData.session).to.equal("object");
			const { data: [sessionData2] } = await authClient.system.$query("SELECT * FROM $auth$session WHERE token = '" + refreshData.session.token + "';");
			expect(typeof sessionData2).to.equal("object");
			expect(sessionData2.secret_token).to.equal(refreshData.session.secret_token);
			// 5. LOGOUT
			const { data: logoutData } = await authClient.logout({ token: refreshData.session.token });
			expect(typeof logoutData).to.equal("object");
			const { data: [sessionData21] } = await authClient.system.$query("SELECT * FROM $auth$session WHERE token = '" + refreshData.session.token + "';");
			expect(typeof sessionData21).to.equal("undefined");
			// 7. REGISTER COMMUNITY
			await authClient.registerCommunity({ name: "community1", description: "community 1"});
			await authClient.registerCommunity({ name: "community2", description: "community 2"});
			await authClient.registerCommunity({ name: "community3", description: "community 3"});
			await authClient.registerCommunity({ name: "community4", description: "community 4"});
			await authClient.registerCommunity({ name: "community5", description: "community 5"});
			await authClient.registerCommunity({ name: "community6", description: "community 6"});
			await authClient.registerCommunity({ name: "community7", description: "community 7"});
			await authClient.registerCommunity({ name: "community8", description: "community 8"});
			await authClient.registerCommunity({ name: "community9", description: "community 9"});
			await authClient.registerCommunity({ name: "community10", description: "community 10"});
			const { data: [communityCount] } = await authClient.system.$query("SELECT COUNT(*) as 'total' FROM $auth$community;");
			expect(communityCount.total).to.equal(10);
			// 8. REGISTER PRIVILEGE
			await authClient.registerPrivilege({ name: "privilege1", description: "privilege 1"});
			await authClient.registerPrivilege({ name: "privilege2", description: "privilege 2"});
			await authClient.registerPrivilege({ name: "privilege3", description: "privilege 3"});
			await authClient.registerPrivilege({ name: "privilege4", description: "privilege 4"});
			await authClient.registerPrivilege({ name: "privilege5", description: "privilege 5"});
			await authClient.registerPrivilege({ name: "privilege6", description: "privilege 6"});
			await authClient.registerPrivilege({ name: "privilege7", description: "privilege 7"});
			await authClient.registerPrivilege({ name: "privilege8", description: "privilege 8"});
			await authClient.registerPrivilege({ name: "privilege9", description: "privilege 9"});
			await authClient.registerPrivilege({ name: "privilege10", description: "privilege 10"});
			const { data: [privilegeCount] } = await authClient.system.$query("SELECT COUNT(*) as 'total' FROM $auth$privilege;");
			expect(privilegeCount.total).to.equal(10);
			// 9. UPDATE USER
			await authClient.updateUser({ name: "username1" }, { description: "this one is user1" });
			const { data: allUsers } = await authClient.system.$query("SELECT * FROM $auth$user;");
			expect(allUsers.length).to.equal(1);
			expect(allUsers[0].description).to.equal("this one is user1");
			// 10. UPDATE COMMUNITY
			await authClient.updateCommunity({ name: "community1" }, { description: "this one is community1" });
			await authClient.updateCommunity({ name: "community2" }, { description: "this one is community2" });
			await authClient.updateCommunity({ name: "community3" }, { description: "this one is community3" });
			await authClient.updateCommunity({ name: "community4" }, { description: "this one is community4" });
			await authClient.updateCommunity({ name: "community5" }, { description: "this one is community5" });
			await authClient.updateCommunity({ name: "community6" }, { description: "this one is community6" });
			await authClient.updateCommunity({ name: "community7" }, { description: "this one is community7" });
			await authClient.updateCommunity({ name: "community8" }, { description: "this one is community8" });
			await authClient.updateCommunity({ name: "community9" }, { description: "this one is community9" });
			await authClient.updateCommunity({ name: "community10" }, { description: "this one is community10" });
			const { data: allCommunities } = await authClient.system.$query("SELECT * FROM $auth$community;");
			expect(allCommunities.length).to.equal(10);
			expect(allCommunities[0].description).to.equal("this one is community1");
			expect(allCommunities[1].description).to.equal("this one is community2");
			expect(allCommunities[2].description).to.equal("this one is community3");
			expect(allCommunities[3].description).to.equal("this one is community4");
			expect(allCommunities[4].description).to.equal("this one is community5");
			expect(allCommunities[5].description).to.equal("this one is community6");
			expect(allCommunities[6].description).to.equal("this one is community7");
			expect(allCommunities[7].description).to.equal("this one is community8");
			expect(allCommunities[8].description).to.equal("this one is community9");
			expect(allCommunities[9].description).to.equal("this one is community10");
			// 11. UPDATE PRIVILEGE
			await authClient.updatePrivilege({ name: "privilege1" }, { description: "this one is privilege1" });
			await authClient.updatePrivilege({ name: "privilege2" }, { description: "this one is privilege2" });
			await authClient.updatePrivilege({ name: "privilege3" }, { description: "this one is privilege3" });
			await authClient.updatePrivilege({ name: "privilege4" }, { description: "this one is privilege4" });
			await authClient.updatePrivilege({ name: "privilege5" }, { description: "this one is privilege5" });
			await authClient.updatePrivilege({ name: "privilege6" }, { description: "this one is privilege6" });
			await authClient.updatePrivilege({ name: "privilege7" }, { description: "this one is privilege7" });
			await authClient.updatePrivilege({ name: "privilege8" }, { description: "this one is privilege8" });
			await authClient.updatePrivilege({ name: "privilege9" }, { description: "this one is privilege9" });
			await authClient.updatePrivilege({ name: "privilege10" }, { description: "this one is privilege10" });
			const { data: allPrivileges } = await authClient.system.$query("SELECT * FROM $auth$privilege;");
			expect(allPrivileges.length).to.equal(10);
			expect(allPrivileges[0].description).to.equal("this one is privilege1");
			expect(allPrivileges[1].description).to.equal("this one is privilege2");
			expect(allPrivileges[2].description).to.equal("this one is privilege3");
			expect(allPrivileges[3].description).to.equal("this one is privilege4");
			expect(allPrivileges[4].description).to.equal("this one is privilege5");
			expect(allPrivileges[5].description).to.equal("this one is privilege6");
			expect(allPrivileges[6].description).to.equal("this one is privilege7");
			expect(allPrivileges[7].description).to.equal("this one is privilege8");
			expect(allPrivileges[8].description).to.equal("this one is privilege9");
			expect(allPrivileges[9].description).to.equal("this one is privilege10");
			// 12. ASSIGN PRIVILEGE TO COMMUNITY
			await authClient.assignPrivilegeToCommunity({ "$auth$privilege.id": 1 }, { id: 1 });
			// 13. ASSIGN PRIVILEGE TO USER
			await authClient.assignPrivilegeToUser({ id: 2 }, { id: 1 });
			// 14. ASSIGN USER TO COMMUNITY
			await authClient.assignUserToCommunity({ id: 1 }, { id: 1 });
			const { data: sessionData3 } = await authClient.login({ name: "username1", password: "password1" });
			expect(sessionData3.privilege.length).to.equal(2);
			expect(sessionData3.privilege[0].id).to.equal(1);
			expect(sessionData3.privilege[1].id).to.equal(2);
			// 12. REVOKE PRIVILEGE FROM COMMUNITY
			await authClient.revokePrivilegeFromCommunity({ id: 1 }, { id: 1 });
			const { data: sessionData4 } = await authClient.authenticate({ token: sessionData3.session.token });
			expect(sessionData4.privilege.length).to.equal(1);
			expect(sessionData4.privilege[0].id).to.equal(2);
			// 13. REVOKE PRIVILEGE FROM USER
			await authClient.revokePrivilegeFromUser({ id: 2 }, { id: 1 });
			const { data: sessionData5 } = await authClient.authenticate({ token: sessionData3.session.token });
			expect(sessionData5.privilege.length).to.equal(0);
			// 14. REVOKE USER FROM COMMUNITY
			await authClient.assignPrivilegeToCommunity({ id: 1 }, { id: 2 });
			await authClient.assignUserToCommunity({ id: 1 }, { id: 2 });
			const { data: sessionData6 } = await authClient.authenticate({ token: sessionData3.session.token });
			expect(sessionData6.privilege.length).to.equal(1);
			await authClient.revokeUserFromCommunity({ id: 1 }, { id: 2 });
			const { data: sessionData7 } = await authClient.authenticate({ token: sessionData3.session.token });
			expect(sessionData7.privilege.length).to.equal(0);
			// 15. UNREGISTER USER
			const { data: [{ total: totalOfUsers1 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$user WHERE $auth$user.id = 1;");
			expect(totalOfUsers1).to.equal(1);
			await authClient.unregisterUser({ id: 1 });
			const { data: [{ total: totalOfUsers2 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$user WHERE $auth$user.id = 1;");
			expect(totalOfUsers2).to.equal(0);
			// 16. UNREGISTER COMMUNITY
			const { data: [{ total: totalOfCommunities1 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$community WHERE $auth$community.id = 1;");
			await authClient.unregisterCommunity({ id: 1 });
			const { data: [{ total: totalOfCommunities2 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$community WHERE $auth$community.id = 1;");
			expect(totalOfCommunities1 - 1).to.equal(totalOfCommunities2);
			// 17. UNREGISTER PRIVILEGE
			const { data: [{ total: totalOfPrivileges1 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$privilege WHERE $auth$privilege.id = 1;");
			await authClient.unregisterPrivilege({ id: 1 });
			const { data: [{ total: totalOfPrivileges2 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$privilege WHERE $auth$privilege.id = 1;");
			expect(totalOfPrivileges1 - 1).to.equal(totalOfPrivileges2);
		} catch(error) {
			console.log(error);
			throw error;
		}
	});

	it("creates new users", async () => {
		try {
			const { data: [numberOfUsers1] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$user WHERE name = 'user1';");
			expect(numberOfUsers1.total).to.equal(0);
			await authClient.registerUnconfirmedUser({ name: "user1", password: "password1", email: "email1@domain.com" });
			const { data: [numberOfUsers2] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$user WHERE name = 'user1';");
			expect(numberOfUsers2.total).to.equal(0);
			await authClient.confirmUser({ name: "user1" });
			const { data: [numberOfUsers3] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$user WHERE name = 'user1';");
			expect(numberOfUsers3.total).to.equal(1);
		} catch(error) {
			console.log(error);
		}
	});

	it("encrypts users passwords", async () => {
		try {
			const { data: [{ password }] } = await authClient.system.$query("SELECT password FROM $auth$user WHERE name = 'user1';");
			const isPassword = await new Promise((ok, fail) => {
				bcrypt.compare("password1", password, (error, isEqual) => {
					if(error) {
						return fail(error);
					}
					if(!isEqual) {
						return fail(isEqual);
					}
					return ok(isEqual);
				});
			});
			expect(isPassword).to.equal(true);
		} catch(error) {
			console.log(error);
		}
	});

	it("checks if a user has a privilege", async () => {
		try {
			const userData = { name: "user ten", password: "password10", email: "userten@domain.com" };
			await authClient.registerUnconfirmedUser(userData);
			await authClient.confirmUser({ name: userData.name });
			const { data: sessionData } = await authClient.login({ name: userData.name, password: userData.password });
			await authClient.registerPrivilege({ name: "run", description: "" });
			await authClient.registerPrivilege({ name: "jump", description: "" });
			await authClient.registerPrivilege({ name: "feel", description: "" });
			await authClient.registerPrivilege({ name: "see", description: "" });
			await authClient.registerPrivilege({ name: "hear", description: "" });
			await authClient.registerPrivilege({ name: "speak", description: "" });
			await authClient.assignPrivilegeToUser({name: "run"}, {id: sessionData.user.id});
			await authClient.assignPrivilegeToUser({name: "jump"}, {id: sessionData.user.id});
			await authClient.assignPrivilegeToUser({name: "feel"}, {id: sessionData.user.id});
			await authClient.assignPrivilegeToCommunity({name: "see"}, {id: 5});
			await authClient.assignPrivilegeToCommunity({name: "hear"}, {id: 6});
			await authClient.assignPrivilegeToCommunity({name: "speak"}, {id: 7});
			await authClient.assignUserToCommunity({ id: sessionData.user.id }, { id: 5 });
			await authClient.assignUserToCommunity({ id: sessionData.user.id }, { id: 6 });
			const canRun = await authClient.can(sessionData.session.token, "run");
			const canJump = await authClient.can(sessionData.session.token, "jump");
			const canFeel = await authClient.can(sessionData.session.token, "feel");
			const canSee = await authClient.can(sessionData.session.token, "see");
			const canHear = await authClient.can(sessionData.session.token, "hear");
			const canSpeak = await authClient.can(sessionData.session.token, "speak");
			// await nodelive.editor({ s: sessionData, a: authClient })
			expect(canRun).to.equal(true);
			expect(canJump).to.equal(true);
			expect(canFeel).to.equal(true);
			expect(canSee).to.equal(true);
			expect(canHear).to.equal(true);
			expect(canSpeak).to.equal(false);
		} catch(error) {
			throw error;
		}
	});

	it.skip("(throws errors) will not register an unconfirmed user if the name already exists", async () => {
		try {
			await authClient.registerUnconfirmedUser({ name: "user one", password: "xxxxxxxx", email: "user_one@domain.com" });
			await authClient.registerUnconfirmedUser({ name: "user two", password: "xxxxxxxx", email: "user_two@domain.com" });
			await authClient.registerUnconfirmedUser({ name: "user three", password: "xxxxxxxx", email: "user_three@domain.com" });
			try {
				await authClient.registerUnconfirmedUser({ name: "user one", password: "xxxxxxxx", email: "user_one@domain.com" });
			} catch(error) {
				expect(error.message).to.equal("Required property <name> to be unique to register a user");
			}
		} catch(error) {
			throw error;
		}
	});

	it("deletes tables", async function() {
		// await authClient.deleteTables();
	});

});

