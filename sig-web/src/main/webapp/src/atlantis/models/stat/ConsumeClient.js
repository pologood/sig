/*
 * Agent Model - ConsumeClient 
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.ConsumeClient = Backbone.Model.extend({
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
                    if (method == "CostStatAction.getCustCpcCostByCs") {
                        me.set({data: me.format1(data)});
                    }
                    if (method == "CostStatAction.getCustCpcCostByCsCompare") {
                        me.set({data: me.format2(data)});
                    }
                    if (method == "CostStatAction.getCustCpcCost") {
                        me.set({data: me.format3(data)});
                    }
                    if (method == "CostStatAction.getCustCpcCostCompare") {
                        me.set({data: me.format4(data)});
                    }
                }
            }
        });
    },
    
    format1: function(data) {
        data.sum.cost = Util.format.money(data.sum.cost);
        data.sum.custs = Util.format.number(data.sum.custs);
        data.sum.costPerCust = Util.format.money(data.sum.costPerCust);
        data.sum.costPerDay = Util.format.money(data.sum.costPerDay);
        data.sum.costPerCustPerDay = Util.format.money(data.sum.costPerCustPerDay);
        data.sum.click = Util.format.number(data.sum.click);
        data.sum.cpc = Util.format.money(data.sum.cpc);
        data.sum.costAB = Util.format.money(data.sum.costAB);
        data.sum.costC = Util.format.money(data.sum.costC);
        
        $.each(data.data, function(index, val) {
            val.cost = Util.format.money(val.cost);
            val.custs = Util.format.number(val.custs);
            val.costPerCust = Util.format.money(val.costPerCust);
            val.costPerDay = Util.format.money(val.costPerDay);
            val.costPerCustPerDay = Util.format.money(val.costPerCustPerDay);
            val.click = Util.format.number(val.click);
            val.cpc = Util.format.money(val.cpc);
            val.costAB = Util.format.money(val.costAB);
            val.costC = Util.format.money(val.costC);
        });
        
        return data;
    },
    
    format2: function(data) {
        data.sum.cost = Util.format.money(data.sum.cost);
        data.sum.lastCost = Util.format.money(data.sum.lastCost);
        data.sum.costSub = Util.format.money(data.sum.costSub);
        data.sum.costCompare = Util.format.percent(data.sum.costCompare);
        
        data.sum.costAB = Util.format.money(data.sum.costAB);
        data.sum.lastCostAB = Util.format.money(data.sum.lastCostAB);
        data.sum.costABSub = Util.format.money(data.sum.costABSub);
        data.sum.costABCompare = Util.format.percent(data.sum.costABCompare);
        
        data.sum.costC = Util.format.money(data.sum.costC);
        data.sum.lastCostC = Util.format.money(data.sum.lastCostC);
        data.sum.costCSub = Util.format.money(data.sum.costCSub);
        data.sum.costCCompare = Util.format.percent(data.sum.costCCompare);
        
        data.sum.custs = Util.format.number(data.sum.custs);
        data.sum.lastCusts = Util.format.number(data.sum.lastCusts);
        data.sum.custsSub = Util.format.number(data.sum.custsSub);
        data.sum.custsCompare = Util.format.percent(data.sum.custsCompare);
        
        data.sum.costPerCust = Util.format.money(data.sum.costPerCust);
        data.sum.lastCostPerCust = Util.format.money(data.sum.lastCostPerCust);
        data.sum.costPerCustSub = Util.format.money(data.sum.costPerCustSub);
        data.sum.costPerCustCompare = Util.format.percent(data.sum.costPerCustCompare);
        data.sum.costPerDay = Util.format.money(data.sum.costPerDay);
        data.sum.lastCostPerDay = Util.format.money(data.sum.lastCostPerDay);
        data.sum.costPerDaySub = Util.format.money(data.sum.costPerDaySub);
        data.sum.costPerDayCompare = Util.format.percent(data.sum.costPerDayCompare);
        data.sum.costPerCustPerDay = Util.format.money(data.sum.costPerCustPerDay);
        data.sum.lastCostPerCustPerDay = Util.format.money(data.sum.lastCostPerCustPerDay);
        data.sum.costPerCustPerDaySub = Util.format.money(data.sum.costPerCustPerDaySub);
        data.sum.costPerCustPerDayCompare = Util.format.percent(data.sum.costPerCustPerDayCompare);
        data.sum.click = Util.format.number(data.sum.click);
        data.sum.lastClick = Util.format.number(data.sum.lastClick);
        data.sum.clickSub = Util.format.number(data.sum.clickSub);
        data.sum.clickCompare = Util.format.percent(data.sum.clickCompare);
        data.sum.cpc = Util.format.money(data.sum.cpc);
        data.sum.lastCpc = Util.format.money(data.sum.lastCpc);
        data.sum.cpcSub = Util.format.money(data.sum.cpcSub);
        data.sum.cpcCompare = Util.format.percent(data.sum.cpcCompare);
        
        $.each(data.data, function(index, val) {
            val.cost = Util.format.money(val.cost);
            val.lastCost = Util.format.money(val.lastCost);
            val.costSub = Util.format.money(val.costSub);
            val.costCompare = Util.format.percent(val.costCompare);
            
            val.costAB = Util.format.money(val.costAB);
            val.lastCostAB = Util.format.money(val.lastCostAB);
            val.costABSub = Util.format.money(val.costABSub);
            val.costABCompare = Util.format.percent(val.costABCompare);
            val.costC = Util.format.money(val.costC);
            val.lastCostC = Util.format.money(val.lastCostC);
            val.costCSub = Util.format.money(val.costCSub);
            val.costCCompare = Util.format.percent(val.costCCompare);
            
            val.custs = Util.format.number(val.custs);
            val.lastCusts = Util.format.number(val.lastCusts);
            val.custsSub = Util.format.number(val.custsSub);
            val.custsCompare = Util.format.percent(val.custsCompare);
            val.costPerCust = Util.format.money(val.costPerCust);
            val.lastCostPerCust = Util.format.money(val.lastCostPerCust);
            val.costPerCustSub = Util.format.money(val.costPerCustSub);
            val.costPerCustCompare = Util.format.percent(val.costPerCustCompare);
            val.costPerDay = Util.format.money(val.costPerDay);
            val.lastCostPerDay = Util.format.money(val.lastCostPerDay);
            val.costPerDaySub = Util.format.money(val.costPerDaySub);
            val.costPerDayCompare = Util.format.percent(val.costPerDayCompare);
            val.costPerCustPerDay = Util.format.money(val.costPerCustPerDay);
            val.lastCostPerCustPerDay = Util.format.money(val.lastCostPerCustPerDay);
            val.costPerCustPerDaySub = Util.format.money(val.costPerCustPerDaySub);
            val.costPerCustPerDayCompare = Util.format.percent(val.costPerCustPerDayCompare);
            val.click = Util.format.number(val.click);
            val.lastClick = Util.format.number(val.lastClick);
            val.clickSub = Util.format.number(val.clickSub);
            val.clickCompare = Util.format.percent(val.clickCompare);
            val.cpc = Util.format.money(val.cpc);
            val.lastCpc = Util.format.money(val.lastCpc);
            val.cpcSub = Util.format.money(val.cpcSub);
            val.cpcCompare = Util.format.percent(val.cpcCompare);
        });    
    
        return data;
    },
    
    format3: function(data) {
        data.sum.cost = Util.format.money(data.sum.cost);
        data.sum.costPerDay = Util.format.money(data.sum.costPerDay);
        data.sum.click = Util.format.number(data.sum.click);
        data.sum.cpc = Util.format.money(data.sum.cpc);
        data.sum.costAB = Util.format.money(data.sum.costAB);
        data.sum.costC = Util.format.money(data.sum.costC);
        
        $.each(data.data, function(index, val) {
            val.cost = Util.format.money(val.cost);
            val.costPerDay = Util.format.money(val.costPerDay);
            val.click = Util.format.number(val.click);
            val.cpc = Util.format.money(val.cpc);
            val.costAB = Util.format.money(val.costAB);
            val.costC = Util.format.money(val.costC);
        });
        
        return data;
    },
    
    format4: function(data) {
        data.sum.cost = Util.format.money(data.sum.cost);
        data.sum.lastCost = Util.format.money(data.sum.lastCost);
        data.sum.costSub = Util.format.money(data.sum.costSub);
        data.sum.costCompare = Util.format.percent(data.sum.costCompare);
        
        data.sum.costAB = Util.format.money(data.sum.costAB);
        data.sum.lastCostAB = Util.format.money(data.sum.lastCostAB);
        data.sum.costABSub = Util.format.money(data.sum.costABSub);
        data.sum.costABCompare = Util.format.percent(data.sum.costABCompare);
        
        data.sum.costC = Util.format.money(data.sum.costC);
        data.sum.lastCostC = Util.format.money(data.sum.lastCostC);
        data.sum.costCSub = Util.format.money(data.sum.costCSub);
        data.sum.costCCompare = Util.format.percent(data.sum.costCCompare);
        
        data.sum.costPerDay = Util.format.money(data.sum.costPerDay);
        data.sum.lastCostPerDay = Util.format.money(data.sum.lastCostPerDay);
        data.sum.costPerDaySub = Util.format.money(data.sum.costPerDaySub);
        data.sum.costPerDayCompare = Util.format.percent(data.sum.costPerDayCompare);
        data.sum.click = Util.format.number(data.sum.click);
        data.sum.lastClick = Util.format.number(data.sum.lastClick);
        data.sum.clickSub = Util.format.number(data.sum.clickSub);
        data.sum.clickCompare = Util.format.percent(data.sum.clickCompare);
        data.sum.cpc = Util.format.money(data.sum.cpc);
        data.sum.lastCpc = Util.format.money(data.sum.lastCpc);
        data.sum.cpcSub = Util.format.money(data.sum.cpcSub);
        data.sum.cpcCompare = Util.format.percent(data.sum.cpcCompare);
        
        $.each(data.data, function(index, val) {
            val.cost = Util.format.money(val.cost);
            val.lastCost = Util.format.money(val.lastCost);
            val.costSub = Util.format.money(val.costSub);
            val.costCompare = Util.format.percent(val.costCompare);
            
            val.costAB = Util.format.money(val.costAB);
            val.lastCostAB = Util.format.money(val.lastCostAB);
            val.costABSub = Util.format.money(val.costABSub);
            val.costABCompare = Util.format.percent(val.costABCompare);
            val.costC = Util.format.money(val.costC);
            val.lastCostC = Util.format.money(val.lastCostC);
            val.costCSub = Util.format.money(val.costCSub);
            val.costCCompare = Util.format.percent(val.costCCompare);
            
            val.costPerDay = Util.format.money(val.costPerDay);
            val.lastCostPerDay = Util.format.money(val.lastCostPerDay);
            val.costPerDaySub = Util.format.money(val.costPerDaySub);
            val.costPerDayCompare = Util.format.percent(val.costPerDayCompare);
            val.click = Util.format.number(val.click);
            val.lastClick = Util.format.number(val.lastClick);
            val.clickSub = Util.format.number(val.clickSub);
            val.clickCompare = Util.format.percent(val.clickCompare);
            val.cpc = Util.format.money(val.cpc);
            val.lastCpc = Util.format.money(val.lastCpc);
            val.cpcSub = Util.format.money(val.cpcSub);
            val.cpcCompare = Util.format.percent(val.cpcCompare);
        });
        
        return data;
    }
});