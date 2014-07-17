if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (AccountManageAction == null) var AccountManageAction = {};
AccountManageAction._path = '../../dwr';

AccountManageAction.getCompanyInfo = function(callback) {
  dwr.engine._execute(AccountManageAction._path, 'AccountManageAction', 'getCompanyInfo', callback);
};
AccountManageAction.getCusts = function(p0, callback) {
  dwr.engine._execute(AccountManageAction._path, 'AccountManageAction', 'getCusts', p0, callback);
};
AccountManageAction.getCSList = function(callback) {
  dwr.engine._execute(AccountManageAction._path, 'AccountManageAction', 'getCSList', callback);
};
AccountManageAction.getOPList = function(callback) {
  dwr.engine._execute(AccountManageAction._path, 'AccountManageAction', 'getOPList', callback);
};
AccountManageAction.modifyCsOp = function(p0, callback) {
  dwr.engine._execute(AccountManageAction._path, 'AccountManageAction', 'modifyCsOp', p0, callback);
};
