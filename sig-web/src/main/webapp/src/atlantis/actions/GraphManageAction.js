if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (GraphManageAction == null) var GraphManageAction = {};
GraphManageAction._path = '../../dwr';

GraphManageAction.getCompanyInfo = function(callback) {
  dwr.engine._execute(GraphManageAction._path, 'GraphManageAction', 'getCompanyInfo', callback);
};
GraphManageAction.getCusts = function(p0, callback) {
  dwr.engine._execute(GraphManageAction._path, 'GraphManageAction', 'getCusts', p0, callback);
};
GraphManageAction.getCSList = function(callback) {
  dwr.engine._execute(GraphManageAction._path, 'GraphManageAction', 'getCSList', callback);
};
GraphManageAction.getOPList = function(callback) {
  dwr.engine._execute(GraphManageAction._path, 'GraphManageAction', 'getOPList', callback);
};
GraphManageAction.modifyCsOp = function(p0, callback) {
  dwr.engine._execute(GraphManageAction._path, 'GraphManageAction', 'modifyCsOp', p0, callback);
};
