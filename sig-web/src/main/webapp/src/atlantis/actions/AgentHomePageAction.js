if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (AgentHomePageAction == null) var AgentHomePageAction = {};
AgentHomePageAction._path = '../../dwr';

AgentHomePageAction.latestSystemMessage = function(callback) {
  dwr.engine._execute(AgentHomePageAction._path, 'AgentHomePageAction', 'latestSystemMessage', callback);
};
AgentHomePageAction.listLatestNotices = function(callback) {
  dwr.engine._execute(AgentHomePageAction._path, 'AgentHomePageAction', 'listLatestNotices', callback);
};
AgentHomePageAction.displayAD = function(callback) {
  dwr.engine._execute(AgentHomePageAction._path, 'AgentHomePageAction', 'displayAD', callback);
};
AgentHomePageAction.agentBillInfo = function(callback) {
  dwr.engine._execute(AgentHomePageAction._path, 'AgentHomePageAction', 'agentBillInfo', callback);
};

AgentHomePageAction.accountMonthTaskAndCostStatInfo = function(callback) {
  dwr.engine._execute(AgentHomePageAction._path, 'AgentHomePageAction', 'accountMonthTaskAndCostStatInfo', callback);
};
AgentHomePageAction.latest7DayCostStat = function(callback) {
  dwr.engine._execute(AgentHomePageAction._path, 'AgentHomePageAction', 'latest7DayCostStat', callback);
};
AgentHomePageAction.myFocusCustomers = function(callback) {
  dwr.engine._execute(AgentHomePageAction._path, 'AgentHomePageAction', 'myFocusCustomers', callback);
};
