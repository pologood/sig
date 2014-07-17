if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (CustomerCenterAction == null) var CustomerCenterAction = {};
CustomerCenterAction._path = '../../dwr';

CustomerCenterAction.queryCustomerList = function(p0, callback) {
  dwr.engine._execute(CustomerCenterAction._path, 'CustomerCenterAction', 'queryCustomerList', p0, callback);
};
