if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (NoticeAndSysMessageViewAction == null) var NoticeAndSysMessageViewAction = {};
NoticeAndSysMessageViewAction._path = '../../dwr';

NoticeAndSysMessageViewAction.getMessageTypes = function(callback) {
  dwr.engine._execute(NoticeAndSysMessageViewAction._path, 'NoticeAndSysMessageViewAction', 'getMessageTypes', callback);
};
NoticeAndSysMessageViewAction.querySystemMessageByContion = function(p0, callback) {
  dwr.engine._execute(NoticeAndSysMessageViewAction._path, 'NoticeAndSysMessageViewAction', 'querySystemMessageByContion', p0, callback);
};
NoticeAndSysMessageViewAction.queryNoticesByContion = function(p0, callback) {
  dwr.engine._execute(NoticeAndSysMessageViewAction._path, 'NoticeAndSysMessageViewAction', 'queryNoticesByContion', p0, callback);
};
NoticeAndSysMessageViewAction.displayNotice = function(p0, callback) {
  dwr.engine._execute(NoticeAndSysMessageViewAction._path, 'NoticeAndSysMessageViewAction', 'displayNotice', p0, callback);
};
