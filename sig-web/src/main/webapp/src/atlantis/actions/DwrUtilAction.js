if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (DwrUtilAction == null) var DwrUtilAction = {};
DwrUtilAction._path = '../../dwr';

DwrUtilAction.logCsHostedInfo = function(p0, callback) {
  dwr.engine._execute(DwrUtilAction._path, 'DwrUtilAction', 'logCsHostedInfo', p0, callback);
};
DwrUtilAction.logClickInfo = function(p0, callback) {
  dwr.engine._execute(DwrUtilAction._path, 'DwrUtilAction', 'logClickInfo', p0, callback);
};
