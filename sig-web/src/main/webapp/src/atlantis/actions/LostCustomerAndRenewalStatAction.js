if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (LostCustomerAndRenewalStatAction == null) var LostCustomerAndRenewalStatAction = {};
LostCustomerAndRenewalStatAction._path = '../../dwr';

//StockOverview
LostCustomerAndRenewalStatAction.getLostCustomer = function(p0, callback) {
  dwr.engine._execute(LostCustomerAndRenewalStatAction._path, 'LostCustomerAndRenewalStatAction', 'getLostCustomer', p0, callback);
};
LostCustomerAndRenewalStatAction.getRenewal = function(p0, callback) {
  dwr.engine._execute(LostCustomerAndRenewalStatAction._path, 'LostCustomerAndRenewalStatAction', 'getRenewal', p0, callback);
};
LostCustomerAndRenewalStatAction.getRenewalCompare = function(p0, callback) {
  dwr.engine._execute(LostCustomerAndRenewalStatAction._path, 'LostCustomerAndRenewalStatAction', 'getRenewalCompare', p0, callback);
};

//StockService
LostCustomerAndRenewalStatAction.getLostCustomerByCs = function(p0, callback) {
  dwr.engine._execute(LostCustomerAndRenewalStatAction._path, 'LostCustomerAndRenewalStatAction', 'getLostCustomerByCs', p0, callback);
};
LostCustomerAndRenewalStatAction.getRenewalByCs = function(p0, callback) {
  dwr.engine._execute(LostCustomerAndRenewalStatAction._path, 'LostCustomerAndRenewalStatAction', 'getRenewalByCs', p0, callback);
};
LostCustomerAndRenewalStatAction.getRenewalByCsCompare = function(p0, callback) {
  dwr.engine._execute(LostCustomerAndRenewalStatAction._path, 'LostCustomerAndRenewalStatAction', 'getRenewalByCsCompare', p0, callback);
};
