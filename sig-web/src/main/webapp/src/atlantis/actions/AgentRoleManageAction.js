if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (AgentRoleManageAction == null) var AgentRoleManageAction = {};
AgentRoleManageAction._path = '../../dwr';

AgentRoleManageAction.getAgentFunctionAuthTree = function(p0, callback) {
  dwr.engine._execute(AgentRoleManageAction._path, 'AgentRoleManageAction', 'getAgentFunctionAuthTree', p0, callback);
};
AgentRoleManageAction.getSelectedAgentFunctionAuth = function(p0, callback) {
  dwr.engine._execute(AgentRoleManageAction._path, 'AgentRoleManageAction', 'getSelectedAgentFunctionAuth', p0, callback);
};
AgentRoleManageAction.updateAgentFunctionAuth = function(p0, callback) {
  dwr.engine._execute(AgentRoleManageAction._path, 'AgentRoleManageAction', 'updateAgentFunctionAuth', p0, callback);
};
