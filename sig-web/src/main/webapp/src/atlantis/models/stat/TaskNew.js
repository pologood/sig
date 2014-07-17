/*
 * Agent Model - TaskNew
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.TaskNew = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    lastAction: null,
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        dwr.request.run({
            method: "TaskStatAction.getNewCustTaskStat",
            args: [args],
            success: function(response) {
                me.lastAction = {args: args};
                me.set({data: me.format(response)});
            }
        });
    },
    
    format: function(response) {
        var formatData = {
            data: {
                monthTasks: [],
                quarterTask: {}
            }
        };
        
        if (response.data.monthTasks.length != 0) {
            $.each(response.data.monthTasks, function(index, val) {
                formatData.data.monthTasks.push({
                    month: val.month,
                    newCustTask: Util.format.number(val.newCustTask),
                    newCustNum: Util.format.number(val.newCustNum),
                    effectNewCustNum: Util.format.number(val.effectNewCustNum),
                    invalidBNewCustNum: Util.format.number(val.invalidBNewCustNum),
                    invalidOtherNewCustNum: Util.format.number(val.invalidOtherNewCustNum),
                    newCustTaskProgress: Util.format.percent(val.newCustTaskProgress),
                    monthTimeProgress: Util.format.percent(val.monthTimeProgress)
                });
            });
        }
        
        if (response.data.quarterTask != null) {
            formatData.data.quarterTask = {
                newCustTask: Util.format.number(response.data.quarterTask.newCustTask),
                newCustNum: Util.format.number(response.data.quarterTask.newCustNum),
                effectNewCustNum: Util.format.number(response.data.quarterTask.effectNewCustNum),
                invalidBNewCustNum: Util.format.number(response.data.quarterTask.invalidBNewCustNum),
                invalidOtherNewCustNum: Util.format.number(response.data.quarterTask.invalidOtherNewCustNum),
                newCustTaskProgress: Util.format.percent(response.data.quarterTask.newCustTaskProgress),
                quarterTimeProgress: Util.format.percent(response.data.quarterTask.quarterTimeProgress)
            }
        }
        
        return formatData;
    }
});
