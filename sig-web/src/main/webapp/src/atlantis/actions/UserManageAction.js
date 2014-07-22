if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (UserManageAction == null) var UserManageAction = {};
UserManageAction._path = '../../dwr';

UserManageAction.addUser = function(p0, callback) {
  dwr.engine._execute(UserManageAction._path, 'UserManageAction', 'addUser', p0, callback);
};
UserManageAction.delUser = function(p0, callback) {
  dwr.engine._execute(UserManageAction._path, 'UserManageAction', 'delUser', p0, callback);
};
UserManageAction.modiUser = function(p0, callback) {
  dwr.engine._execute(UserManageAction._path, 'UserManageAction', 'modiUser', p0, callback);
};
