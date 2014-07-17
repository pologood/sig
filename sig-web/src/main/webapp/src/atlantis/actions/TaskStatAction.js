if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (TaskStatAction == null) var TaskStatAction = {};
TaskStatAction._path = '../../dwr';

//Task
TaskStatAction.getCostTaskStat = function(p0, callback) {
  dwr.engine._execute(TaskStatAction._path, 'TaskStatAction', 'getCostTaskStat', p0, callback);
};
TaskStatAction.getNewCustTaskStat = function(p0, callback) {
  dwr.engine._execute(TaskStatAction._path, 'TaskStatAction', 'getNewCustTaskStat', p0, callback);
};
