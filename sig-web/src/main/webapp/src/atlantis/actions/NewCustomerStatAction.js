if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (NewCustomerStatAction == null) var NewCustomerStatAction = {};
NewCustomerStatAction._path = '../../dwr';

//IncrementOverview
NewCustomerStatAction.getNewCustomerStat = function(p0, callback) {
  dwr.engine._execute(NewCustomerStatAction._path, 'NewCustomerStatAction', 'getNewCustomerStat', p0, callback);
};
NewCustomerStatAction.getNewCustomerStatCompare = function(p0, callback) {
  dwr.engine._execute(NewCustomerStatAction._path, 'NewCustomerStatAction', 'getNewCustomerStatCompare', p0, callback);
};

//IncrementSales
NewCustomerStatAction.getNewCustomerStatByOp = function(p0, callback) {
  dwr.engine._execute(NewCustomerStatAction._path, 'NewCustomerStatAction', 'getNewCustomerStatByOp', p0, callback);
};
NewCustomerStatAction.getNewCustomerStatByOpCompare = function(p0, callback) {
  dwr.engine._execute(NewCustomerStatAction._path, 'NewCustomerStatAction', 'getNewCustomerStatByOpCompare', p0, callback);
};
