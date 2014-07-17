/*
 * Agent Model - RemindCostCust
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.RemindCostCust = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        Util.ajax.run({
            url: "/s/negativeOperationCustSummary",
            data: args,
            success: function(response) {
                me.set({data: me.format(response)});
            }
        });
    },
    
    format: function(response) {
        $.each(response.data, function(index, val) {
            val.avgCost = Util.format.money(val.avgCost);
            val.opCount = Util.format.number(val.opCount);
        });
        
        return response;
    }
});
