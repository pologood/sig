/*
 * Agent Model - RemindCostCustDetail
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.RemindCostCustDetail = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        Util.ajax.run({
            url: "/s/negativeOperationCustDetail",
            data: args,
            success: function(response) {
                me.set({data: me.format(response, args)});
            }
        });
    },
    
    format: function(response,  args) {
        var baseUrl = "http://" + window.location.host
                    + "/s/negativeOperationCustDetail?download=true&custId=" + Agent.Page.cur.custId
                    + "&startDate=" + args.startDate + "&endDate=" + args.endDate;
        var me = this;
        $.each(response.data, function(index, val) {
            val.opTime = T.date.format(new Date(val.opTime), "yyyy-MM-dd HH:mm:ss");
            val.opCount = Util.format.number(val.opCount);
            
            var url = baseUrl + "&opType=" + encodeURIComponent(val.opType) + "&opContent=" + encodeURIComponent(val.opContent) + "&opTime=" + val.opTime;
            val.download1 = val.beforeHasMore ? '<div><a href="' + url + '">下载查看更多</a></div>' : "";
            val.download2 = val.afterHasMore ? '<div><a href="' + url + '">下载查看更多</a></div>' : "";
        });
        
        return response;
    }
});
