/*
 * Atlantis Model - 系统消息
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Models.Msg = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data: null}, {silent : true});
        
        dwr.request.run({
            method: "NoticeAndSysMessageViewAction.querySystemMessageByContion",
            args: [args],
            success: function(response) {
                me.set({data: response.rowCount == 0 ? response : me.format(response, args)});
            }
        });
    },
    
    format: function(response, args) {
        var base = args.pageSize * (args.pageNo - 1) + 1;
        $.each(response.data, function(index, val) {
            val.no = base + index;
            val.date = T.date.format(new Date(val.date), "yyyy-MM-dd HH:mm");
        });
        
        return response;
    }
});
