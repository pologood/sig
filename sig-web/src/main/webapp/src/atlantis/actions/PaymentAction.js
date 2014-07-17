if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (PaymentAction == null) var PaymentAction = {};
PaymentAction._path = '../../dwr';

PaymentAction.queryPayment = function(p0, callback) {
  dwr.engine._execute(PaymentAction._path, 'PaymentAction', 'queryPayment', p0, callback);
};
PaymentAction.addOrMotifyPayment = function(p0, callback) {
  dwr.engine._execute(PaymentAction._path, 'PaymentAction', 'addOrMotifyPayment', p0, callback);
};
