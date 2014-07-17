/*
 * Agent Model - 客户中心
 * @author : liangxiao
 * @date   : 2013
 */

Agent.Models.AccountCenter = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        dwr.request.run({
            method: "CustomerCenterAction.queryCustomerList",
            args: [args],
            success: function(response) {
                me.set({data: response.rowCount == 0 ? response : me.format(response)});
            },
            mock: false,
            mockTime: 100,
            mockData: {
                success: true,
                errorMsg: "errorMsg",
                rowCount: 100,
                data: [
                    {
                        customerName: "customerName",
                        customerId: 123,
                        customerEmail: "customerEmail@sogou-inc.com",
                        customerService: "customerService",
                        customerSell: "customerSell",
                        firstTrade: "firstTrade",
                        secondTrade: "secondTrade",
                        registerDate: "2013-01-01",
                        productType: "竞价",
                        customerStatus: "暂停",
                        costTotal: 123.456,
                        customerRemain: 123.456,
                        expectedDays: 1000,
                        yesterdayCost: 123.456,
                        latelySevenDayCost: 123.456,
                        latelyUpdateTime: "2013-07-01 12:00"
                    }
                ]
            }
        });
    },
    
    format: function(response) {
        $.each(response.data, function(index, val) {
            val.costTotal = Util.format.money(val.costTotal);
            val.customerRemain = Util.format.money(val.customerRemain);
            val.expectedDays = Util.format.number(val.expectedDays);
            val.yesterdayCost = Util.format.money(val.yesterdayCost);
            val.latelySevenDayCost = Util.format.money(val.latelySevenDayCost);
            val.latelyUpdateTime = Util.format.string(val.latelyUpdateTime);
            val.firstTrade = Util.format.string(val.firstTrade);
            val.secondTrade = Util.format.string(val.secondTrade);
        });
        return response;
    }
});
