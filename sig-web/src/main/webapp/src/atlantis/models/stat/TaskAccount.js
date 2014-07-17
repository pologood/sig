/*
 * Agent Model - TaskAccount
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.TaskAccount = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        dwr.request.run({
            method: "StandardAccountTaskAction.getStandardAccountTask",
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
            data: []
        };
        
        $.each(response.data, function(index, val) {
            result.data.push({
                time: val.time,
                
                stdTask: Util.format.percent(val.stdTask),
                costCusts: Util.format.number(val.costCusts),
                reachCusts: Util.format.number(val.reachCusts),
                reachPercent: Util.format.percent(val.reachPercent),
                taskSub: Util.format.percent(val.taskSub),
                
                planReach: Util.format.number(val.planReach),
                planReachPercent: Util.format.percent(val.planReachPercent),
                ideaReach: Util.format.number(val.ideaReach),
                ideaReachPercent: Util.format.percent(val.ideaReachPercent),
                keyReach: Util.format.number(val.keyReach),
                keyReachPercent: Util.format.percent(val.keyReachPercent),
                matchReach: Util.format.number(val.matchReach),
                matchReachPercent: Util.format.percent(val.matchReachPercent),
                pauseReach: Util.format.number(val.pauseReach),
                pauseReachPercent: Util.format.percent(val.pauseReachPercent)
            });
        });
        
        return result;
    }
});
