/*
 * Atlantis Model - TaskCost
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.TaskCost = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    lastAction: null,
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        dwr.request.run({
            method: "TaskStatAction.getCostTaskStat",
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
                    totalPayTask: Util.format.money(val.totalPayTask),
                    totalPay: Util.format.money(val.totalPay),
                    abPay: Util.format.money(val.abPay),
                    cpay: Util.format.money(val.cpay),
                    cpcPay: Util.format.money(val.cpcPay),
                    cxPay: Util.format.money(val.cxPay),
                    payTaskProgress: Util.format.percent(val.payTaskProgress),
                    monthTimeProgress: Util.format.percent(val.monthTimeProgress),
                    monthTimeProgressSub: Util.format.percent(val.monthTimeProgressSub),
                    monthTaskNeedDayPay: Util.format.money(val.monthTaskNeedDayPay)
                });
            });
        }
        
        if (response.data.quarterTask != null) {
            formatData.data.quarterTask = {
                totalPayTask: Util.format.money(response.data.quarterTask.totalPayTask),
                totalPay: Util.format.money(response.data.quarterTask.totalPay),
                abPay: Util.format.money(response.data.quarterTask.abPay),
                cpay: Util.format.money(response.data.quarterTask.cpay),
                cpcPay: Util.format.money(response.data.quarterTask.cpcPay),
                cxPay: Util.format.money(response.data.quarterTask.cxPay),
                payTaskProgress: Util.format.percent(response.data.quarterTask.payTaskProgress),
                quarterTimeProgress: Util.format.percent(response.data.quarterTask.quarterTimeProgress),
                quarterTimeProgressSub: Util.format.percent(response.data.quarterTask.quarterTimeProgressSub),
                quarterTaskNeedDayPay: Util.format.money(response.data.quarterTask.quarterTaskNeedDayPay)
            }
        }
        
        return formatData;
    }
});
