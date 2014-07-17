/*
 * Agent Model - AccountCs
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.AccountCs = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        dwr.request.run({
            method: "StandardAccountAction.getStandardAccountByCs",
            args: [args],
            success: function(response) {
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
            avg: {},
            data: [],
            rowCount: response.rowCount
        };
        
        var avg = response.avg;
        result.avg = {
            cpc_plan: Util.format.money(avg.cpc_plan),
            cpc_group: Util.format.money(avg.cpc_group),
            cpc_idea: Util.format.money(avg.cpc_idea),
            cpc_grpIdea: Util.format.money(avg.cpc_grpIdea),
            cpc_key: Util.format.money(avg.cpc_key),
            matchKeyRate: Util.format.percent(avg.matchKeyRate),
            pausedCusts: Util.format.money(avg.pausedCusts),
            stdCusts: Util.format.money(avg.stdCusts),
            stdRate: Util.format.percent(avg.stdRate)
        };
        
        $.each(response.data, function(index, val) {
            result.data.push({
                csName: val.csName,
                cpc_plan: Util.format.money(val.cpc_plan),
                cpc_group: Util.format.money(val.cpc_group),
                cpc_idea: Util.format.money(val.cpc_idea),
                cpc_grpIdea: Util.format.money(val.cpc_grpIdea),
                cpc_key: Util.format.money(val.cpc_key),
                matchKeyRate: Util.format.percent(val.matchKeyRate),
                pausedCusts: Util.format.number(val.pausedCusts),
                stdCusts: Util.format.number(val.stdCusts),
                stdRate: Util.format.percent(val.stdRate)
            });
        });
        
        return result;
    }
});
