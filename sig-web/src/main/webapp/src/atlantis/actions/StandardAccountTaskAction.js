if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (StandardAccountTaskAction == null) var StandardAccountTaskAction = {};
StandardAccountTaskAction._path = '../../dwr';

StandardAccountTaskAction.getStandardAccountTask = function(p0, callback) {
  dwr.engine._execute(StandardAccountTaskAction._path, 'StandardAccountTaskAction', 'getStandardAccountTask', p0, callback);
};
