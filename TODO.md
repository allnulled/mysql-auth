# TODO

[x] Revoke privileges and communities methods
[x] Unregister methods
[x] Fix long names for typed methods
[x] Incorporate password encryptation in user creation (not in modification)
[x] Incorporate possible joins and formatters to authentication (to add other tables to the session data)
[x] Incorporate explicit user unicity in confirmation workflow
------------------------------------
[x] Incorporate can and cannot methods
  [x] get the authentication by cache + token (or call authenticate for the first time)
  [x] call to special filter method to check the ability for the task
[x] Incorporate multiple can and cannot methods
[x] Refresh all method
[x] Incorporate cache class:
  [x] getter: for authenticate method (invoked by can & cannot)
  [-] setter: for methods that alter user, privileges, communities or any relationship between (to call "refreshCache")
[ ] Add history to deletes
------------------------------------
[ ] Tests of every method
[ ] Coverage (?)
[ ] Documentation
[ ] Repository at github
[ ] Repository at npm