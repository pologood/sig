/*
 * Atlantis Model - IncrementService 
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.IncrementService = Backbone.Model.extend({
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
                    if (method == "CostStatAction.getAddCpcCostByCs") {
                        me.set({data: me.format1(data)});
                    }
                    if (method == "CostStatAction.getAddCpcCostByCsCompare") {
                        me.set({data: me.format2(data)});
                    }
                    if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByCs") {
                        me.set({data: me.format3(data)});
                    }
                    if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByCsCompare") {
                        me.set({data: me.format4(data)});
                    }
                }
            }
        });
//        var data1={
//           sum:{
//               cost:123,//消耗-所有行业
//            costCommon:123,//消耗-正常行业
//            costB:123,//消耗-特殊行业
//
//            custs:123,//有消耗客户数-所有行业
//            custsCommon:123,//有消耗客户数-正常行业
//            custsB:123,//有消耗客户数-特殊行业
//
//            costPerCust:123,//户均消耗-所有行业
//            costPerCustCommon:123,//户均消耗-正常行业
//            costPerCustB:123,//户均消耗-特殊行业
//
//            costPerDay:123,//日均消耗-所有行业
//            costPerDayCommon:123,//日均消耗-正常行业
//            costPerDayB:123,//日均消耗-特殊行业
//
//            costPerCustPerDay:123,//日户均消耗-所有行业
//            costPerCustPerDayCommon:123,//日户均消耗-正常行业
//            costPerCustPerDayB:123,//日户均消耗-特殊行业
//
//            click:123,//点击数-所有行业
//            clickCommon:123,//点击数-正常行业
//            clickB:123,//点击数-特殊行业
//
//            cpc:123,//点击均价-所有行业
//            cpcCommon:123,//点击均价-正常行业
//            cpcB:123//点击均价-特殊行业
//            },
//           data:[{
//            csName:'testuser',
//               cost:234,//消耗-所有行业
//            costCommon:234,//消耗-正常行业
//            costB:234,//消耗-特殊行业
//
//            custs:234,//有消耗客户数-所有行业
//            custsCommon:234,//有消耗客户数-正常行业
//            custsB:234,//有消耗客户数-特殊行业
//
//            costPerCust:234,//户均消耗-所有行业
//            costPerCustCommon:234,//户均消耗-正常行业
//            costPerCustB:234,//户均消耗-特殊行业
//
//            costPerDay:234,//日均消耗-所有行业
//            costPerDayCommon:234,//日均消耗-正常行业
//            costPerDayB:234,//日均消耗-特殊行业
//
//            costPerCustPerDay:234,//日户均消耗-所有行业
//            costPerCustPerDayCommon:234,//日户均消耗-正常行业
//            costPerCustPerDayB:234,//日户均消耗-特殊行业
//
//            click:234,//点击数-所有行业
//            clickCommon:234,//点击数-正常行业
//            clickB:234,//点击数-特殊行业
//
//            cpc:234,//点击均价-所有行业
//            cpcCommon:234,//点击均价-正常行业
//            cpcB:234//点击均价-特殊行业
//           
//           },{
//            csName:'testUser2',
//               cost:567,//消耗-所有行业
//            costCommon:567,//消耗-正常行业
//            costB:567,//消耗-特殊行业
//
//            custs:567,//有消耗客户数-所有行业
//            custsCommon:567,//有消耗客户数-正常行业
//            custsB:567,//有消耗客户数-特殊行业
//
//            costPerCust:567,//户均消耗-所有行业
//            costPerCustCommon:567,//户均消耗-正常行业
//            costPerCustB:567,//户均消耗-特殊行业
//
//            costPerDay:567,//日均消耗-所有行业
//            costPerDayCommon:567,//日均消耗-正常行业
//            costPerDayB:567,//日均消耗-特殊行业
//
//            costPerCustPerDay:567,//日户均消耗-所有行业
//            costPerCustPerDayCommon:567,//日户均消耗-正常行业
//            costPerCustPerDayB:567,//日户均消耗-特殊行业
//
//            click:567,//点击数-所有行业
//            clickCommon:567,//点击数-正常行业
//            clickB:567,//点击数-特殊行业
//
//            cpc:567,//点击均价-所有行业
//            cpcCommon:567,//点击均价-正常行业
//            cpcB:567//点击均价-特殊行业
//           }]
//        };
//        
//        var data2={
//          sum:{
//              cost:467,//消耗-所有行业
//            lastCost:467,//消耗-所有行业-上期
//            costSub:467,//消耗-所有行业-差值
//            costCompare:467,//消耗-所有行业-同环比
//
//            costCommon:467,//消耗-正常行业
//            lastCostCommon:467,//消耗-正常行业-上期
//            costCommonSub:467,//消耗-正常行业-差值
//            costCommonCompare:467,//消耗-正常行业-同环比
//            costB:467,//消耗-特殊行业行业
//            lastCostB:467,//消耗-特殊行业行业-上期
//            costBSub:467,//消耗-特殊行业行业-差值
//            costBCompare:467,//消耗-特殊行业行业-同环比
//            custs:467,
//            lastCusts:467,//有消耗客户数-所有行业-上期
//            custsSub:467,//有消耗客户数-所有行业-差值
//            custsCompare:467,//有消耗客户数-所有行业-同环比
//            custsCommon:467,//有消耗客户数-正常行业-本期
//            lastCustsCommon:467,//有消耗客户数-正常行业-上期
//            custsCommonSub:467,//有消耗客户数-正常行业-差值
//            custsCommonCompare:467,//有消耗客户数-正常行业-同环比
//            custsB:467,//有消耗客户数-特殊行业行业-本期
//            lastCustsB:467,//有消耗客户数-特殊行业行业-上期
//            custsBSub:467,//有消耗客户数-特殊行业行业-差值
//            custsBCompare:467,//有消耗客户数-特殊行业行业-同环比
//            costPerCust:467,//户均消耗-所有行业-本期
//            lastCostPerCust:467,//户均消耗-所有行业-上期
//            costPerCustSub:467,//户均消耗-所有行业-差值
//            costPerCustCompare:467,//户均消耗-所有行业-同环比
//            costPerCustCommon:467,//户均消耗-正常行业-本期
//            lastCostPerCustCommon:467,//户均消耗-正常行业-上期
//            costPerCustCommonSub:467,//户均消耗-正常行业-差值
//            costPerCustCommonCompare:467,//户均消耗-正常行业-同环比
//            costPerCustB:467,//户均消耗-特殊行业行业-本期
//            lastCostPerCustB:467,//户均消耗-特殊行业行业-上期
//            costPerCustBSub:467,//户均消耗-特殊行业行业-差值
//            costPerCustBCompare:467,//户均消耗-特殊行业行业-同环比
//            costPerDay:467,//日均消耗-所有行业-本期
//            lastCostPerDay:467,//日均消耗-所有行业-上期
//            costPerDaySub:467,//日均消耗-所有行业-差值
//            costPerDayCompare:345,//日均消耗-所有行业-同环比
//
//            costPerDayCommon:467,//日均消耗-正常行业-本期
//            lastCostPerDayCommon:467,//日均消耗-正常行业-上期
//            costPerDayCommonSub:467,//日均消耗-正常行业-差值
//            costPerDayCommonCompare:467,//日均消耗-正常行业-同环比
//
//            costPerDayB:467,//日均消耗-特殊行业行业-本期
//            lastCostPerDayB:467,//日均消耗-特殊行业行业-上期
//            costPerDayBSub:467,//日均消耗-特殊行业行业-差值
//            costPerDayBCompare:467,//日均消耗-特殊行业行业-同环比
//
//            costPerCustPerDay:467,//日户均消耗-所有行业-本期
//            lastPerCustCostPerDay:467,//日户均消耗-所有行业-上期
//            costPerCustPerDaySub:467,//日户均消耗-所有行业-差值
//            costPerCustPerDayCompare:234,//日户均消耗-所有行业-同环比
//
//            costPerCustPerDayCommon:467,//日户均消耗-正常行业-本期
//            lastPerCustCostPerDayCommon:467,//日户均消耗-正常行业-上期
//            costPerCustPerDayCommonSub:467,//日户均消耗-正常行业-差值
//            costPerCustPerDayCommonCompare:467,//日户均消耗-正常行业-同环比
//
//            costPerCustPerDayB:467,//日户均消耗-特殊行业行业-本期
//            lastPerCustCostPerDayB:467,//日户均消耗-特殊行业行业-上期
//            costPerCustPerDayBSub:467,//日户均消耗-特殊行业行业-差值
//            costPerCustPerDayBCompare:467,//日户均消耗-特殊行业行业-同环比
//
//            click:467,//点击数-所有行业-本期
//            lastClick:467,//点击数-所有行业-上期
//            clickSub:467,//点击数-所有行业-差值
//            clickCompare:467,//点击数-所有行业-同环比
//
//            clickCommon:467,//点击数-正常行业-本期
//            lastClickCommon:467,//点击数-正常行业-上期
//            clickCommonSub:467,//点击数-正常行业-差值
//            clickCommonCompare:467,//点击数-正常行业-同环比
//
//            clickB:467,//点击数-特殊行业行业-本期
//            lastClickB:467,//点击数-特殊行业行业-上期
//            clickBSub:467,//点击数-特殊行业行业-差值
//            clickBCompare:467,//点击数-特殊行业行业-同环比
//
//            cpc:467,//点击均价-所有行业-本期
//            lastCpc:467,//点击均价-所有行业-上期
//            cpcSub:467,//点击均价-所有行业-差值
//            cpcCompare:467,//点击均价-所有行业-同环比
//
//            cpcCommon:467,//点击均价-正常行业-本期
//            lastCpcCommon:467,//点击均价-正常行业-上期
//            cpcCommonSub:467,//点击均价-正常行业-差值
//            cpcCommonCompare:467,//点击均价-正常行业-同环比
//
//            cpcB:467,//点击均价-特殊行业行业-本期
//            lastCpcB:467,//点击均价-特殊行业行业-上期
//            cpcBSub:467,//点击均价-特殊行业行业-差值
//            cpcBCompare:467//点击均价-特殊行业行业-同环比
//              
//            },
//          data:[{
//            csName:'testUser3',
//              cost:467,//消耗-所有行业
//            lastCost:467,//消耗-所有行业-上期
//            costSub:467,//消耗-所有行业-差值
//            costCompare:467,//消耗-所有行业-同环比
//
//            costCommon:467,//消耗-正常行业
//            lastCostCommon:467,//消耗-正常行业-上期
//            costCommonSub:467,//消耗-正常行业-差值
//            costCommonCompare:467,//消耗-正常行业-同环比
//            costB:467,//消耗-特殊行业行业
//            lastCostB:467,//消耗-特殊行业行业-上期
//            costBSub:467,//消耗-特殊行业行业-差值
//            costBCompare:467,//消耗-特殊行业行业-同环比
//            custs:467,
//            lastCusts:467,//有消耗客户数-所有行业-上期
//            custsSub:467,//有消耗客户数-所有行业-差值
//            custsCompare:467,//有消耗客户数-所有行业-同环比
//            custsCommon:467,//有消耗客户数-正常行业-本期
//            lastCustsCommon:467,//有消耗客户数-正常行业-上期
//            custsCommonSub:467,//有消耗客户数-正常行业-差值
//            custsCommonCompare:467,//有消耗客户数-正常行业-同环比
//            custsB:467,//有消耗客户数-特殊行业行业-本期
//            lastCustsB:467,//有消耗客户数-特殊行业行业-上期
//            custsBSub:467,//有消耗客户数-特殊行业行业-差值
//            custsBCompare:467,//有消耗客户数-特殊行业行业-同环比
//            costPerCust:467,//户均消耗-所有行业-本期
//            lastCostPerCust:467,//户均消耗-所有行业-上期
//            costPerCustSub:467,//户均消耗-所有行业-差值
//            costPerCustCompare:467,//户均消耗-所有行业-同环比
//            costPerCustCommon:467,//户均消耗-正常行业-本期
//            lastCostPerCustCommon:467,//户均消耗-正常行业-上期
//            costPerCustCommonSub:467,//户均消耗-正常行业-差值
//            costPerCustCommonCompare:467,//户均消耗-正常行业-同环比
//            costPerCustB:467,//户均消耗-特殊行业行业-本期
//            lastCostPerCustB:467,//户均消耗-特殊行业行业-上期
//            costPerCustBSub:467,//户均消耗-特殊行业行业-差值
//            costPerCustBCompare:467,//户均消耗-特殊行业行业-同环比
//            costPerDay:467,//日均消耗-所有行业-本期
//            lastCostPerDay:467,//日均消耗-所有行业-上期
//            costPerDaySub:467,//日均消耗-所有行业-差值
//            costPerDayCompare:345,//日均消耗-所有行业-同环比
//
//            costPerDayCommon:467,//日均消耗-正常行业-本期
//            lastCostPerDayCommon:467,//日均消耗-正常行业-上期
//            costPerDayCommonSub:467,//日均消耗-正常行业-差值
//            costPerDayCommonCompare:467,//日均消耗-正常行业-同环比
//
//            costPerDayB:467,//日均消耗-特殊行业行业-本期
//            lastCostPerDayB:467,//日均消耗-特殊行业行业-上期
//            costPerDayBSub:467,//日均消耗-特殊行业行业-差值
//            costPerDayBCompare:467,//日均消耗-特殊行业行业-同环比
//
//            costPerCustPerDay:467,//日户均消耗-所有行业-本期
//            lastPerCustCostPerDay:467,//日户均消耗-所有行业-上期
//            costPerCustPerDaySub:467,//日户均消耗-所有行业-差值
//            costPerCustPerDayCompare:234,//日户均消耗-所有行业-同环比
//
//            costPerCustPerDayCommon:467,//日户均消耗-正常行业-本期
//            lastPerCustCostPerDayCommon:467,//日户均消耗-正常行业-上期
//            costPerCustPerDayCommonSub:467,//日户均消耗-正常行业-差值
//            costPerCustPerDayCommonCompare:467,//日户均消耗-正常行业-同环比
//
//            costPerCustPerDayB:467,//日户均消耗-特殊行业行业-本期
//            lastPerCustCostPerDayB:467,//日户均消耗-特殊行业行业-上期
//            costPerCustPerDayBSub:467,//日户均消耗-特殊行业行业-差值
//            costPerCustPerDayBCompare:467,//日户均消耗-特殊行业行业-同环比
//
//            click:467,//点击数-所有行业-本期
//            lastClick:467,//点击数-所有行业-上期
//            clickSub:467,//点击数-所有行业-差值
//            clickCompare:467,//点击数-所有行业-同环比
//
//            clickCommon:467,//点击数-正常行业-本期
//            lastClickCommon:467,//点击数-正常行业-上期
//            clickCommonSub:467,//点击数-正常行业-差值
//            clickCommonCompare:467,//点击数-正常行业-同环比
//
//            clickB:467,//点击数-特殊行业行业-本期
//            lastClickB:467,//点击数-特殊行业行业-上期
//            clickBSub:467,//点击数-特殊行业行业-差值
//            clickBCompare:467,//点击数-特殊行业行业-同环比
//
//            cpc:467,//点击均价-所有行业-本期
//            lastCpc:467,//点击均价-所有行业-上期
//            cpcSub:467,//点击均价-所有行业-差值
//            cpcCompare:467,//点击均价-所有行业-同环比
//
//            cpcCommon:467,//点击均价-正常行业-本期
//            lastCpcCommon:467,//点击均价-正常行业-上期
//            cpcCommonSub:467,//点击均价-正常行业-差值
//            cpcCommonCompare:467,//点击均价-正常行业-同环比
//
//            cpcB:467,//点击均价-特殊行业行业-本期
//            lastCpcB:467,//点击均价-特殊行业行业-上期
//            cpcBSub:467,//点击均价-特殊行业行业-差值
//            cpcBCompare:467//点击均价-特殊行业行业-同环比
//          },
//          {
//              csName:'testUser4',
//              cost:256,//消耗-所有行业
//            lastCost:256,//消耗-所有行业-上期
//            costSub:256,//消耗-所有行业-差值
//            costCompare:256,//消耗-所有行业-同环比
//
//            costCommon:256,//消耗-正常行业
//            lastCostCommon:256,//消耗-正常行业-上期
//            costCommonSub:256,//消耗-正常行业-差值
//            costCommonCompare:256,//消耗-正常行业-同环比
//            costB:256,//消耗-特殊行业行业
//            lastCostB:256,//消耗-特殊行业行业-上期
//            costBSub:256,//消耗-特殊行业行业-差值
//            costBCompare:256,//消耗-特殊行业行业-同环比
//            custs:256,
//            lastCusts:256,//有消耗客户数-所有行业-上期
//            custsSub:256,//有消耗客户数-所有行业-差值
//            custsCompare:256,//有消耗客户数-所有行业-同环比
//            custsCommon:256,//有消耗客户数-正常行业-本期
//            lastCustsCommon:256,//有消耗客户数-正常行业-上期
//            custsCommonSub:256,//有消耗客户数-正常行业-差值
//            custsCommonCompare:256,//有消耗客户数-正常行业-同环比
//            custsB:256,//有消耗客户数-特殊行业行业-本期
//            lastCustsB:256,//有消耗客户数-特殊行业行业-上期
//            custsBSub:256,//有消耗客户数-特殊行业行业-差值
//            custsBCompare:256,//有消耗客户数-特殊行业行业-同环比
//            costPerCust:256,//户均消耗-所有行业-本期
//            lastCostPerCust:256,//户均消耗-所有行业-上期
//            costPerCustSub:256,//户均消耗-所有行业-差值
//            costPerCustCompare:256,//户均消耗-所有行业-同环比
//            costPerCustCommon:256,//户均消耗-正常行业-本期
//            lastCostPerCustCommon:256,//户均消耗-正常行业-上期
//            costPerCustCommonSub:256,//户均消耗-正常行业-差值
//            costPerCustCommonCompare:256,//户均消耗-正常行业-同环比
//            costPerCustB:256,//户均消耗-特殊行业行业-本期
//            lastCostPerCustB:256,//户均消耗-特殊行业行业-上期
//            costPerCustBSub:256,//户均消耗-特殊行业行业-差值
//            costPerCustBCompare:256,//户均消耗-特殊行业行业-同环比
//            costPerDay:256,//日均消耗-所有行业-本期
//            lastCostPerDay:256,//日均消耗-所有行业-上期
//            costPerDaySub:256,//日均消耗-所有行业-差值
//            costPerDayCompare:345,//日均消耗-所有行业-同环比
//
//            costPerDayCommon:256,//日均消耗-正常行业-本期
//            lastCostPerDayCommon:256,//日均消耗-正常行业-上期
//            costPerDayCommonSub:256,//日均消耗-正常行业-差值
//            costPerDayCommonCompare:256,//日均消耗-正常行业-同环比
//
//            costPerDayB:256,//日均消耗-特殊行业行业-本期
//            lastCostPerDayB:256,//日均消耗-特殊行业行业-上期
//            costPerDayBSub:256,//日均消耗-特殊行业行业-差值
//            costPerDayBCompare:256,//日均消耗-特殊行业行业-同环比
//
//            costPerCustPerDay:256,//日户均消耗-所有行业-本期
//            lastPerCustCostPerDay:256,//日户均消耗-所有行业-上期
//            costPerCustPerDaySub:256,//日户均消耗-所有行业-差值
//            costPerCustPerDayCompare:234,//日户均消耗-所有行业-同环比
//
//            costPerCustPerDayCommon:256,//日户均消耗-正常行业-本期
//            lastPerCustCostPerDayCommon:256,//日户均消耗-正常行业-上期
//            costPerCustPerDayCommonSub:256,//日户均消耗-正常行业-差值
//            costPerCustPerDayCommonCompare:256,//日户均消耗-正常行业-同环比
//
//            costPerCustPerDayB:256,//日户均消耗-特殊行业行业-本期
//            lastPerCustCostPerDayB:256,//日户均消耗-特殊行业行业-上期
//            costPerCustPerDayBSub:256,//日户均消耗-特殊行业行业-差值
//            costPerCustPerDayBCompare:256,//日户均消耗-特殊行业行业-同环比
//
//            click:256,//点击数-所有行业-本期
//            lastClick:256,//点击数-所有行业-上期
//            clickSub:256,//点击数-所有行业-差值
//            clickCompare:256,//点击数-所有行业-同环比
//
//            clickCommon:256,//点击数-正常行业-本期
//            lastClickCommon:256,//点击数-正常行业-上期
//            clickCommonSub:256,//点击数-正常行业-差值
//            clickCommonCompare:256,//点击数-正常行业-同环比
//
//            clickB:256,//点击数-特殊行业行业-本期
//            lastClickB:256,//点击数-特殊行业行业-上期
//            clickBSub:256,//点击数-特殊行业行业-差值
//            clickBCompare:256,//点击数-特殊行业行业-同环比
//
//            cpc:256,//点击均价-所有行业-本期
//            lastCpc:256,//点击均价-所有行业-上期
//            cpcSub:256,//点击均价-所有行业-差值
//            cpcCompare:256,//点击均价-所有行业-同环比
//
//            cpcCommon:256,//点击均价-正常行业-本期
//            lastCpcCommon:256,//点击均价-正常行业-上期
//            cpcCommonSub:256,//点击均价-正常行业-差值
//            cpcCommonCompare:256,//点击均价-正常行业-同环比
//
//            cpcB:256,//点击均价-特殊行业行业-本期
//            lastCpcB:256,//点击均价-特殊行业行业-上期
//            cpcBSub:256,//点击均价-特殊行业行业-差值
//            cpcBCompare:256//点击均价-特殊行业行业-同环比
//          }]};
//   var data3={    
//    sum: {
//                newCusts:123,//新开户总数-所有行业
//                newCustsCommon:123,//新开户总数-正常行业
//                newCustsB:123,//新开户总数-B类
//                
//                newCostCusts:123,//新开有消耗客户数-所有行业
//                newCostCustsCommon:123,//新开有消耗客户数-正常行业
//                newCostCustsB:123,//新开有消耗客户数-B类
//                
//                newNoCostCusts:123,//新开无消耗客户-所有行业
//                newNoCostCustsCommon:123,//新开无消耗客户-正常行业
//                newNoCostCustsB:123//新开无消耗客户-B类
//        },
//        data:[
//              {    
//                  csName:'testuser5',
//                newCusts:123,//新开户总数-所有行业
//                newCustsCommon:123,//新开户总数-正常行业
//                newCustsB:123,//新开户总数-B类
//                
//                newCostCusts:123,//新开有消耗客户数-所有行业
//                newCostCustsCommon:123,//新开有消耗客户数-正常行业
//                newCostCustsB:123,//新开有消耗客户数-B类
//                
//                newNoCostCusts:123,//新开无消耗客户-所有行业
//                newNoCostCustsCommon:123,//新开无消耗客户-正常行业
//                newNoCostCustsB:123//新开无消耗客户-B类
//              },
//              {    
//                  csName:'testuser6',
//                newCusts:123,//新开户总数-所有行业
//                newCustsCommon:123,//新开户总数-正常行业
//                newCustsB:123,//新开户总数-B类
//                
//                newCostCusts:123,//新开有消耗客户数-所有行业
//                newCostCustsCommon:123,//新开有消耗客户数-正常行业
//                newCostCustsB:123,//新开有消耗客户数-B类
//                
//                newNoCostCusts:123,//新开无消耗客户-所有行业
//                newNoCostCustsCommon:123,//新开无消耗客户-正常行业
//                newNoCostCustsB:123//新开无消耗客户-B类
//              }
//        ]
//    };
//    
//    var data4={    
//    sum: {
//            newCusts:675,//新开户总数-所有行业-本期
//            lastNewCusts:675,//新开户总数-所有行业-上期
//            newCustsSub:675,//新开户总数-所有行业-差值
//            newCustsCompare:675,//新开户总数-所有行业-同环比
//            
//            newCustsCommon:675,// 新开户总数-正常行业-本期
//            lastNewCustsCommon:675,// 新开户总数-正常行业-上期
//            newCustsCommonSub:675,// 新开户总数-正常行业-差值
//            newCustsCommonCompare:675,// 新开户总数-正常行业-同环比
//            
//            newCustsB:675,// 新开户总数-B类-本期
//            lastNewCustsB:675,// 新开户总数-B类-上期
//            newCustsBSub:675,// 新开户总数-B类-差值
//            newCustsBCompare:675,// 新开户总数-B类-同环比
//            
//            newCostCusts:675,//新开有消耗客户-所有行业-本期
//            lastNewCostCusts:675,//新开有消耗客户-所有行业-上期
//            newCostCustsSub:675,//新开有消耗客户-所有行业-差值
//            newCostCustsCompare:675,//新开有消耗客户-所有行业-同环比
//            
//            newCostCustsCommon:675,// 新开有消耗客户-正常行业-本期
//            lastNewCostCustsCommon:675,// 新开有消耗客户-正常行业-上期
//            newCostCustsCommonSub:675,// 新开有消耗客户-正常行业-差值
//            newCostCustsCommonCompare:675,//新开有消耗客户-正常行业-同环比
//            
//            newCostCustsB:675,// 新开有消耗客户-B类-本期
//            lastNewCostCustsB:675,// 新开有消耗客户-B类-上期
//            newCostCustsBSub:675,// 新开有消耗客户-B类-差值
//            newCostCustsBCompare:675,// 新开有消耗客户-B类-同环比
//            
//            newNoCostCusts:675,//新开无消耗客户-所有行业-本期
//            lastNewNoCostCusts:675,//新开无消耗客户-所有行业-上期
//            newNoCostCustsSub:675,// 新开无消耗客户-所有行业-差值
//            newNoCostCustsCompare:675,// 新开无消耗客户-所有行业-
//            
//            
//            newNoCostCustsCommon:675,// 新开无消耗客户-正常行业-本期
//            lastNewNoCostCustsCommon:675,//新开无消耗客户-正常行业-
//            
//            newNoCostCustsCommonSub:675,//新开无消耗客户-正常行业-
//            
//            newNoCostCustsCommonCompare:675,//新开无消耗客户-正常行业
//                                                                  
//            
//            newNoCostCustsB:675,// 新开无消耗客户-B类-本期
//            lastNewNoCostCustsB:675,// 新开无消耗客户-B类-上期
//            newNoCostCustsBSub:675,// 新开无消耗客户-B类-差值
//            newNoCostCustsBCompare:675// 新开无消耗客户-B类-同环比
//
//        },
//        data:[
//              {    
//                  csName:'testuser7',
//                newCusts:123,//新开户总数-所有行业-本期
//                lastNewCusts:234,//新开户总数-所有行业-上期
//                newCustsSub:234,//新开户总数-所有行业-差值
//                newCustsCompare:234,//新开户总数-所有行业-同环比
//                
//                newCustsCommon:234,// 新开户总数-正常行业-本期
//                lastNewCustsCommon:234,// 新开户总数-正常行业-上期
//                newCustsCommonSub:234,// 新开户总数-正常行业-差值
//                newCustsCommonCompare:234,// 新开户总数-正常行业-同环比
//                
//                newCustsB:234,// 新开户总数-B类-本期
//                lastNewCustsB:234,// 新开户总数-B类-上期
//                newCustsBSub:234,// 新开户总数-B类-差值
//                newCustsBCompare:234,// 新开户总数-B类-同环比
//                
//                newCostCusts:234,//新开有消耗客户-所有行业-本期
//                lastNewCostCusts:234,//新开有消耗客户-所有行业-上期
//                newCostCustsSub:234,//新开有消耗客户-所有行业-差值
//                newCostCustsCompare:234,//新开有消耗客户-所有行业-同环比
//                
//                newCostCustsCommon:234,// 新开有消耗客户-正常行业-本期
//                lastNewCostCustsCommon:234,// 新开有消耗客户-正常行业-上期
//                newCostCustsCommonSub:234,// 新开有消耗客户-正常行业-差值
//                newCostCustsCommonCompare:234,//新开有消耗客户-正常行业-同环比
//                
//                newCostCustsB:234,// 新开有消耗客户-B类-本期
//                lastNewCostCustsB:234,// 新开有消耗客户-B类-上期
//                newCostCustsBSub:234,// 新开有消耗客户-B类-差值
//                newCostCustsBCompare:234,// 新开有消耗客户-B类-同环比
//                
//                newNoCostCusts:234,//新开无消耗客户-所有行业-本期
//                lastNewNoCostCusts:234,//新开无消耗客户-所有行业-上期
//                newNoCostCustsSub:234,// 新开无消耗客户-所有行业-差值
//                newNoCostCustsCompare:234,// 新开无消耗客户-所有行业-
//                
//                
//                newNoCostCustsCommon:234,// 新开无消耗客户-正常行业-本期
//                lastNewNoCostCustsCommon:234,//新开无消耗客户-正常行业-
//                newNoCostCustsCommonSub:234,//新开无消耗客户-正常行业-
//                newNoCostCustsCommonCompare:234,//新开无消耗客户-正常行业
//                                                                      
//                
//                newNoCostCustsB:234,// 新开无消耗客户-B类-本期
//                lastNewNoCostCustsB:234,// 新开无消耗客户-B类-上期
//                newNoCostCustsBSub:234,// 新开无消耗客户-B类-差值
//                newNoCostCustsBCompare:234// 新开无消耗客户-B类-同环比
//              },
//              {    
//                  csName:'testuser8',
//                newCusts:234,//新开户总数-所有行业-本期
//                lastNewCusts:234,//新开户总数-所有行业-上期
//                newCustsSub:234,//新开户总数-所有行业-差值
//                newCustsCompare:234,//新开户总数-所有行业-同环比
//                
//                newCustsCommon:234,// 新开户总数-正常行业-本期
//                lastNewCustsCommon:234,// 新开户总数-正常行业-上期
//                newCustsCommonSub:234,// 新开户总数-正常行业-差值
//                newCustsCommonCompare:234,// 新开户总数-正常行业-同环比
//                
//                newCustsB:234,// 新开户总数-B类-本期
//                lastNewCustsB:234,// 新开户总数-B类-上期
//                newCustsBSub:234,// 新开户总数-B类-差值
//                newCustsBCompare:234,// 新开户总数-B类-同环比
//                
//                newCostCusts:234,//新开有消耗客户-所有行业-本期
//                lastNewCostCusts:234,//新开有消耗客户-所有行业-上期
//                newCostCustsSub:234,//新开有消耗客户-所有行业-差值
//                newCostCustsCompare:234,//新开有消耗客户-所有行业-同环比
//                
//                newCostCustsCommon:234,// 新开有消耗客户-正常行业-本期
//                lastNewCostCustsCommon:234,// 新开有消耗客户-正常行业-上期
//                newCostCustsCommonSub:234,// 新开有消耗客户-正常行业-差值
//                newCostCustsCommonCompare:234,//新开有消耗客户-正常行业-同环比
//                
//                newCostCustsB:234,// 新开有消耗客户-B类-本期
//                lastNewCostCustsB:234,// 新开有消耗客户-B类-上期
//                newCostCustsBSub:234,// 新开有消耗客户-B类-差值
//                newCostCustsBCompare:234,// 新开有消耗客户-B类-同环比
//                
//                newNoCostCusts:234,//新开无消耗客户-所有行业-本期
//                lastNewNoCostCusts:234,//新开无消耗客户-所有行业-上期
//                newNoCostCustsSub:234,// 新开无消耗客户-所有行业-差值
//                newNoCostCustsCompare:234,// 新开无消耗客户-所有行业-
//                
//                newNoCostCustsCommon:234,// 新开无消耗客户-正常行业-本期
//                lastNewNoCostCustsCommon:234,//新开无消耗客户-正常行业-
//                
//                newNoCostCustsCommonSub:234,//新开无消耗客户-正常行业-
//                
//                newNoCostCustsCommonCompare:234,//新开无消耗客户-正常行业
//                                                                      
//                
//                newNoCostCustsB:234,// 新开无消耗客户-B类-本期
//                lastNewNoCostCustsB:234,// 新开无消耗客户-B类-上期
//                newNoCostCustsBSub:234,// 新开无消耗客户-B类-差值
//                newNoCostCustsBCompare:234// 新开无消耗客户-B类-同环比
//              }
//        ]
//    };
//     me.lastAction = {method: method, args: args};
//     if (method == "CostStatAction.getAddCpcCostByCs") {
//         me.set({data: me.format1(data1)});
//     }
//     if (method == "CostStatAction.getAddCpcCostByCsCompare") {
//         me.set({data: me.format2(data2)});
//     }
//     if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByCs") {
//         me.set({data: me.format3(data3)});
//      }
//     if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByCsCompare") {
//         me.set({data: me.format4(data4)});
//      }
            
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
            val.csName = val.csName;
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
    
        data.sum.newCusts = Util.format.number(data.sum.newCusts);
        data.sum.newCusts = Util.format.number(data.sum.newCusts);
        data.sum.newCustsB = Util.format.number(data.sum.newCustsB);
        data.sum.newCustsCommon = Util.format.number(data.sum.newCustsCommon);
        
        data.sum.newCostCusts = Util.format.number(data.sum.newCostCusts);
        data.sum.newCostCustsCommon = Util.format.number(data.sum.newCostCustsCommon);
        data.sum.newCostCustsB = Util.format.number(data.sum.newCostCustsB);
        
        data.sum.newNoCostCusts = Util.format.number(data.sum.newNoCostCusts);
        data.sum.newNoCostCustsCommon = Util.format.number(data.sum.newNoCostCustsCommon);
        data.sum.newNoCostCustsB = Util.format.number(data.sum.newNoCostCustsB);
        
        $.each(data.data, function(index, val) {
           // val.opName = Util.format.toString(val.opName);
            val.csName=val.csName;
            val.newCusts = Util.format.number(val.newCusts);
            val.newCustsB = Util.format.number(val.newCustsB);
            val.newCustsCommon = Util.format.number(val.newCustsCommon);
            
            val.newCostCusts = Util.format.number(val.newCostCusts);
            val.newCostCustsCommon = Util.format.number(val.newCostCustsCommon);
            val.newCostCustsB = Util.format.number(val.newCostCustsB);
            
            val.newNoCostCusts = Util.format.number(val.newNoCostCusts);
            val.newNoCostCustsCommon = Util.format.number(val.newNoCostCustsCommon);
            val.newNoCostCustsB = Util.format.number(val.newNoCostCustsB);
        });
        return data;
    },
    
    format4: function(data) {
        data.sum.newCusts = Util.format.number(data.sum.newCusts);
        data.sum.lastNewCusts = Util.format.number(data.sum.lastNewCusts);
        data.sum.newCustsSub = Util.format.number(data.sum.newCustsSub);
        data.sum.newCustsCompare = Util.format.percent(data.sum.newCustsCompare);
        
        data.sum.newCustsCommon = Util.format.number(data.sum.newCustsCommon);
        data.sum.lastNewCustsCommon = Util.format.number(data.sum.lastNewCustsCommon);
        data.sum.newCustsCommonSub = Util.format.number(data.sum.newCustsCommonSub);
        data.sum.newCustsCommonCompare = Util.format.percent(data.sum.newCustsCommonCompare);
        
        data.sum.newCustsB = Util.format.number(data.sum.newCustsB);
        data.sum.lastNewCustsB = Util.format.number(data.sum.lastNewCustsB);
        data.sum.newCustsBSub = Util.format.number(data.sum.newCustsBSub);
        data.sum.newCustsBCompare = Util.format.percent(data.sum.newCustsBCompare);
        
        data.sum.newCostCusts = Util.format.number(data.sum.newCostCusts);
        data.sum.lastNewCostCusts = Util.format.number(data.sum.lastNewCostCusts);
        data.sum.newCostCustsSub = Util.format.number(data.sum.newCostCustsSub);
        data.sum.newCostCustsCompare = Util.format.percent(data.sum.newCostCustsCompare);
        
        data.sum.newCostCustsCommon = Util.format.number(data.sum.newCostCustsCommon);
        data.sum.lastNewCostCustsCommon = Util.format.number(data.sum.lastNewCostCustsCommon);
        data.sum.newCostCustsCommonSub = Util.format.number(data.sum.newCostCustsCommonSub);
        data.sum.newCostCustsCommonCompare = Util.format.percent(data.sum.newCostCustsCommonCompare);
        
        data.sum.newCostCustsB = Util.format.number(data.sum.newCostCustsB);
        data.sum.lastNewCostCustsB = Util.format.number(data.sum.lastNewCostCustsB);
        data.sum.newCostCustsBSub = Util.format.number(data.sum.newCostCustsBSub);
        data.sum.newCostCustsBCompare = Util.format.percent(data.sum.newCostCustsBCompare);
        
        data.sum.newNoCostCusts = Util.format.number(data.sum.newNoCostCusts);
        data.sum.lastNewNoCostCusts = Util.format.number(data.sum.lastNewNoCostCusts);
        data.sum.newNoCostCustsSub = Util.format.number(data.sum.newNoCostCustsSub);
        data.sum.newNoCostCustsCompare = Util.format.percent(data.sum.newNoCostCustsCompare);
        
        data.sum.newNoCostCustsCommon = Util.format.number(data.sum.newNoCostCustsCommon);
        data.sum.lastNewNoCostCustsCommon = Util.format.number(data.sum.lastNewNoCostCustsCommon);
        data.sum.newNoCostCustsCommonSub = Util.format.number(data.sum.newNoCostCustsCommonSub);
        data.sum.newNoCostCustsCommonCompare = Util.format.percent(data.sum.newNoCostCustsCommonCompare);

        data.sum.newNoCostCustsB = Util.format.number(data.sum.newNoCostCustsB);
        data.sum.lastNewNoCostCustsB = Util.format.number(data.sum.lastNewNoCostCustsB);
        data.sum.newNoCostCustsBSub = Util.format.number(data.sum.newNoCostCustsBSub);
        data.sum.newNoCostCustsBCompare = Util.format.percent(data.sum.newNoCostCustsBCompare);
        
        $.each(data.data, function(index, val) {
           // val.opName = Util.format.toString(val.opName);
            val.csName=val.csName;
            val.newCusts = Util.format.number(val.newCusts);
            val.lastNewCusts = Util.format.number(val.lastNewCusts);
            val.newCustsSub = Util.format.number(val.newCustsSub);
            val.newCustsCompare = Util.format.percent(val.newCustsCompare);
            
            val.newCustsCommon = Util.format.number(val.newCustsCommon);
            val.lastNewCustsCommon = Util.format.number(val.lastNewCustsCommon);
            val.newCustsCommonSub = Util.format.number(val.newCustsCommonSub);
            val.newCustsCommonCompare = Util.format.percent(val.newCustsCommonCompare);
            
            val.newCustsB = Util.format.number(val.newCustsB);
            val.lastNewCustsB = Util.format.number(val.lastNewCustsB);
            val.newCustsBSub = Util.format.number(val.newCustsBSub);
            val.newCustsBCompare = Util.format.percent(val.newCustsBCompare);
            
            val.newCostCusts = Util.format.number(val.newCostCusts);
            val.lastNewCostCusts = Util.format.number(val.lastNewCostCusts);
            val.newCostCustsSub = Util.format.number(val.newCostCustsSub);
            val.newCostCustsCompare = Util.format.percent(val.newCostCustsCompare);
            
            val.newCostCustsCommon = Util.format.number(val.newCostCustsCommon);
            val.lastNewCostCustsCommon = Util.format.number(val.lastNewCostCustsCommon);
            val.newCostCustsCommonSub = Util.format.number(val.newCostCustsCommonSub);
            val.newCostCustsCommonCompare = Util.format.percent(val.newCostCustsCommonCompare);
            
            val.newCostCustsB = Util.format.number(val.newCostCustsB);
            val.lastNewCostCustsB = Util.format.number(val.lastNewCostCustsB);
            val.newCostCustsBSub = Util.format.number(val.newCostCustsBSub);
            val.newCostCustsBCompare = Util.format.percent(val.newCostCustsBCompare);
            
            val.newNoCostCusts = Util.format.number(val.newNoCostCusts);
            val.lastNewNoCostCusts = Util.format.number(val.lastNewNoCostCusts);
            val.newNoCostCustsSub = Util.format.number(val.newNoCostCustsSub);
            val.newNoCostCustsCompare = Util.format.percent(val.newNoCostCustsCompare);
            
            val.newNoCostCustsCommon = Util.format.number(val.newNoCostCustsCommon);
            val.lastNewNoCostCustsCommon = Util.format.number(val.lastNewNoCostCustsCommon);
            val.newNoCostCustsCommonSub = Util.format.number(val.newNoCostCustsCommonSub);
            val.newNoCostCustsCommonCompare = Util.format.percent(val.newNoCostCustsCommonCompare);
    
            val.newNoCostCustsB = Util.format.number(val.newNoCostCustsB);
            val.lastNewNoCostCustsB = Util.format.number(val.lastNewNoCostCustsB);
            val.newNoCostCustsBSub = Util.format.number(val.newNoCostCustsBSub);
            val.newNoCostCustsBCompare = Util.format.percent(val.newNoCostCustsBCompare);
        });
        return data;
    }
    
});