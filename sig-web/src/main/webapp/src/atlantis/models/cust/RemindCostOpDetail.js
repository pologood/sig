/*
 * Agent Model - RemindCostOpDetail
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.RemindCostOpDetail = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        Util.ajax.run({
            url: "/s/negativeOperationDetail",
            data: args,
            success: function(response) {
                me.set({data: me.format(response, args)});
            }
        });
    },
    
    format: function(response, args) {
        var baseUrl = "http://" + window.location.host
                    + "/s/negativeOperationDetail?download=true&opType=" + encodeURIComponent(Agent.Page.cur.opType)
                    + "&startDate=" + args.startDate + "&endDate=" + args.endDate;
        
        var me = this;
        $.each(response.data, function(index, val) {
            val.opCount = Util.format.number(val.opCount);
            val.avgCost = Util.format.money(val.avgCost);
            
            var url = baseUrl + "&custId=" + val.custId + "&opContent=" + encodeURIComponent(val.opContent) + "&opTime=" + val.opTime;
            val.download1 = val.beforeHasMore ? '<div><a href="' + url + '">下载查看更多</a></div>' : "";
            val.download2 = val.afterHasMore ? '<div><a href="' + url + '">下载查看更多</a></div>' : "";
        });
        
        return response;
    }
});
