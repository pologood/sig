/*
 * Agent Model - IncrementSales 
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.IncrementSales = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    initialize: function() {},
    
    lastAction: null,
    
    getData: function(method, args) {
        var me = this;
        me.set({data : null}, {silent : true});
        me.lastAction = {method: method, args: args};
        
        dwr.request.run({
            method: method,
            args: [args],
            success: function(data) {
                me.lastAction = {method: method, args: args};
                if (data.data == null || data.data.length == 0) {
                    data.data = [];
                    me.set({data: data});
                } else {
                    if (method == "NewCustomerStatAction.getNewCustomerStatByOp") {
                        me.set({data: me.format1(data)});
                    }
                    if (method == "NewCustomerStatAction.getNewCustomerStatByOpCompare") {
                        me.set({data: me.format2(data)});
                    }
                    if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByOp") {
                        me.set({data: me.format3(data)});
                    }
                    if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByOpCompare") {
                        me.set({data: me.format4(data)});
                    }
                }
            }
        });
                    
//    var data1={    
//    sum: {
//            newCusts:678,//新开户数-总体
//            newCustsEffect:678,//新开户数-有效开户数
//            newCustsB:678,//新开户数-无效开户数-特殊行业
//            newCustsCommon:678,//新开户数-无效开户数-其它
//
//            newInvest:678,//所有行业-新开入资
//            newInvestCommon:678, //正常行业-新开入资
//            newInvestB:678,//特殊行业-新开入资
//            
//            newInvestPerCust:678,//所有行业-户均新开入资
//            newInvestPerCustCommon:678,//正常行业-户均新开入资
//            newInvestPerCustB:678//特殊行业-户均新开入资
//
//        },
//        data:[
//              {    
//                  opName:'testuser',
//                newCusts:678,//新开户数-总体
//                newCustsEffect:678,//新开户数-有效开户数
//                newCustsB:678,//新开户数-无效开户数-特殊行业
//                newCustsCommon:678,//新开户数-无效开户数-其它
//    
//                newInvest:678,//所有行业-新开入资
//                newInvestCommon:678, //正常行业-新开入资
//                newInvestB:678,//特殊行业-新开入资
//                
//                newInvestPerCust:678,//所有行业-户均新开入资
//                newInvestPerCustCommon:678,//正常行业-户均新开入资
//                newInvestPerCustB:678//特殊行业-户均新开入资
//              },
//              {    
//                  opName:'testuser1',
//                newCusts:678,//新开户数-总体
//                newCustsEffect:678,//新开户数-有效开户数
//                newCustsB:678,//新开户数-无效开户数-特殊行业
//                newCustsCommon:678,//新开户数-无效开户数-其它
//    
//                newInvest:678,//所有行业-新开入资
//                newInvestCommon:678, //正常行业-新开入资
//                newInvestB:678,//特殊行业-新开入资
//                
//                newInvestPerCust:678,//所有行业-户均新开入资
//                newInvestPerCustCommon:678,//正常行业-户均新开入资
//                newInvestPerCustB:678//特殊行业-户均新开入资
//              }
//        ]
//    };
//    var data2={
//                sum:{
//                newCusts:232,//新开户数-总体-本期
//                lastNewCusts:232,//新开户数-总体-上期
//                newCustsSub:232,//新开户数-总体-差值
//                newCustsCompare:232,//新开户数-总体-同环比
//        
//                newCustsEffect:232,//新开户数-有效开户数-本期
//                lastNewCustsEffect:232,//新开户数-有效开户数-上期
//                newCustsEffectSub:232,//新开户数-有效开户数-差值
//                newCustsEffectCompare:232,//新开户数-有效开户数-同环比
//        
//                newCustsB:232,//新开户数-无效开户数-特殊行业-本期
//                lastNewCustsB:232,//新开户数-无效开户数-特殊行业-上期
//                newCustsBSub:232,//新开户数-无效开户数-特殊行业-差值
//                newCustsBCompare:232,//新开户数-无效开户数-特殊行业-同环比
//        
//                newCustsCommon:232,//新开户数-无效开户数-其它-本期
//                lastNewCustsCommon:232,//新开户数-无效开户数-其它-上期
//                newCustsCommonSub:232,//新开户数-无效开户数-其它-差值
//                newCustsCommonCompare:232,//新开户数-无效开户数-其它-同环比
//        
//                newInvest:232,//所有行业-新开入资-本期
//                lastNewInvest:232,//所有行业-新开入资-上期
//                newInvestSub:232,//所有行业-新开入资-差值
//                newInvestCompare:232,//所有行业-新开入资-同环比
//        
//                newInvestCommon:232,//正常行业新开入资-本期
//                lastNewInvestCommon:232,//正常行业新开入资-上期
//                newInvestCommonSub:232,//正常行业新开入资-差值
//                newInvestCommonCompare:232,//正常行业新开入资-同环比
//        
//                newInvestB:232,//特殊行业新开入资-本期
//                lastNewInvestB:232,//特殊行业新开入资-上期
//                newInvestBSub:232,//特殊行业新开入资-差值
//                newInvestBCompare:232,//特殊行业新开入资-同环比
//        
//                newInvestPerCust:232,//所有行业-户均新开入资-本期
//                lastNewInvestPerCust:232,//所有行业-户均新开入资-上期
//                newInvestPerCustSub:232,//所有行业-户均新开入资-差值
//                newInvestPerCustCompare:232,//所有行业-户均新开入资-同环比
//        
//                newInvestPerCustCommon:232,//正常行业-户均新开入资-本期
//                lastNewInvestPerCustCommon:232,//正常行业-户均新开入资-上期
//                newInvestPerCustCommonSub:232,//正常行业-户均新开入资-差值
//                newInvestPerCustBCompare:232,//正常行业-户均新开入资-同环比
//        
//                newInvestPerCustB:232,//特殊行业-户均新开入资-本期
//                lastNewInvestPerCustB:232,//特殊行业-户均新开入资-上期
//                newInvestPerCustBSub:232,//特殊行业-户均新开入资-差值
//                newInvestPerCustBCompare:232//特殊行业-户均新开入资-同环比
//            },
//            data:[
//            {
//                opName:'userOp',
//                newCusts:232,//新开户数-总体-本期
//                lastNewCusts:232,//新开户数-总体-上期
//                newCustsSub:232,//新开户数-总体-差值
//                newCustsCompare:232,//新开户数-总体-同环比
//        
//                newCustsEffect:232,//新开户数-有效开户数-本期
//                lastNewCustsEffect:232,//新开户数-有效开户数-上期
//                newCustsEffectSub:232,//新开户数-有效开户数-差值
//                newCustsEffectCompare:232,//新开户数-有效开户数-同环比
//        
//                newCustsB:232,//新开户数-无效开户数-特殊行业-本期
//                lastNewCustsB:232,//新开户数-无效开户数-特殊行业-上期
//                newCustsBSub:232,//新开户数-无效开户数-特殊行业-差值
//                newCustsBCompare:232,//新开户数-无效开户数-特殊行业-同环比
//        
//                newCustsCommon:232,//新开户数-无效开户数-其它-本期
//                lastNewCustsCommon:232,//新开户数-无效开户数-其它-上期
//                newCustsCommonSub:232,//新开户数-无效开户数-其它-差值
//                newCustsCommonCompare:232,//新开户数-无效开户数-其它-同环比
//        
//                newInvest:232,//所有行业-新开入资-本期
//                lastNewInvest:232,//所有行业-新开入资-上期
//                newInvestSub:232,//所有行业-新开入资-差值
//                newInvestCompare:232,//所有行业-新开入资-同环比
//        
//                newInvestCommon:232,//正常行业新开入资-本期
//                lastNewInvestCommon:232,//正常行业新开入资-上期
//                newInvestCommonSub:232,//正常行业新开入资-差值
//                newInvestCommonCompare:232,//正常行业新开入资-同环比
//        
//                newInvestB:232,//特殊行业新开入资-本期
//                lastNewInvestB:232,//特殊行业新开入资-上期
//                newInvestBSub:232,//特殊行业新开入资-差值
//                newInvestBCompare:232,//特殊行业新开入资-同环比
//        
//                newInvestPerCust:232,//所有行业-户均新开入资-本期
//                lastNewInvestPerCust:232,//所有行业-户均新开入资-上期
//                newInvestPerCustSub:232,//所有行业-户均新开入资-差值
//                newInvestPerCustCompare:232,//所有行业-户均新开入资-同环比
//        
//                newInvestPerCustCommon:232,//正常行业-户均新开入资-本期
//                lastNewInvestPerCustCommon:232,//正常行业-户均新开入资-上期
//                newInvestPerCustCommonSub:232,//正常行业-户均新开入资-差值
//                newInvestPerCustBCompare:232,//正常行业-户均新开入资-同环比
//        
//                newInvestPerCustB:232,//特殊行业-户均新开入资-本期
//                lastNewInvestPerCustB:232,//特殊行业-户均新开入资-上期
//                newInvestPerCustBSub:232,//特殊行业-户均新开入资-差值
//                newInvestPerCustBCompare:232//特殊行业-户均新开入资-同环比
//            },
//            {
//                opName:'userOp1',
//                newCusts:232,//新开户数-总体-本期
//                lastNewCusts:232,//新开户数-总体-上期
//                newCustsSub:232,//新开户数-总体-差值
//                newCustsCompare:232,//新开户数-总体-同环比
//        
//                newCustsEffect:232,//新开户数-有效开户数-本期
//                lastNewCustsEffect:232,//新开户数-有效开户数-上期
//                newCustsEffectSub:232,//新开户数-有效开户数-差值
//                newCustsEffectCompare:232,//新开户数-有效开户数-同环比
//        
//                newCustsB:232,//新开户数-无效开户数-特殊行业-本期
//                lastNewCustsB:232,//新开户数-无效开户数-特殊行业-上期
//                newCustsBSub:232,//新开户数-无效开户数-特殊行业-差值
//                newCustsBCompare:232,//新开户数-无效开户数-特殊行业-同环比
//        
//                newCustsCommon:232,//新开户数-无效开户数-其它-本期
//                lastNewCustsCommon:232,//新开户数-无效开户数-其它-上期
//                newCustsCommonSub:232,//新开户数-无效开户数-其它-差值
//                newCustsCommonCompare:232,//新开户数-无效开户数-其它-同环比
//        
//                newInvest:232,//所有行业-新开入资-本期
//                lastNewInvest:232,//所有行业-新开入资-上期
//                newInvestSub:232,//所有行业-新开入资-差值
//                newInvestCompare:232,//所有行业-新开入资-同环比
//        
//                newInvestCommon:232,//正常行业新开入资-本期
//                lastNewInvestCommon:232,//正常行业新开入资-上期
//                newInvestCommonSub:232,//正常行业新开入资-差值
//                newInvestCommonCompare:232,//正常行业新开入资-同环比
//        
//                newInvestB:232,//特殊行业新开入资-本期
//                lastNewInvestB:232,//特殊行业新开入资-上期
//                newInvestBSub:232,//特殊行业新开入资-差值
//                newInvestBCompare:232,//特殊行业新开入资-同环比
//        
//                newInvestPerCust:232,//所有行业-户均新开入资-本期
//                lastNewInvestPerCust:232,//所有行业-户均新开入资-上期
//                newInvestPerCustSub:232,//所有行业-户均新开入资-差值
//                newInvestPerCustCompare:232,//所有行业-户均新开入资-同环比
//        
//                newInvestPerCustCommon:232,//正常行业-户均新开入资-本期
//                lastNewInvestPerCustCommon:232,//正常行业-户均新开入资-上期
//                newInvestPerCustCommonSub:232,//正常行业-户均新开入资-差值
//                newInvestPerCustBCompare:232,//正常行业-户均新开入资-同环比
//        
//                newInvestPerCustB:232,//特殊行业-户均新开入资-本期
//                lastNewInvestPerCustB:232,//特殊行业-户均新开入资-上期
//                newInvestPerCustBSub:232,//特殊行业-户均新开入资-差值
//                newInvestPerCustBCompare:232//特殊行业-户均新开入资-同环比
//            }
//            ]
//    };
//    var data3={    
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
//                  opName:'testuser',
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
//                  opName:'testuser1',
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
//                  opName:'testuser2',
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
//              },
//              {    
//                  opName:'testuser4',
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
//    if (method == "NewCustomerStatAction.getNewCustomerStatByOp") {
//            me.set({data: me.format1(data1)});
//        }
//    if (method == "NewCustomerStatAction.getNewCustomerStatByOpCompare") {
//            me.set({data: me.format2(data2)});
//        }
//   if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByOp") {
//            me.set({data: me.format3(data3)});
//       }
//   if (method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByOpCompare") {
//              me.set({data: me.format4(data4)});
//      }
    },
    format1: function(data) {
        data.sum.newCusts = Util.format.number(data.sum.newCusts);
        data.sum.newCustsEffect = Util.format.number(data.sum.newCustsEffect);
        data.sum.newCustsB = Util.format.number(data.sum.newCustsB);
        data.sum.newCustsCommon = Util.format.number(data.sum.newCustsCommon);
        
        data.sum.newInvest = Util.format.money(data.sum.newInvest);
        data.sum.newInvestCommon = Util.format.money(data.sum.newInvestCommon);
        data.sum.newInvestB = Util.format.money(data.sum.newInvestB);
        
        data.sum.newInvestPerCust = Util.format.money(data.sum.newInvestPerCust);
        data.sum.newInvestPerCustCommon = Util.format.money(data.sum.newInvestPerCustCommon);
        data.sum.newInvestPerCustB = Util.format.money(data.sum.newInvestPerCustB);
        
        
        $.each(data.data, function(index, val) {
            //val.opName = Util.format.toString(val.opName);
            val.opName=val.opName;
            val.newCusts = Util.format.number(val.newCusts);
            val.newCustsEffect = Util.format.number(val.newCustsEffect);
            val.newCustsB = Util.format.number(val.newCustsB);
            val.newCustsCommon = Util.format.number(val.newCustsCommon);
        
            val.newInvest = Util.format.money(val.newInvest);
            val.newInvestCommon = Util.format.money(val.newInvestCommon);
            val.newInvestB = Util.format.money(val.newInvestB);
        
            val.newInvestPerCust = Util.format.money(val.newInvestPerCust);
            val.newInvestPerCustCommon = Util.format.money(val.newInvestPerCustCommon);
            val.newInvestPerCustB = Util.format.money(val.newInvestPerCustB);
        });
        return data;
    },
    
    format2: function(data) {
    
        data.sum.newCusts = Util.format.number(data.sum.newCusts);
        data.sum.lastNewCusts = Util.format.number(data.sum.lastNewCusts);
        data.sum.newCustsSub = Util.format.number(data.sum.newCustsSub);
        data.sum.newCustsCompare = Util.format.percent(data.sum.newCustsCompare);
        
        data.sum.newCustsEffect = Util.format.number(data.sum.newCustsEffect);
        data.sum.lastNewCustsEffect = Util.format.number(data.sum.lastNewCustsEffect);
        data.sum.newCustsEffectSub = Util.format.number(data.sum.newCustsEffectSub);
        data.sum.newCustsEffectCompare = Util.format.percent(data.sum.newCustsEffectCompare);
        
        data.sum.newCustsB = Util.format.number(data.sum.newCustsB);
        data.sum.lastNewCustsB = Util.format.number(data.sum.lastNewCustsB);
        data.sum.newCustsBSub = Util.format.number(data.sum.newCustsBSub);
        data.sum.newCustsBCompare = Util.format.percent(data.sum.newCustsBCompare);

        data.sum.newCustsCommon = Util.format.number(data.sum.newCustsCommon);
        data.sum.lastNewCustsCommon = Util.format.number(data.sum.lastNewCustsCommon);
        data.sum.newCustsCommonSub = Util.format.number(data.sum.newCustsCommonSub);
        data.sum.newCustsCommonCompare = Util.format.percent(data.sum.newCustsCommonCompare);
        
        data.sum.newInvest = Util.format.money(data.sum.newInvest);
        data.sum.lastNewInvest = Util.format.money(data.sum.lastNewInvest);
        data.sum.newInvestSub = Util.format.money(data.sum.newInvestSub);
        data.sum.newInvestCompare = Util.format.percent(data.sum.newInvestCompare);
        
        data.sum.newInvestCommon = Util.format.money(data.sum.newInvestCommon);
        data.sum.lastNewInvestCommon = Util.format.money(data.sum.lastNewInvestCommon);
        data.sum.newInvestCommonSub = Util.format.money(data.sum.newInvestCommonSub);
        data.sum.newInvestCommonCompare = Util.format.percent(data.sum.newInvestCommonCompare);
        
        data.sum.newInvestB = Util.format.money(data.sum.newInvestB);
        data.sum.lastNewInvestB = Util.format.money(data.sum.lastNewInvestB);
        data.sum.newInvestBSub = Util.format.money(data.sum.newInvestBSub);
        data.sum.newInvestBCompare = Util.format.percent(data.sum.newInvestBCompare);
        
        data.sum.newInvestPerCust = Util.format.money(data.sum.newInvestPerCust);
        data.sum.lastNewInvestPerCust = Util.format.money(data.sum.lastNewInvestPerCust);
        data.sum.newInvestPerCustSub = Util.format.money(data.sum.newInvestPerCustSub);
        data.sum.newInvestPerCustCompare = Util.format.percent(data.sum.newInvestPerCustCompare);
        
        data.sum.newInvestPerCustCommon = Util.format.money(data.sum.newInvestPerCustCommon);
        data.sum.lastNewInvestPerCustCommon = Util.format.money(data.sum.lastNewInvestPerCustCommon);
        data.sum.newInvestPerCustCommonSub = Util.format.money(data.sum.newInvestPerCustCommonSub);
        data.sum.newInvestPerCustCommonCompare = Util.format.percent(data.sum.newInvestPerCustCommonCompare);
        
        data.sum.newInvestPerCustB = Util.format.money(data.sum.newInvestPerCustB);
        data.sum.lastNewInvestPerCustB = Util.format.money(data.sum.lastNewInvestPerCustB);
        data.sum.newInvestPerCustBSub = Util.format.money(data.sum.newInvestPerCustBSub);
        data.sum.newInvestPerCustBCompare = Util.format.percent(data.sum.newInvestPerCustBCompare);
        
        $.each(data.data, function(index, val) {
           //val.opName = Util.format.toString(val.opName);
           val.opName=val.opName;
        val.newCusts = Util.format.number(val.newCusts);
        val.lastNewCusts = Util.format.number(val.lastNewCusts);
        val.newCustsSub = Util.format.number(val.newCustsSub);
        val.newCustsCompare = Util.format.percent(val.newCustsCompare);
        
        val.newCustsEffect = Util.format.number(val.newCustsEffect);
        val.lastNewCustsEffect = Util.format.number(val.lastNewCustsEffect);
        val.newCustsEffectSub = Util.format.number(val.newCustsEffectSub);
        val.newCustsEffectCompare = Util.format.percent(val.newCustsEffectCompare);
        
        val.newCustsB = Util.format.number(val.newCustsB);
        val.lastNewCustsB = Util.format.number(val.lastNewCustsB);
        val.newCustsBSub = Util.format.number(val.newCustsBSub);
        val.newCustsBCompare = Util.format.percent(val.newCustsBCompare);

        val.newCustsCommon = Util.format.number(val.newCustsCommon);
        val.lastNewCustsCommon = Util.format.number(val.lastNewCustsCommon);
        val.newCustsCommonSub = Util.format.number(val.newCustsCommonSub);
        val.newCustsCommonCompare = Util.format.percent(val.newCustsCommonCompare);
        
        val.newInvest = Util.format.money(val.newInvest);
        val.lastNewInvest = Util.format.money(val.lastNewInvest);
        val.newInvestSub = Util.format.money(val.newInvestSub);
        val.newInvestCompare = Util.format.percent(val.newInvestCompare);
        
        val.newInvestCommon = Util.format.money(val.newInvestCommon);
        val.lastNewInvestCommon = Util.format.money(val.lastNewInvestCommon);
        val.newInvestCommonSub = Util.format.money(val.newInvestCommonSub);
        val.newInvestCommonCompare = Util.format.percent(val.newInvestCommonCompare);
        
        val.newInvestB = Util.format.money(val.newInvestB);
        val.lastNewInvestB = Util.format.money(val.lastNewInvestB);
        val.newInvestBSub = Util.format.money(val.newInvestBSub);
        val.newInvestBCompare = Util.format.percent(val.newInvestBCompare);
        
        val.newInvestPerCust = Util.format.money(val.newInvestPerCust);
        val.lastNewInvestPerCust = Util.format.money(val.lastNewInvestPerCust);
        val.newInvestPerCustSub = Util.format.money(val.newInvestPerCustSub);
        val.newInvestPerCustCompare = Util.format.percent(val.newInvestPerCustCompare);
        
        val.newInvestPerCustCommon = Util.format.money(val.newInvestPerCustCommon);
        val.lastNewInvestPerCustCommon = Util.format.money(val.lastNewInvestPerCustCommon);
        val.newInvestPerCustCommonSub = Util.format.money(val.newInvestPerCustCommonSub);
        val.newInvestPerCustCommonCompare = Util.format.percent(val.newInvestPerCustCommonCompare);
        
        val.newInvestPerCustB = Util.format.money(val.newInvestPerCustB);
        val.lastNewInvestPerCustB = Util.format.money(val.lastNewInvestPerCustB);
        val.newInvestPerCustBSub = Util.format.money(val.newInvestPerCustBSub);
        val.newInvestPerCustBCompare = Util.format.percent(val.newInvestPerCustBCompare);
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
            val.opName=val.opName;
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
            val.opName=val.opName;
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