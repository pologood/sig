/*
 * Atlantis Model - 账户优化
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.OptAccount = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        dwr.request.run({
            method: "AccountOptimizationAction.queryAccountList",
            args: [args],
            success: function(response) {
                me.set({
                    data: response.rowCount == 0 ? response : me.format(response)
                });
            }
        });
    },
    
    potential: ['非常低', '比较低','一般', '高', '非常高'],
    optType: ['关键词', '预算', '排名', '质量度', '推广时段', '匹配方式', '计划/创意数/物料状态', '余额不足'],
    
    format: function(response) {
        var me = this;
        $.each(response.data, function(index, val) {
            val.customerService = Util.format.string(val.customerService);
            val.yesterdayConsume = Util.format.money(val.yesterdayConsume);
            val.dayCompare = Util.format.percent(val.dayCompare);
            val.weekCompare = Util.format.percent(val.weekCompare);
            if (val.consumeBudgetRatio == -1) {
                val.consumeBudgetRatio = "未设置预算";
            } else {
                val.consumeBudgetRatio = Util.format.money(val.consumeBudgetRatio);
            }
            val.enhancePotential = me.potential[val.enhancePotential - 1];
            val.optText = [];
            $.each(val.optimizationType, function(index, type) {
                val.optText.push(me.optType[type - 1]);
            });
            val.optText = val.optText.join("、");
        });
        
        return response;
    }
});
