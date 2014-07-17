if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (AccountOptimizationAction == null) var AccountOptimizationAction = {};
AccountOptimizationAction._path = '../../dwr';

AccountOptimizationAction.queryAccountList = function(p0, callback) {
  dwr.engine._execute(AccountOptimizationAction._path, 'AccountOptimizationAction', 'queryAccountList', p0, callback);
};
AccountOptimizationAction.getAccountOptimizeDetail = function(p0, callback) {
  dwr.engine._execute(AccountOptimizationAction._path, 'AccountOptimizationAction', 'getAccountOptimizeDetail', p0, callback);
};
