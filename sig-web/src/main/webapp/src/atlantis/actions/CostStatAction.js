if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (CostStatAction == null) var CostStatAction = {};
CostStatAction._path = '../../dwr';

//ConsumeOverview
CostStatAction.getAllCpcCost = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getAllCpcCost', p0, callback);
};
CostStatAction.getAllCpcCostCompare = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getAllCpcCostCompare', p0, callback);
};

//ConsumeClient
CostStatAction.getCustCpcCostByCs = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getCustCpcCostByCs', p0, callback);
};
CostStatAction.getCustCpcCostByCsCompare = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getCustCpcCostByCsCompare', p0, callback);
};
CostStatAction.getCustCpcCost = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getCustCpcCost', p0, callback);
};
CostStatAction.getCustCpcCostCompare = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getCustCpcCostCompare', p0, callback);
};
CostStatAction.getCustCpcCostByDay = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getCustCpcCostByDay', p0, callback);
};

//IncrementOverview
CostStatAction.getAddCpcCost = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getAddCpcCost', p0, callback);
};
CostStatAction.getAddCpcCostCompare = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getAddCpcCostCompare', p0, callback);
};

//IncrementService
CostStatAction.getAddCpcCostByCs = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getAddCpcCostByCs', p0, callback);
};
CostStatAction.getAddCpcCostByCsCompare = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getAddCpcCostByCsCompare', p0, callback);
};

//StockOverview
CostStatAction.getExistsCpcCost = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getExistsCpcCost', p0, callback);
};
CostStatAction.getExistsCpcCostCompare = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getExistsCpcCostCompare', p0, callback);
};

//StockService
CostStatAction.getExistsCpcCostByCs = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getExistsCpcCostByCs', p0, callback);
};
CostStatAction.getExistsCpcCostByCsCompare = function(p0, callback) {
  dwr.engine._execute(CostStatAction._path, 'CostStatAction', 'getExistsCpcCostByCsCompare', p0, callback);
};
