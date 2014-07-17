/*
 * Agent Model - IncrementOverview 
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.IncrementOverview = Backbone.Model.extend({
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
                    if (method == "CostStatAction.getAddCpcCost") {
                        me.set({data: me.format1(data)});
                    }
                    if (method == "CostStatAction.getAddCpcCostCompare") {
                        me.set({data: me.format2(data)});
                    }
                    if (method == "NewCustomerStatAction.getNewCustomerStat") {
                        me.set({data: me.format3(data)});
                    }
                    if (method == "NewCustomerStatAction.getNewCustomerStatCompare") {
                        me.set({data: me.format4(data)});
                    }
                    if (method == "NewCustomerOnlineStatAction.getNewCustomerOnline") {
                        me.set({data: me.format5(data)});
                    }
                    if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineCompare") {
                        me.set({data: me.format6(data)});
                    }
                }
            }
        });
    },
    
    format1: function(data) {
        data.sum.cost = Util.format.money(data.sum.cost);
        data.sum.costCommon = Util.format.money(data.sum.costCommon);
        data.sum.costB = Util.format.money(data.sum.costB);
        
        data.sum.costPerCust = Util.format.money(data.sum.costPerCust);
        data.sum.costPerCustCommon = Util.format.money(data.sum.costPerCustCommon);
        data.sum.costPerCustB = Util.format.money(data.sum.costPerCustB);
        
        data.sum.custs = Util.format.number(data.sum.custs);
        data.sum.custsCommon = Util.format.number(data.sum.custsCommon);
        data.sum.custsCustB = Util.format.number(data.sum.custsCustB);
        
        data.sum.click = Util.format.number(data.sum.click);
        data.sum.clickCommon = Util.format.number(data.sum.clickCommon);
        data.sum.clickB = Util.format.number(data.sum.clickB);
        
        data.sum.cpc = Util.format.money(data.sum.cpc);
        data.sum.cpcCommon = Util.format.money(data.sum.cpcCommon);
        data.sum.cpcB = Util.format.money(data.sum.cpcB);
        
        $.each(data.data, function(index, val) {
            val.date = Util.date.toString(val.date);
            val.cost = Util.format.money(val.cost);
            val.costCommon = Util.format.money(val.costCommon);
            val.costB = Util.format.money(val.costB);
            
            val.costPerCust = Util.format.money(val.costPerCust);
            val.costPerCustCommon = Util.format.money(val.costPerCustCommon);
            val.costPerCustB = Util.format.money(val.costPerCustB);
            
            val.custs = Util.format.number(val.custs);
            val.custsCommon = Util.format.number(val.custsCommon);
            val.custsCustB = Util.format.number(val.custsCustB);
            
            val.click = Util.format.number(val.click);
            val.clickCommon = Util.format.number(val.clickCommon);
            val.clickB = Util.format.number(val.clickB);
            
            val.cpc = Util.format.money(val.cpc);
            val.cpcCommon = Util.format.money(val.cpcCommon);
            val.cpcB = Util.format.money(val.cpcB);
        });
        return data;
    },
    format2: function(data) {
        data.data.cost = Util.format.money(data.data.cost);
        data.data.lastCost = Util.format.money(data.data.lastCost);
        data.data.costSub = Util.format.money(data.data.costSub);
        data.data.costCompare = Util.format.percent(data.data.costCompare);
        
        data.data.costCommon = Util.format.money(data.data.costCommon);
        data.data.lastCostCommon = Util.format.money(data.data.lastCostCommon);
        data.data.costCommonSub = Util.format.money(data.data.costCommonSub);
        data.data.costCommonCompare = Util.format.percent(data.data.costCommonCompare);
        
        data.data.costB = Util.format.money(data.data.costB);
        data.data.lastCostB = Util.format.money(data.data.lastCostB);
        data.data.costBSub = Util.format.money(data.data.costBSub);
        data.data.costBCompare = Util.format.percent(data.data.costBCompare);  
              
        data.data.costPerCust = Util.format.money(data.data.costPerCust);
        data.data.lastCostPerCust = Util.format.money(data.data.lastCostPerCust);
        data.data.costPerCustSub = Util.format.money(data.data.costPerCustSub);
        data.data.costPerCustCompare = Util.format.percent(data.data.costPerCustCompare);
        
        data.data.costPerCustCommon = Util.format.money(data.data.costPerCustCommon);
        data.data.lastCostPerCustCommon = Util.format.money(data.data.lastCostPerCustCommon);
        data.data.costPerCustCommonSub = Util.format.money(data.data.costPerCustCommonSub);
        data.data.costPerCustCommonCompare = Util.format.percent(data.data.costPerCustCommonCompare);
        
        data.data.costPerCustB = Util.format.money(data.data.costPerCustB);
        data.data.lastCostPerCustB = Util.format.money(data.data.lastCostPerCustB);
        data.data.costPerCustBSub = Util.format.money(data.data.costPerCustBSub);
        data.data.costPerCustBCompare = Util.format.percent(data.data.costPerCustBCompare);
        
        data.data.costPerDay = Util.format.money(data.data.costPerDay);
        data.data.lastCostPerDay = Util.format.money(data.data.lastCostPerDay);
        data.data.costPerDaySub = Util.format.money(data.data.costPerDaySub);
        data.data.costPerDayCompare = Util.format.percent(data.data.costPerDayCompare);
        
        data.data.costPerDayCommon = Util.format.money(data.data.costPerDayCommon);
        data.data.lastCostPerDayCommon = Util.format.money(data.data.lastCostPerDayCommon);
        data.data.costPerDayCommonSub = Util.format.money(data.data.costPerDayCommonSub);
        data.data.costPerDayCommonCompare = Util.format.percent(data.data.costPerDayCommonCompare);
        
        data.data.costPerDayB = Util.format.money(data.data.costPerDayB);
        data.data.lastCostPerDayB = Util.format.money(data.data.lastCostPerDayB);
        data.data.costPerDayBSub = Util.format.money(data.data.costPerDayBSub);
        data.data.costPerDayBCompare = Util.format.percent(data.data.costPerDayBCompare);
        
        data.data.costPerCustPerDay = Util.format.money(data.data.costPerCustPerDay);
        data.data.lastCostPerCustPerDay = Util.format.money(data.data.lastCostPerCustPerDay);
        data.data.costPerCustPerDaySub = Util.format.money(data.data.costPerCustPerDaySub);
        data.data.costPerCustPerDayCompare = Util.format.percent(data.data.costPerCustPerDayCompare);
        
        data.data.costPerCustPerDayCommon = Util.format.money(data.data.costPerCustPerDayCommon);
        data.data.lastCostPerCustPerDayCommon = Util.format.money(data.data.lastCostPerCustPerDayCommon);
        data.data.costPerCustPerDayCommonSub = Util.format.money(data.data.costPerCustPerDayCommonSub);
        data.data.costPerCustPerDayCommonCompare = Util.format.percent(data.data.costPerCustPerDayCommonCompare);
        
        data.data.costPerCustPerDayB = Util.format.money(data.data.costPerCustPerDayB);
        data.data.lastCostPerCustPerDayB = Util.format.money(data.data.lastCostPerCustPerDayB);
        data.data.costPerCustPerDayBSub = Util.format.money(data.data.costPerCustPerDayBSub);
        data.data.costPerCustPerDayBCompare = Util.format.percent(data.data.costPerCustPerDayBCompare);        
        
        data.data.custs = Util.format.number(data.data.custs);
        data.data.lastCusts = Util.format.number(data.data.lastCusts);
        data.data.custsSub = Util.format.number(data.data.custsSub);
        data.data.custsCompare = Util.format.percent(data.data.custsCompare);
        
        data.data.custsCommon = Util.format.number(data.data.custsCommon);
        data.data.lastCustsCommon = Util.format.number(data.data.lastCustsCommon);
        data.data.custsCommonSub = Util.format.number(data.data.custsCommonSub);
        data.data.custsCommonCompare = Util.format.percent(data.data.custsCommonCompare);
        
        data.data.custsB = Util.format.number(data.data.custsB);
        data.data.lastCustsB = Util.format.number(data.data.lastCustsB);
        data.data.custsBSub = Util.format.number(data.data.custsBSub);
        data.data.custsBCompare = Util.format.percent(data.data.custsBCompare);
        
        data.data.click = Util.format.number(data.data.click);
        data.data.lastClick = Util.format.number(data.data.lastClick);
        data.data.clickSub = Util.format.number(data.data.clickSub);
        data.data.clickCompare = Util.format.percent(data.data.clickCompare);
        
        data.data.clickCommon = Util.format.number(data.data.clickCommon);
        data.data.lastClickCommon = Util.format.number(data.data.lastClickCommon);
        data.data.clickCommonSub = Util.format.number(data.data.clickCommonSub);
        data.data.clickCommonCompare = Util.format.percent(data.data.clickCommonCompare);
        
        data.data.clickB = Util.format.number(data.data.clickB);
        data.data.lastClickB = Util.format.number(data.data.lastClickB);
        data.data.clickBSub = Util.format.number(data.data.clickBSub);
        data.data.clickBCompare = Util.format.percent(data.data.clickBCompare);
        
        data.data.cpc = Util.format.money(data.data.cpc);
        data.data.lastCpc = Util.format.money(data.data.lastCpc);
        data.data.cpcSub = Util.format.money(data.data.cpcSub);
        data.data.cpcCompare = Util.format.percent(data.data.cpcCompare);
        
        data.data.cpcCommon = Util.format.money(data.data.cpcCommon);
        data.data.lastCpcCommon = Util.format.money(data.data.lastCpcCommon);
        data.data.cpcCommonSub = Util.format.money(data.data.cpcCommonSub);
        data.data.cpcCommonCompare = Util.format.percent(data.data.cpcCommonCompare);
        
        data.data.cpcB = Util.format.money(data.data.cpcB);
        data.data.lastCpcB = Util.format.money(data.data.lastCpcB);
        data.data.cpcBSub = Util.format.money(data.data.cpcBSub);
        data.data.cpcBCompare = Util.format.percent(data.data.cpcBCompare);
        return data;
    },
    format3: function(data) {
    
        data.sum.newCusts = Util.format.number(data.sum.newCusts);
        data.sum.newCustsEffect = Util.format.number(data.sum.newCustsEffect);
        data.sum.newCustsB = Util.format.number(data.sum.newCustsB);
        data.sum.newCustsCommon = Util.format.number(data.sum.newCustsCommon);
        
       // data.sum.custsChangeAgent = Util.format.number(data.sum.custsChangeAgent);
        
        data.sum.newInvest = Util.format.money(data.sum.newInvest);
        data.sum.newInvestCommon = Util.format.money(data.sum.newInvestCommon);
        data.sum.newInvestPerCust = Util.format.money(data.sum.newInvestPerCust);
        
        data.sum.newInvestB = Util.format.money(data.sum.newInvestB);
        data.sum.newInvestPerCustB = Util.format.money(data.sum.newInvestPerCustB);
        data.sum.newInvestPerCustCommon = Util.format.money(data.sum.newInvestPerCustCommon);
        
        
        $.each(data.data, function(index, val) {
            val.date = Util.date.toString(val.date);
            val.newCusts = Util.format.number(val.newCusts);
            val.newCustsEffect = Util.format.number(val.newCustsEffect);
            val.newCustsB = Util.format.number(val.newCustsB);
            val.newCustsCommon = Util.format.number(val.newCustsCommon);
            
            //val.custsChangeAgent = Util.format.number(val.custsChangeAgent);
            
            val.newInvest = Util.format.money(val.newInvest);
            val.newInvestCommon = Util.format.money(val.newInvestCommon);
            val.newInvestPerCust = Util.format.money(val.newInvestPerCust);
            val.newInvestB = Util.format.money(val.newInvestB);
            val.newInvestPerCustB = Util.format.money(val.newInvestPerCustB);
            val.newInvestPerCustCommon = Util.format.money(val.newInvestPerCustCommon);
        });
        return data;
    },
    format4: function(data) {
        data.data.newCusts = Util.format.number(data.data.newCusts);
        data.data.lastNewCusts = Util.format.number(data.data.lastNewCusts);
        data.data.newCustsSub = Util.format.number(data.data.newCustsSub);
        data.data.newCustsCompare = Util.format.percent(data.data.newCustsCompare);
        
        data.data.newCustsEffect = Util.format.number(data.data.newCustsEffect);
        data.data.lastNewCustsEffect = Util.format.number(data.data.lastNewCustsEffect);
        data.data.newCustsEffectSub = Util.format.number(data.data.newCustsEffectSub);
        data.data.newCustsEffectCompare = Util.format.percent(data.data.newCustsEffectCompare);
        
        data.data.newCustsB = Util.format.number(data.data.newCustsB);
        data.data.lastNewCustsB = Util.format.number(data.data.lastNewCustsB);
        data.data.newCustsBSub = Util.format.number(data.data.newCustsBSub);
        data.data.newCustsBCompare = Util.format.percent(data.data.newCustsBCompare);

        data.data.newCustsCommon = Util.format.number(data.data.newCustsCommon);
        data.data.lastNewCustsCommon = Util.format.number(data.data.lastNewCustsCommon);
        data.data.newCustsCommonSub = Util.format.number(data.data.newCustsCommonSub);
        data.data.newCustsCommonCompare = Util.format.percent(data.data.newCustsCommonCompare);
        
        
        //data.data.newCustsCommon = Util.format.number(data.data.newCustsCommon);
        //data.data.lastNewCustsCommon = Util.format.number(data.data.lastNewCustsCommon);
        //data.data.newCustsCommonSub = Util.format.number(data.data.newCustsCommonSub);
        //data.data.newCustsCommonCompare = Util.format.percent(data.data.newCustsCommonCompare);

        //data.data.custsChangeAgent = Util.format.number(data.data.custsChangeAgent);
        //data.data.lastCustsChangeAgent = Util.format.number(data.data.lastCustsChangeAgent);
        //data.data.custsChangeAgentSub = Util.format.number(data.data.custsChangeAgentSub);
        //data.data.custsChangeAgentCompare = Util.format.percent(data.data.custsChangeAgentCompare);
        
        data.data.newInvest = Util.format.money(data.data.newInvest);
        data.data.lastNewInvest = Util.format.money(data.data.lastNewInvest);
        data.data.newInvestSub = Util.format.money(data.data.newInvestSub);
        data.data.newInvestCompare = Util.format.percent(data.data.newInvestCompare);
        
        data.data.newInvestCommon = Util.format.money(data.data.newInvestCommon);
        data.data.lastNewInvestCommon = Util.format.money(data.data.lastNewInvestCommon);
        data.data.newInvestCommonSub = Util.format.money(data.data.newInvestCommonSub);
        data.data.newInvestCommonCompare = Util.format.percent(data.data.newInvestCommonCompare);

        data.data.newInvestB = Util.format.money(data.data.newInvestB);
        data.data.lastNewInvestB = Util.format.money(data.data.lastNewInvestB);
        data.data.newInvestBSub = Util.format.money(data.data.newInvestBSub);
        data.data.newInvestBCompare = Util.format.percent(data.data.newInvestBCompare);
        
        data.data.newInvestPerCustB = Util.format.money(data.data.newInvestPerCustB);
        data.data.lastNewInvestPerCustB = Util.format.money(data.data.lastNewInvestPerCustB);
        data.data.newInvestPerCustBSub = Util.format.money(data.data.newInvestPerCustBSub);
        data.data.newInvestPerCustBCompare = Util.format.percent(data.data.newInvestPerCustBCompare);


        data.data.newInvestPerCust = Util.format.money(data.data.newInvestPerCust);
        data.data.lastNewInvestPerCust = Util.format.money(data.data.lastNewInvestPerCust);
        data.data.newInvestPerCustSub = Util.format.money(data.data.newInvestPerCustSub);
        data.data.newInvestPerCustCompare = Util.format.percent(data.data.newInvestPerCustCompare);
        
        data.data.newInvestPerCustCommon = Util.format.money(data.data.newInvestPerCustCommon);
        data.data.lastNewInvestPerCustCommon = Util.format.money(data.data.lastNewInvestPerCustCommon);
        data.data.newInvestPerCustCommonSub = Util.format.money(data.data.newInvestPerCustCommonSub);
        data.data.newInvestPerCustCommonCompare = Util.format.percent(data.data.newInvestPerCustCommonCompare);
         return data;
    },
    format5: function(data) {
    
        data.sum.newCusts = Util.format.number(data.sum.newCusts);
        data.sum.newCustsCommon = Util.format.number(data.sum.newCustsCommon);
        data.sum.newCustsB = Util.format.number(data.sum.newCustsB);
        
        data.sum.newCostCusts = Util.format.number(data.sum.newCostCusts);
        data.sum.newCostCustsCommon = Util.format.number(data.sum.newCostCustsCommon);
        data.sum.newCostCustsB = Util.format.number(data.sum.newCostCustsB);
        
        data.sum.newNoCostCusts = Util.format.number(data.sum.newNoCostCusts);
        data.sum.newNoCostCustsCommon = Util.format.number(data.sum.newNoCostCustsCommon);
        data.sum.newNoCostCustsB = Util.format.number(data.sum.newNoCostCustsB);
        
        
        $.each(data.data, function(index, val) {
            val.date = Util.date.toString(val.date);
            val.newCusts = Util.format.number(val.newCusts);
            val.newCustsCommon = Util.format.number(val.newCustsCommon);
            val.newCustsB = Util.format.number(val.newCustsB);
        
            val.newCostCusts = Util.format.number(val.newCostCusts);
            val.newCostCustsCommon = Util.format.number(val.newCostCustsCommon);
            val.newCostCustsB = Util.format.number(val.newCostCustsB);
            
            val.newNoCostCusts = Util.format.number(val.newNoCostCusts);
            val.newNoCostCustsCommon = Util.format.number(val.newNoCostCustsCommon);
            val.newNoCostCustsB = Util.format.number(val.newNoCostCustsB);
        });
        return data;
    },
    format6: function(data) {
        data.data.newCusts = Util.format.number(data.data.newCusts);
        data.data.lastNewCusts = Util.format.number(data.data.lastNewCusts);
        data.data.newCustsSub = Util.format.number(data.data.newCustsSub);
        data.data.newCustsCompare = Util.format.percent(data.data.newCustsCompare);
        
        data.data.newCustsCommon = Util.format.number(data.data.newCustsCommon);
        data.data.lastNewCustsCommon = Util.format.number(data.data.lastNewCustsCommon);
        data.data.newCustsCommonSub = Util.format.number(data.data.newCustsCommonSub);
        data.data.newCustsCommonCompare = Util.format.percent(data.data.newCustsCommonCompare);
        
        data.data.newCustsB = Util.format.number(data.data.newCustsB);
        data.data.lastNewCustsB = Util.format.number(data.data.lastNewCustsB);
        data.data.newCustsBSub = Util.format.number(data.data.newCustsBSub);
        data.data.newCustsBCompare = Util.format.percent(data.data.newCustsBCompare);
        
        data.data.newCostCusts = Util.format.number(data.data.newCostCusts);
        data.data.lastNewCostCusts = Util.format.number(data.data.lastNewCostCusts);
        data.data.newCostCustsSub = Util.format.number(data.data.newCostCustsSub);
        data.data.newCostCustsCompare = Util.format.percent(data.data.newCostCustsCompare);
        
        data.data.newCostCustsCommon = Util.format.number(data.data.newCostCustsCommon);
        data.data.lastNewCostCustsCommon = Util.format.number(data.data.lastNewCostCustsCommon);
        data.data.newCostCustsCommonSub = Util.format.number(data.data.newCostCustsCommonSub);
        data.data.newCostCustsCommonCompare = Util.format.percent(data.data.newCostCustsCommonCompare);
        
        data.data.newCostCustsB = Util.format.number(data.data.newCostCustsB);
        data.data.lastNewCostCustsB = Util.format.number(data.data.lastNewCostCustsB);
        data.data.newCostCustsBSub = Util.format.number(data.data.newCostCustsBSub);
        data.data.newCostCustsBCompare = Util.format.percent(data.data.newCostCustsBCompare);
        
        data.data.newNoCostCusts = Util.format.number(data.data.newNoCostCusts);
        data.data.lastNewNoCostCusts = Util.format.number(data.data.lastNewNoCostCusts);
        data.data.newNoCostCustsSub = Util.format.number(data.data.newNoCostCustsSub);
        data.data.newNoCostCustsCompare = Util.format.percent(data.data.newNoCostCustsCompare);
        
        data.data.newNoCostCustsCommon = Util.format.number(data.data.newNoCostCustsCommon);
        data.data.lastNewNoCostCustsCommon = Util.format.number(data.data.lastNewNoCostCustsCommon);
        data.data.newNoCostCustsCommonSub = Util.format.number(data.data.newNoCostCustsCommonSub);
        data.data.newNoCostCustsCommonCompare = Util.format.percent(data.data.newNoCostCustsCommonCompare);
        
        data.data.newNoCostCustsB = Util.format.number(data.data.newNoCostCustsB);
        data.data.lastNewNoCostCustsB = Util.format.number(data.data.lastNewNoCostCustsB);
        data.data.newNoCostCustsBSub= Util.format.number(data.data.newNoCostCustsBSub);
        data.data.newNoCostCustsBCompare = Util.format.percent(data.data.newNoCostCustsBCompare);
        

        return data;
    }
});