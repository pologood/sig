/*
 * Atlantis Model - 通知内容
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Models.NotiDetail = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getContent: function(id) {
        var me = this;
        me.set({data: null}, {silent : true});
        
        dwr.request.run({
            method: "NoticeAndSysMessageViewAction.displayNotice",
            args: [{id: id}],
            success: function(response) {
                me.set({data: response.data});
            }
        });
    }
});
