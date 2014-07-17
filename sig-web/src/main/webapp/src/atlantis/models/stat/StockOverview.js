/*
 * Atlantis Model - StockOverview 
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.StockOverview = Backbone.Model.extend({
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
                    if (method == "CostStatAction.getExistsCpcCost") {
                        me.set({data: me.format1(data)});
                    }
                    if (method == "CostStatAction.getExistsCpcCostCompare") {
                        me.set({data: me.format2(data)});
                    }
                    if (method == "LostCustomerAndRenewalStatAction.getLostCustomer") {
                        me.set({data: me.format3(data)});
                    }
                    if (method == "LostCustomerAndRenewalStatAction.getRenewal") {
                        me.set({data: me.format4(data)});
                    }
                    if (method == "LostCustomerAndRenewalStatAction.getRenewalCompare") {
                        me.set({data: me.format5(data)});
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
        
        data.data.costPerCust = Util.format.money(data.data.costPerCust);
        data.data.lastCostPerCust = Util.format.money(data.data.lastCostPerCust);
        data.data.costPerCustSub = Util.format.money(data.data.costPerCustSub);
        data.data.costPerCustCompare = Util.format.percent(data.data.costPerCustCompare);
        
        data.data.costB = Util.format.money(data.data.costB);
        data.data.lastCostB = Util.format.money(data.data.lastCostB);
        data.data.costBSub = Util.format.money(data.data.costBSub);
        data.data.costBCompare = Util.format.percent(data.data.costBCompare);
        
        data.data.costPerCustCommon = Util.format.money(data.data.costPerCustCommon);
        data.data.lastCostPerCustCommon = Util.format.money(data.data.lastCostPerCustCommon);
        data.data.costPerCustCommonSub = Util.format.money(data.data.costPerCustCommonSub);
        data.data.costPerCustCommonCompare = Util.format.percent(data.data.costPerCustCommonCompare);
        
        data.data.costPerCustB = Util.format.money(data.data.costPerCustB);
        data.data.lastCostPerCustB = Util.format.money(data.data.lastCostPerCustB);
        data.data.costPerCustBSub = Util.format.money(data.data.costPerCustBSub);
        data.data.costPerCustBCompare = Util.format.percent(data.data.costPerCustBCompare);
        
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
        $.each(data.data, function(index, val) {
            val.date = Util.date.toString(val.date);
            
        	val.lostCusts=Util.format.number(val.lostCusts);
        	val.lostCustsCommon=Util.format.number(val.lostCustsCommon);
        	val.lostCustsB=Util.format.number(val.lostCustsB);
        
        	val.lostCustsRate=Util.format.percent(val.lostCustsRate);
        	val.lostCustsRateCommon=Util.format.percent(val.lostCustsRateCommon);
        	val.lostCustsRateB=Util.format.percent(val.lostCustsRateB);
        });
        
        return data;
    },
    
    format4: function(data) {
    	data.sum.renewal=Util.format.money(data.sum.renewal);
    	data.sum.renewalCommon=Util.format.money(data.sum.renewalCommon);
    	data.sum.renewalB=Util.format.money(data.sum.renewalB);
    
        $.each(data.data, function(index, val) {
            val.date = Util.date.toString(val.date);
            
        	val.renewal=Util.format.money(val.renewal);
        	val.renewalCommon=Util.format.money(val.renewalCommon);
        	val.renewalB=Util.format.money(val.renewalB);
        });
        return data;
    },
    
    format5: function(data) {
        data.data.renewal = Util.format.money(data.data.renewal);
        data.data.lastRenewal = Util.format.money(data.data.lastRenewal);
        data.data.renewalSub = Util.format.money(data.data.renewalSub);
        data.data.renewalCompare = Util.format.percent(data.data.renewalCompare);
        
        data.data.renewalCommon = Util.format.money(data.data.renewalCommon);
        data.data.lastRenewalCommon = Util.format.money(data.data.lastRenewalCommon);
        data.data.renewalCommonSub = Util.format.money(data.data.renewalCommonSub);
        data.data.renewalCommonCompare = Util.format.percent(data.data.renewalCommonCompare);

        data.data.renewalB = Util.format.money(data.data.renewalB);
        data.data.lastRenewalB = Util.format.money(data.data.lastRenewalB);
        data.data.renewalBSub = Util.format.money(data.data.renewalBSub);
        data.data.renewalBCompare = Util.format.percent(data.data.renewalBCompare);
        return data;
    }
});