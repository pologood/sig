/*
 * Atlantis Model - AccountClient
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.AccountClient = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        dwr.request.run({
            method: "StandardAccountAction.getStandardAccountByCust",
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
            ifPaused: "--",
            pausedDay: Util.format.money(avg.pausedDay),
            pausedRate: Util.format.percent(avg.pausedRate)
        };
        
        var me = this;
        $.each(response.data, function(index, val) {
            result.data.push({
                custId: val.custId,
                custName: val.custName,
                custEmail: val.custEmail,
                csName: Util.format.string(val.csName),
                firstTrade: val.firstTrade,
                secondTrade: val.secondTrade,
                
                cpc_plan: me.args.time.type == 1 ? Util.format.number(val.cpc_plan) : Util.format.money(val.cpc_plan),
                cpc_group: me.args.time.type == 1 ? Util.format.number(val.cpc_group) : Util.format.money(val.cpc_group),
                cpc_idea: me.args.time.type == 1 ? Util.format.number(val.cpc_idea) : Util.format.money(val.cpc_idea),
                cpc_grpIdea: Util.format.money(val.cpc_grpIdea),
                cpc_key: me.args.time.type == 1 ? Util.format.number(val.cpc_key) : Util.format.money(val.cpc_key),
                matchKeyRate: Util.format.percent(val.matchKeyRate),
                ifPaused: val.ifPaused == 1 ? '是' : "否",
                pausedDay: Util.format.number(val.pausedDay),
                pausedRate: Util.format.percent(val.pausedRate)
            });
        });
        
        return result;
    }
});
