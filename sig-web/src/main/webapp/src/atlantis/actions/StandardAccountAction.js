if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (StandardAccountAction == null) var StandardAccountAction = {};
StandardAccountAction._path = '../../dwr';

StandardAccountAction.getStandardAccountByCs = function(p0, callback) {
  dwr.engine._execute(StandardAccountAction._path, 'StandardAccountAction', 'getStandardAccountByCs', p0, callback);
};
StandardAccountAction.getStandardAccountByCust = function(p0, callback) {
  dwr.engine._execute(StandardAccountAction._path, 'StandardAccountAction', 'getStandardAccountByCust', p0, callback);
};
