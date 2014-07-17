if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (CustCurrentCostAction == null) var CustCurrentCostAction = {};
CustCurrentCostAction._path = '../../dwr';

CustCurrentCostAction.getCurrentCosts = function(p0, callback) {
  dwr.engine._execute(CustCurrentCostAction._path, 'CustCurrentCostAction', 'getCurrentCosts', p0, callback);
};
CustCurrentCostAction.getCurrentCostPerHour = function(p0, callback) {
  dwr.engine._execute(CustCurrentCostAction._path, 'CustCurrentCostAction', 'getCurrentCostPerHour', p0, callback);
};
