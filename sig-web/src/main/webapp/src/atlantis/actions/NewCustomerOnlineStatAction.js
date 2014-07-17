if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (NewCustomerOnlineStatAction == null) var NewCustomerOnlineStatAction = {};
NewCustomerOnlineStatAction._path = '../../dwr';

//IncrementOverview
NewCustomerOnlineStatAction.getNewCustomerOnline = function(p0, callback) {
  dwr.engine._execute(NewCustomerOnlineStatAction._path, 'NewCustomerOnlineStatAction', 'getNewCustomerOnline', p0, callback);
};
NewCustomerOnlineStatAction.getNewCustomerOnlineCompare = function(p0, callback) {
  dwr.engine._execute(NewCustomerOnlineStatAction._path, 'NewCustomerOnlineStatAction', 'getNewCustomerOnlineCompare', p0, callback);
};

//IncrementSales
NewCustomerOnlineStatAction.getNewCustomerOnlineByOp = function(p0, callback) {
  dwr.engine._execute(NewCustomerOnlineStatAction._path, 'NewCustomerOnlineStatAction', 'getNewCustomerOnlineByOp', p0, callback);
};
NewCustomerOnlineStatAction.getNewCustomerOnlineByOpCompare = function(p0, callback) {
  dwr.engine._execute(NewCustomerOnlineStatAction._path, 'NewCustomerOnlineStatAction', 'getNewCustomerOnlineByOpCompare', p0, callback);
};

//IncrementService
NewCustomerOnlineStatAction.getNewCustomerOnlineByCs = function(p0, callback) {
  dwr.engine._execute(NewCustomerOnlineStatAction._path, 'NewCustomerOnlineStatAction', 'getNewCustomerOnlineByCs', p0, callback);
};
NewCustomerOnlineStatAction.getNewCustomerOnlineByCsCompare = function(p0, callback) {
  dwr.engine._execute(NewCustomerOnlineStatAction._path, 'NewCustomerOnlineStatAction', 'getNewCustomerOnlineByCsCompare', p0, callback);
};
