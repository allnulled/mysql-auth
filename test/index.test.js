const { expect } = require("chai");
const MySQLAuth = require(__dirname + "/../src/index.js");
const nodelive = require("nodelive");

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
		authSystem.connection.end();
		done();
	})

	it("creates tables", async function() {
		await authClient.deleteTables();
		await authClient.createTables();
	});

/*
// checkUserUnicity
insertUnconfirmedUser
confirmUser
// findUnconfirmedUser
// deleteUnconfirmedUser
login
refresh
logout
changePassword
assignPrivilegeToCommunity
assignPrivilegeToUser
assignUserToCommunity
registerCommunity
registerPrivilege
revokePrivilegeFromCommunity
revokePrivilegeFromUser
revokeUserFromCommunity
unregisterCommunity
unregisterPrivilege
unregisterUser
updateCommunity
updatePrivilege
updateUser
//*/

	it("can complete all auth common operations", async function() {
		this.timeout(100 * 1000);
		try {
			const userData = {
				name: "username1",
				password: "password1",
				email: "username1@email.com",
				description: "a person",
			};
			// 1. INSERT UNCONFIRMED USER
			const unconfirmedUserResponse = await authClient.insertUnconfirmedUser(userData);
			const { data: [unconfirmedUser] } = await authClient.system.$query("SELECT * FROM $auth$unconfirmed_user WHERE name = 'username1';");
			describe("can create unconfirmed user", function() {
				expect(unconfirmedUser.name).to.equal("username1");
				expect(unconfirmedUser.password).to.equal("password1");
				expect(unconfirmedUser.email).to.equal("username1@email.com");
				expect(unconfirmedUser.description).to.equal("a person");
			});
			// 2. CONFIRM USER
			const userConfirmationResponse = await authClient.confirmUser({ id: unconfirmedUser.id });
			const { data: [unconfirmedUser2 = null] } = await authClient.system.$query("SELECT * FROM $auth$unconfirmed_user WHERE name = 'username1';");
			expect(unconfirmedUser2).to.equal(null);
			const { data: [confirmedUser] } = await authClient.system.$query("SELECT * FROM $auth$user WHERE name = 'username1';");
			expect(confirmedUser.name).to.equal("username1");
			expect(confirmedUser.password).to.equal("password1");
			expect(confirmedUser.email).to.equal("username1@email.com");
			expect(confirmedUser.description).to.equal("a person");
			// 3. LOGIN
			const { data: sessionData } = await authClient.login({ name: userData.name, password: userData.password });
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
			await authClient.assignPrivilegeToCommunity({ "$auth$privilege.id": 1 }, { "$auth$community.id": 1 });
			// 13. ASSIGN PRIVILEGE TO USER
			await authClient.assignPrivilegeToUser({ "$auth$privilege.id": 2 }, { "$auth$user.id": 1 });
			// 14. ASSIGN USER TO COMMUNITY
			await authClient.assignUserToCommunity({ "$auth$user.id": 1 }, { "$auth$community.id": 1 });
			const { data: sessionData3 } = await authClient.login({ name: "username1", password: "password1" });
			expect(sessionData3.privilege.length).to.equal(2);
			expect(sessionData3.privilege[0].id).to.equal(1);
			expect(sessionData3.privilege[1].id).to.equal(2);
			// 12. REVOKE PRIVILEGE FROM COMMUNITY
			await authClient.revokePrivilegeFromCommunity({ "$auth$privilege.id": 1 }, { "$auth$community.id": 1 });
			const { data: sessionData4 } = await authClient.authenticate({ token: sessionData3.session.token });
			expect(sessionData4.privilege.length).to.equal(1);
			expect(sessionData4.privilege[0].id).to.equal(2);
			// 13. REVOKE PRIVILEGE FROM USER
			await authClient.revokePrivilegeFromUser({ "$auth$privilege.id": 2 }, { "$auth$user.id": 1 });
			const { data: sessionData5 } = await authClient.authenticate({ token: sessionData3.session.token });
			expect(sessionData5.privilege.length).to.equal(0);
			// 14. REVOKE USER FROM COMMUNITY
			await authClient.assignPrivilegeToCommunity({ "$auth$privilege.id": 1 }, { "$auth$community.id": 2 });
			await authClient.assignUserToCommunity({ "$auth$user.id": 1 }, { "$auth$community.id": 2 });
			const { data: sessionData6 } = await authClient.authenticate({ token: sessionData3.session.token });
			expect(sessionData6.privilege.length).to.equal(1);
			await authClient.revokeUserFromCommunity({ "$auth$user.id": 1 }, { "$auth$community.id": 2 });
			const { data: sessionData7 } = await authClient.authenticate({ token: sessionData3.session.token });
			expect(sessionData7.privilege.length).to.equal(0);
			// 15. UNREGISTER USER
			const { data: [{ total: totalOfUsers1 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$user WHERE $auth$user.id = 1;");
			expect(totalOfUsers1).to.equal(1);
			await authClient.unregisterUser({ "$auth$user.id": 1 });
			const { data: [{ total: totalOfUsers2 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$user WHERE $auth$user.id = 1;");
			expect(totalOfUsers2).to.equal(0);
			// 16. UNREGISTER COMMUNITY
			const { data: [{ total: totalOfCommunities1 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$community WHERE $auth$community.id = 1;");
			await authClient.unregisterCommunity({ "$auth$community.id": 1 });
			const { data: [{ total: totalOfCommunities2 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$community WHERE $auth$community.id = 1;");
			expect(totalOfCommunities1 - 1).to.equal(totalOfCommunities2);
			// 17. UNREGISTER PRIVILEGE
			const { data: [{ total: totalOfPrivileges1 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$privilege WHERE $auth$privilege.id = 1;");
			await authClient.unregisterPrivilege({ "$auth$privilege.id": 1 });
			const { data: [{ total: totalOfPrivileges2 }] } = await authClient.system.$query("SELECT COUNT(*) AS 'total' FROM $auth$privilege WHERE $auth$privilege.id = 1;");
			expect(totalOfPrivileges1 - 1).to.equal(totalOfPrivileges2);

			/*
			const refreshResponse = await authClient.refresh({ token: loginResponse.session.token });
			const logoutResponse = await authClient.logout({ token: refreshResponse.session.token });
			const changePasswordResponse = await authClient.changePassword({ id: loginResponse.user.id }, "second.password");
			const registerCommunityResponse = await authClient.registerCommunity();
			const registerPrivilegeResponse = await authClient.registerPrivilege();
			const updateUserResponse = await authClient.updateUser();
			const updateCommunityResponse = await authClient.updateCommunity();
			const updatePrivilegeResponse = await authClient.updatePrivilege();
			const assignPrivilegeToCommunityResponse = await authClient.assignPrivilegeToCommunity();
			const assignPrivilegeToUserResponse = await authClient.assignPrivilegeToUser();
			const assignUserToCommunityResponse = await authClient.assignUserToCommunity();
			const revokePrivilegeFromCommunityResponse = await authClient.revokePrivilegeFromCommunity();
			const revokePrivilegeFromUserResponse = await authClient.revokePrivilegeFromUser();
			const revokeUserFromCommunityResponse = await authClient.revokeUserFromCommunity();
			const unregisterCommunityResponse = await authClient.unregisterCommunity();
			const unregisterPrivilegeResponse = await authClient.unregisterPrivilege();
			const unregisterUserResponse = await authClient.unregisterUser();
			//*/
		} catch(error) {
			console.log(error);
			throw error;
		}
	});

	it("deletes tables", async function() {
		// await authClient.deleteTables();
	});

});

