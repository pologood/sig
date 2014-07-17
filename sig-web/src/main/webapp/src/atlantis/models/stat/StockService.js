/*
 * Agent Model - StockService 
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.StockService = Backbone.Model.extend({
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
                    if (method == "CostStatAction.getExistsCpcCostByCs") {
                        me.set({data: me.format1(data)});
                    }
                    if (method == "CostStatAction.getExistsCpcCostByCsCompare") {
                        me.set({data: me.format2(data)});
                    }
                    if (method == "LostCustomerAndRenewalStatAction.getLostCustomerByCs") {
                        me.set({data: me.format3(data)});
                    }
                    if (method == "LostCustomerAndRenewalStatAction.getRenewalByCs") {
                        me.set({data: me.format4(data)});
                    }
                    if (method == "LostCustomerAndRenewalStatAction.getRenewalByCsCompare") {
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
       
        data.sum.custs = Util.format.number(data.sum.custs);
        data.sum.custsCommon = Util.format.number(data.sum.custsCommon);
        data.sum.custsB = Util.format.number(data.sum.custsB);
        
        data.sum.costPerCust = Util.format.money(data.sum.costPerCust);
        data.sum.costPerCustCommon = Util.format.money(data.sum.costPerCustCommon);
        data.sum.costPerCustB = Util.format.money(data.sum.costPerCustB);
        
        data.sum.costPerDay = Util.format.money(data.sum.costPerDay);
        data.sum.costPerDayCommon = Util.format.money(data.sum.costPerDayCommon);
        data.sum.costPerDayB = Util.format.money(data.sum.costPerDayB);


        data.sum.costPerCustPerDay = Util.format.money(data.sum.costPerCustPerDay);
        data.sum.costPerCustPerDayCommon = Util.format.money(data.sum.costPerCustPerDayCommon);
        data.sum.costPerCustPerDayB = Util.format.money(data.sum.costPerCustPerDayB);
            
        data.sum.click = Util.format.number(data.sum.click);
        data.sum.clickCommon = Util.format.number(data.sum.clickCommon);
        data.sum.clickB = Util.format.number(data.sum.clickB);

        data.sum.cpc = Util.format.money(data.sum.cpc);
        data.sum.cpcCommon = Util.format.money(data.sum.cpcCommon);
        data.sum.cpcB = Util.format.money(data.sum.cpcB);

        
        
        $.each(data.data, function(index, val) {
            val.csName=val.csName;
            val.cost = Util.format.money(val.cost);
            val.costCommon = Util.format.money(val.costCommon);
            val.costB = Util.format.money(val.costB);
           
            val.custs = Util.format.number(val.custs);
            val.custsCommon = Util.format.number(val.custsCommon);
            val.custsB = Util.format.number(val.custsB);
            
            val.costPerCust = Util.format.money(val.costPerCust);
            val.costPerCustCommon = Util.format.money(val.costPerCustCommon);
            val.costPerCustB = Util.format.money(val.costPerCustB);
            
            val.costPerDay = Util.format.money(val.costPerDay);
            val.costPerDayCommon = Util.format.money(val.costPerDayCommon);
            val.costPerDayB = Util.format.money(val.costPerDayB);
    
    
            val.costPerCustPerDay = Util.format.money(val.costPerCustPerDay);
            val.costPerCustPerDayCommon = Util.format.money(val.costPerCustPerDayCommon);
            val.costPerCustPerDayB = Util.format.money(val.costPerCustPerDayB);
                
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
    
        data.sum.cost = Util.format.money(data.sum.cost);
        data.sum.lastCost = Util.format.money(data.sum.lastCost);
        data.sum.costSub = Util.format.money(data.sum.costSub);
        data.sum.costCompare = Util.format.percent(data.sum.costCompare);
        
        data.sum.costCommon = Util.format.money(data.sum.costCommon);
        data.sum.lastCostCommon = Util.format.money(data.sum.lastCostCommon);
        data.sum.costCommonSub = Util.format.money(data.sum.costCommonSub);
        data.sum.costCommonCompare = Util.format.percent(data.sum.costCommonCompare);
        

        data.sum.costB = Util.format.money(data.sum.costB);
        data.sum.lastCostB = Util.format.money(data.sum.lastCostB);
        data.sum.costBSub = Util.format.money(data.sum.costBSub);
        data.sum.costBCompare = Util.format.percent(data.sum.costBCompare);
        
        data.sum.custs = Util.format.number(data.sum.custs);
        data.sum.lastCusts = Util.format.number(data.sum.lastCusts);
        data.sum.custsSub = Util.format.number(data.sum.custsSub);
        data.sum.custsCompare = Util.format.percent(data.sum.custsCompare);
        
        data.sum.custsCommon = Util.format.number(data.sum.custsCommon);
        data.sum.lastCustsCommon = Util.format.number(data.sum.lastCustsCommon);
        data.sum.custsCommonSub = Util.format.number(data.sum.custsCommonSub);
        data.sum.custsCommonCompare = Util.format.percent(data.sum.custsCommonCompare);
        

        data.sum.custsB = Util.format.number(data.sum.custsB);
        data.sum.lastCustsB = Util.format.number(data.sum.lastCustsB);
        data.sum.custsBSub = Util.format.number(data.sum.custsBSub);
        data.sum.custsBCompare = Util.format.percent(data.sum.custsBCompare);
        
        data.sum.costPerCust = Util.format.money(data.sum.costPerCust);
        data.sum.lastCostPerCust = Util.format.money(data.sum.lastCostPerCust);
        data.sum.costPerCustSub = Util.format.money(data.sum.costPerCustSub);
        data.sum.costPerCustCompare = Util.format.percent(data.sum.costPerCustCompare);
        
        data.sum.costPerCustCommon = Util.format.money(data.sum.costPerCustCommon);
        data.sum.lastCostPerCustCommon = Util.format.money(data.sum.lastCostPerCustCommon);
        data.sum.costPerCustCommonSub = Util.format.money(data.sum.costPerCustCommonSub);
        data.sum.costPerCustCommonCompare = Util.format.percent(data.sum.costPerCustCommonCompare);
        
        data.sum.costPerCustB = Util.format.money(data.sum.costPerCustB);
        data.sum.lastCostPerCustB = Util.format.money(data.sum.lastCostPerCustB);
        data.sum.costPerCustBSub = Util.format.money(data.sum.costPerCustBSub);
        data.sum.costPerCustBCompare = Util.format.percent(data.sum.costPerCustBCompare);
        
        data.sum.costPerDay = Util.format.money(data.sum.costPerDay);
        data.sum.lastCostPerDay = Util.format.money(data.sum.lastCostPerDay);
        data.sum.costPerDaySub = Util.format.money(data.sum.costPerDaySub);
        data.sum.costPerDayCompare = Util.format.percent(data.sum.costPerDayCompare);
        
        data.sum.costPerDayCommon = Util.format.money(data.sum.costPerDayCommon);
        data.sum.lastCostPerDayCommon = Util.format.money(data.sum.lastCostPerDayCommon);
        data.sum.costPerDayCommonSub = Util.format.money(data.sum.costPerDayCommonSub);
        data.sum.costPerDayCommonCompare = Util.format.percent(data.sum.costPerDayCommonCompare);
        
        data.sum.costPerDayB = Util.format.money(data.sum.costPerDayB);
        data.sum.lastCostPerDayB = Util.format.money(data.sum.lastCostPerDayB);
        data.sum.costPerDayBSub = Util.format.money(data.sum.costPerDayBSub);
        data.sum.costPerDayBCompare = Util.format.percent(data.sum.costPerDayBCompare);
        
        data.sum.costPerCustPerDay = Util.format.money(data.sum.costPerCustPerDay);
        data.sum.lastCostPerCustPerDay = Util.format.money(data.sum.lastCostPerCustPerDay);
        data.sum.costPerCustPerDaySub = Util.format.money(data.sum.costPerCustPerDaySub);
        data.sum.costPerCustPerDayCompare = Util.format.percent(data.sum.costPerCustPerDayCompare);
        
        data.sum.costPerCustPerDayCommon = Util.format.money(data.sum.costPerCustPerDayCommon);
        data.sum.lastCostPerCustPerDayCommon = Util.format.money(data.sum.lastCostPerCustPerDayCommon);
        data.sum.costPerCustPerDayCommonSub = Util.format.money(data.sum.costPerCustPerDayCommonSub);
        data.sum.costPerCustPerDayCommonCompare = Util.format.percent(data.sum.costPerCustPerDayCommonCompare);

        data.sum.costPerCustPerDayB = Util.format.money(data.sum.costPerCustPerDayB);
        data.sum.lastCostPerCustPerDayB = Util.format.money(data.sum.lastCostPerCustPerDayB);
        data.sum.costPerCustPerDayBSub = Util.format.money(data.sum.costPerCustPerDayBSub);
        data.sum.costPerCustPerDayBCompare = Util.format.percent(data.sum.costPerCustPerDayBCompare);
        
        data.sum.click = Util.format.number(data.sum.click);
        data.sum.lastClick = Util.format.number(data.sum.lastClick);
        data.sum.clickSub = Util.format.number(data.sum.clickSub);
        data.sum.clickCompare = Util.format.percent(data.sum.clickCompare);
        
        data.sum.clickCommon = Util.format.number(data.sum.clickCommon);
        data.sum.lastClickCommon = Util.format.number(data.sum.lastClickCommon);
        data.sum.clickCommonSub = Util.format.number(data.sum.clickCommonSub);
        data.sum.clickCommonCompare = Util.format.percent(data.sum.clickCommonCompare);
        
        data.sum.clickB = Util.format.number(data.sum.clickB);
        data.sum.lastClickB = Util.format.number(data.sum.lastClickB);
        data.sum.clickBSub = Util.format.number(data.sum.clickBSub);
        data.sum.clickBCompare = Util.format.percent(data.sum.clickBCompare);
        
        data.sum.cpc = Util.format.money(data.sum.cpc);
        data.sum.lastCpc = Util.format.money(data.sum.lastCpc);
        data.sum.cpcSub = Util.format.money(data.sum.cpcSub);
        data.sum.cpcCompare = Util.format.percent(data.sum.cpcCompare);
        
        data.sum.cpcCommon = Util.format.money(data.sum.cpcCommon);
        data.sum.lastCpcCommon = Util.format.money(data.sum.lastCpcCommon);
        data.sum.cpcCommonSub = Util.format.money(data.sum.cpcCommonSub);
        data.sum.cpcCommonCompare = Util.format.percent(data.sum.cpcCommonCompare);

        data.sum.cpcB = Util.format.money(data.sum.cpcB);
        data.sum.lastCpcB = Util.format.money(data.sum.lastCpcB);
        data.sum.cpcBSub = Util.format.money(data.sum.cpcBSub);
        data.sum.cpcBCompare = Util.format.percent(data.sum.cpcBCompare);
        
        $.each(data.data, function(index, val) {
               val.csName=val.csName;
            val.cost = Util.format.money(val.cost);
            val.lastCost = Util.format.money(val.lastCost);
            val.costSub = Util.format.money(val.costSub);
            val.costCompare = Util.format.percent(val.costCompare);
            
            val.costCommon = Util.format.money(val.costCommon);
            val.lastCostCommon = Util.format.money(val.lastCostCommon);
            val.costCommonSub = Util.format.money(val.costCommonSub);
            val.costCommonCompare = Util.format.percent(val.costCommonCompare);
            
    
            val.costB = Util.format.money(val.costB);
            val.lastCostB = Util.format.money(val.lastCostB);
            val.costBSub = Util.format.money(val.costBSub);
            val.costBCompare = Util.format.percent(val.costBCompare);
            
            val.custs = Util.format.number(val.custs);
            val.lastCusts = Util.format.number(val.lastCusts);
            val.custsSub = Util.format.number(val.custsSub);
            val.custsCompare = Util.format.percent(val.custsCompare);
            
            val.custsCommon = Util.format.number(val.custsCommon);
            val.lastCustsCommon = Util.format.number(val.lastCustsCommon);
            val.custsCommonSub = Util.format.number(val.custsCommonSub);
            val.custsCommonCompare = Util.format.percent(val.custsCommonCompare);
            
    
            val.custsB = Util.format.number(val.custsB);
            val.lastCustsB = Util.format.number(val.lastCustsB);
            val.custsBSub = Util.format.number(val.custsBSub);
            val.custsBCompare = Util.format.percent(val.custsBCompare);
            
            val.costPerCust = Util.format.money(val.costPerCust);
            val.lastCostPerCust = Util.format.money(val.lastCostPerCust);
            val.costPerCustSub = Util.format.money(val.costPerCustSub);
            val.costPerCustCompare = Util.format.percent(val.costPerCustCompare);
            
            val.costPerCustCommon = Util.format.money(val.costPerCustCommon);
            val.lastCostPerCustCommon = Util.format.money(val.lastCostPerCustCommon);
            val.costPerCustCommonSub = Util.format.money(val.costPerCustCommonSub);
            val.costPerCustCommonCompare = Util.format.percent(val.costPerCustCommonCompare);
            
            val.costPerCustB = Util.format.money(val.costPerCustB);
            val.lastCostPerCustB = Util.format.money(val.lastCostPerCustB);
            val.costPerCustBSub = Util.format.money(val.costPerCustBSub);
            val.costPerCustBCompare = Util.format.percent(val.costPerCustBCompare);
            
            val.costPerDay = Util.format.money(val.costPerDay);
            val.lastCostPerDay = Util.format.money(val.lastCostPerDay);
            val.costPerDaySub = Util.format.money(val.costPerDaySub);
            val.costPerDayCompare = Util.format.percent(val.costPerDayCompare);
            
            val.costPerDayCommon = Util.format.money(val.costPerDayCommon);
            val.lastCostPerDayCommon = Util.format.money(val.lastCostPerDayCommon);
            val.costPerDayCommonSub = Util.format.money(val.costPerDayCommonSub);
            val.costPerDayCommonCompare = Util.format.percent(val.costPerDayCommonCompare);
            
            val.costPerDayB = Util.format.money(val.costPerDayB);
            val.lastCostPerDayB = Util.format.money(val.lastCostPerDayB);
            val.costPerDayBSub = Util.format.money(val.costPerDayBSub);
            val.costPerDayBCompare = Util.format.percent(val.costPerDayBCompare);
            
            val.costPerCustPerDay = Util.format.money(val.costPerCustPerDay);
            val.lastCostPerCustPerDay = Util.format.money(val.lastCostPerCustPerDay);
            val.costPerCustPerDaySub = Util.format.money(val.costPerCustPerDaySub);
            val.costPerCustPerDayCompare = Util.format.percent(val.costPerCustPerDayCompare);
            
            val.costPerCustPerDayCommon = Util.format.money(val.costPerCustPerDayCommon);
            val.lastCostPerCustPerDayCommon = Util.format.money(val.lastCostPerCustPerDayCommon);
            val.costPerCustPerDayCommonSub = Util.format.money(val.costPerCustPerDayCommonSub);
            val.costPerCustPerDayCommonCompare = Util.format.percent(val.costPerCustPerDayCommonCompare);
    
            val.costPerCustPerDayB = Util.format.money(val.costPerCustPerDayB);
            val.lastCostPerCustPerDayB = Util.format.money(val.lastCostPerCustPerDayB);
            val.costPerCustPerDayBSub = Util.format.money(val.costPerCustPerDayBSub);
            val.costPerCustPerDayBCompare = Util.format.percent(val.costPerCustPerDayBCompare);
            
            val.click = Util.format.number(val.click);
            val.lastClick = Util.format.number(val.lastClick);
            val.clickSub = Util.format.number(val.clickSub);
            val.clickCompare = Util.format.percent(val.clickCompare);
            
            val.clickCommon = Util.format.number(val.clickCommon);
            val.lastClickCommon = Util.format.number(val.lastClickCommon);
            val.clickCommonSub = Util.format.number(val.clickCommonSub);
            val.clickCommonCompare = Util.format.percent(val.clickCommonCompare);
            
            val.clickB = Util.format.number(val.clickB);
            val.lastClickB = Util.format.number(val.lastClickB);
            val.clickBSub = Util.format.number(val.clickBSub);
            val.clickBCompare = Util.format.percent(val.clickBCompare);
            
            val.cpc = Util.format.money(val.cpc);
            val.lastCpc = Util.format.money(val.lastCpc);
            val.cpcSub = Util.format.money(val.cpcSub);
            val.cpcCompare = Util.format.percent(val.cpcCompare);
            
            val.cpcCommon = Util.format.money(val.cpcCommon);
            val.lastCpcCommon = Util.format.money(val.lastCpcCommon);
            val.cpcCommonSub = Util.format.money(val.cpcCommonSub);
            val.cpcCommonCompare = Util.format.percent(val.cpcCommonCompare);
    
            val.cpcB = Util.format.money(val.cpcB);
            val.lastCpcB = Util.format.money(val.lastCpcB);
            val.cpcBSub = Util.format.money(val.cpcBSub);
            val.cpcBCompare = Util.format.percent(val.cpcBCompare);
        });
        return data;
    },
    
    format3: function(data) {
    	data.sum.lostCusts=Util.format.number(data.sum.lostCusts);
    	data.sum.lostCustsCommon=Util.format.number(data.sum.lostCustsCommon);
    	data.sum.lostCustsB=Util.format.number(data.sum.lostCustsB);
    
    	data.sum.lostCustsRate=Util.format.percent(data.sum.lostCustsRate);
    	data.sum.lostCustsRateCommon=Util.format.percent(data.sum.lostCustsRateCommon);
    	data.sum.lostCustsRateB=Util.format.percent(data.sum.lostCustsRateB);
    	
       $.each(data.data, function(index, val) {
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
        	val.renewal=Util.format.money(val.renewal);
        	val.renewalCommon=Util.format.money(val.renewalCommon);
        	val.renewalB=Util.format.money(val.renewalB);
        });
        return data;
    },
    
    format5: function(data) {
        data.sum.renewal = Util.format.money(data.sum.renewal);
        data.sum.lastRenewal = Util.format.money(data.sum.lastRenewal);
        data.sum.renewalSub = Util.format.money(data.sum.renewalSub);
        data.sum.renewalCompare = Util.format.percent(data.sum.renewalCompare);
        
        data.sum.renewalCommon = Util.format.money(data.sum.renewalCommon);
        data.sum.lastRenewalCommon = Util.format.money(data.sum.lastRenewalCommon);
        data.sum.renewalCommonSub = Util.format.money(data.sum.renewalCommonSub);
        data.sum.renewalCommonCompare = Util.format.percent(data.sum.renewalCommonCompare);

        data.sum.renewalB = Util.format.money(data.sum.renewalB);
        data.sum.lastRenewalB = Util.format.money(data.sum.lastRenewalB);
        data.sum.renewalBSub = Util.format.money(data.sum.renewalBSub);
        data.sum.renewalBCompare = Util.format.percent(data.sum.renewalBCompare);
    	
    	$.each(data.data, function(index, val) {
	        val.renewal = Util.format.money(val.renewal);
	        val.lastRenewal = Util.format.money(val.lastRenewal);
	        val.renewalSub = Util.format.money(val.renewalSub);
	        val.renewalCompare = Util.format.percent(val.renewalCompare);
	        
	        val.renewalCommon = Util.format.money(val.renewalCommon);
	        val.lastRenewalCommon = Util.format.money(val.lastRenewalCommon);
	        val.renewalCommonSub = Util.format.money(val.renewalCommonSub);
	        val.renewalCommonCompare = Util.format.percent(val.renewalCommonCompare);
	
	        val.renewalB = Util.format.money(val.renewalB);
	        val.lastRenewalB = Util.format.money(val.lastRenewalB);
	        val.renewalBSub = Util.format.money(val.renewalBSub);
	        val.renewalBCompare = Util.format.percent(val.renewalBCompare);
    	});
    	return data;
    }
});