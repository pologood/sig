if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (CustomerInfoAction == null) var CustomerInfoAction = {};
CustomerInfoAction._path = '../../dwr';

//Cust
CustomerInfoAction.getCustomerInfo = function(p0, callback) {
  dwr.engine._execute(CustomerInfoAction._path, 'CustomerInfoAction', 'getCustomerInfo', p0, callback);
};
