if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (AgentUserManageAction == null) var AgentUserManageAction = {};
AgentUserManageAction._path = '../../dwr';

AgentUserManageAction.getOptRoles = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'getOptRoles', p0, callback);
};
AgentUserManageAction.queryUserById = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'queryUserById', p0, callback);
};
AgentUserManageAction.querySuperiorsByRoleId = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'querySuperiorsByRoleId', p0, callback);
};
AgentUserManageAction.queryUsersByRoleId = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'queryUsersByRoleId', p0, callback);
};
AgentUserManageAction.checkHasChildren = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'checkHasChildren', p0, callback);
};
AgentUserManageAction.addUser = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'addUser', p0, callback);
};
AgentUserManageAction.modifyUser = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'modifyUser', p0, callback);
};
AgentUserManageAction.modifyUserBaseInfo = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'modifyUserBaseInfo', p0, callback);
};
AgentUserManageAction.deleteUser = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'deleteUser', p0, callback);
};
AgentUserManageAction.motifyPassword = function(p0, callback) {
  dwr.engine._execute(AgentUserManageAction._path, 'AgentUserManageAction', 'motifyPassword', p0, callback);
};
