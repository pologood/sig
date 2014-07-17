/*
 * Atlantis Model - ConsumeOverview 
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.ConsumeOverview = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    initialize: function() {},
    
    lastAction: null,
    
    getData: function(method, args) {
        var me = this;
        me.set({data : null}, {silent : true});
        dwr.request.run({
            method: method,
            args: [args],
            success: function(data) {
                me.lastAction = {method: method, args: args};
                if (data.data == null || data.data.length == 0) {
                    data.data = [];
                    me.set({data: data});
                } else {
                    if (method == "CostStatAction.getAllCpcCost") {
                        me.set({data: me.format1(data)});
                    }
                    if (method == "CostStatAction.getAllCpcCostCompare") {
                        me.set({data: me.format2(data)});
                    }
                }
            }
        });
    },
    
    format1: function(data) {
        data.sum.cost = Util.format.money(data.sum.cost);
        data.sum.costPerCust = Util.format.money(data.sum.costPerCust);
        data.sum.custs = Util.format.number(data.sum.custs);
        data.sum.click = Util.format.number(data.sum.click);
        data.sum.cpc = Util.format.money(data.sum.cpc);
        data.sum.costAB = Util.format.money(data.sum.costAB);
        data.sum.costC = Util.format.money(data.sum.costC);
        
        $.each(data.data, function(index, val) {
            val.date = Util.date.toString(val.date);
            val.cost = Util.format.money(val.cost);
            val.costPerCust = Util.format.money(val.costPerCust);
            val.custs = Util.format.number(val.custs);
            val.click = Util.format.number(val.click);
            val.cpc = Util.format.money(val.cpc);
            val.costAB = Util.format.money(val.costAB);
            val.costC = Util.format.money(val.costC);
        });
        
        return data;
    },
    
    format2: function(data) {
        data.data.cost = Util.format.money(data.data.cost);
        data.data.lastCost = Util.format.money(data.data.lastCost);
        data.data.costSub = Util.format.money(data.data.costSub);
        data.data.costCompare = Util.format.percent(data.data.costCompare);
        
        data.data.costAB = Util.format.money(data.data.costAB);
        data.data.lastCostAB = Util.format.money(data.data.lastCostAB);
        data.data.costABSub = Util.format.money(data.data.costABSub);
        data.data.costABCompare = Util.format.percent(data.data.costABCompare);
        
        data.data.costC = Util.format.money(data.data.costC);
        data.data.lastCostC = Util.format.money(data.data.lastCostC);
        data.data.costCSub = Util.format.money(data.data.costCSub);
        data.data.costCCompare = Util.format.percent(data.data.costCCompare);
        
        data.data.costPerDay = Util.format.money(data.data.costPerDay);
        data.data.lastCostPerDay = Util.format.money(data.data.lastCostPerDay);
        data.data.costPerDaySub = Util.format.money(data.data.costPerDaySub);
        data.data.costPerDayCompare = Util.format.percent(data.data.costPerDayCompare);
        
        data.data.costPerCust = Util.format.money(data.data.costPerCust);
        data.data.lastCostPerCust = Util.format.money(data.data.lastCostPerCust);
        data.data.costPerCustSub = Util.format.money(data.data.costPerCustSub);
        data.data.costPerCustCompare = Util.format.percent(data.data.costPerCustCompare);
        
        data.data.costPerCustPerDay = Util.format.money(data.data.costPerCustPerDay);
        data.data.lastCostPerCustPerDay = Util.format.money(data.data.lastCostPerCustPerDay);
        data.data.costPerCustPerDaySub = Util.format.money(data.data.costPerCustPerDaySub);
        data.data.costPerCustPerDayCompare = Util.format.percent(data.data.costPerCustPerDayCompare);
        
        data.data.custs = Util.format.number(data.data.custs);
        data.data.lastCusts = Util.format.number(data.data.lastCusts);
        data.data.custsSub = Util.format.number(data.data.custsSub);
        data.data.custsCompare = Util.format.percent(data.data.custsCompare);
        
        data.data.click = Util.format.number(data.data.click);
        data.data.lastClick = Util.format.number(data.data.lastClick);
        data.data.clickSub = Util.format.number(data.data.clickSub);
        data.data.clickCompare = Util.format.percent(data.data.clickCompare);
        
        data.data.cpc = Util.format.money(data.data.cpc);
        data.data.lastCpc = Util.format.money(data.data.lastCpc);
        data.data.cpcSub = Util.format.money(data.data.cpcSub);
        data.data.cpcCompare = Util.format.percent(data.data.cpcCompare);
        
        return data;
    }
});