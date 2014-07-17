if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (AccountFullyMatchOptimizationAction == null) var AccountFullyMatchOptimizationAction = {};
AccountFullyMatchOptimizationAction._path = '../../dwr';

AccountFullyMatchOptimizationAction.getAccountFullyMatchOptimizeItem = function(p0, callback) {
  dwr.engine._execute(AccountFullyMatchOptimizationAction._path, 'AccountFullyMatchOptimizationAction', 'getAccountFullyMatchOptimizeItem', p0, callback);
};
AccountFullyMatchOptimizationAction.getPlanFullyMatchKeys = function(p0, callback) {
  dwr.engine._execute(AccountFullyMatchOptimizationAction._path, 'AccountFullyMatchOptimizationAction', 'getPlanFullyMatchKeys', p0, callback);
};
AccountFullyMatchOptimizationAction.updateAccountFullyMatchOptimizeItem = function(p0, callback) {
  dwr.engine._execute(AccountFullyMatchOptimizationAction._path, 'AccountFullyMatchOptimizationAction', 'updateAccountFullyMatchOptimizeItem', p0, callback);
};
