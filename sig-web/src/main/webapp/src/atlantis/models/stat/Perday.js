/*
 * Agent Model - Perday
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.Perday = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        dwr.request.run({
            method: "CostStatAction.getCustCpcCostByDay",
            args: [args],
            success: function(response) {
                me.args = args;
                if (response.data == null || response.data.length == 0) {
                    response.data = [];
                    me.set({data: response});
                } else {
                    me.set({data: me.format(response)});
                }
            }
        });
    },
    
    format: function(response) {
        var result = {
            sum: {},
            data: [],
            rowCount: response.rowCount
        };
        
        var sum = response.sum;
        result.sum = {
            cost: Util.format.money(sum.cost),
            costAB: Util.format.money(sum.costAB),
            costC: Util.format.money(sum.costC),
            click: Util.format.number(sum.click),
            cpc: Util.format.money(sum.cpc)
        };
        
        var me = this;
        $.each(response.data, function(index, val) {
            result.data.push({
                time: val.time,
                cost: Util.format.money(val.cost),
                costAB: Util.format.money(val.costAB),
                costC: Util.format.money(val.costC),
                click: Util.format.number(val.click),
                cpc: Util.format.money(val.cpc)
            });
        });
        
        return result;
    }
});
