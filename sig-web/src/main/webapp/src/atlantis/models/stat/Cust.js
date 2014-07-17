/*
 * Agent Model - Cust
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.Cust = Backbone.Model.extend({
    defaults: {
        data: null,
        trade: null
    },
    
    initialize: function() {},
    
    lastAction: null,
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        dwr.request.run({
            method: "CustomerInfoAction.getCustomerInfo",
            args: [args],
            success: function(data) {
                me.lastAction = {args: args};
                if (data.data == null || data.data.length == 0) {
                    data.data = [];
                }
                me.set({data: me.format(data)});
            }
        });
    },
    
    format: function(data) {
        $.each(data.data, function(index, val) {
            val.registerDate = Util.date.toString(val.registerDate);
        });
        
        return data;
    },
    
    getTrade: function() {
        var me = this;
        dwr.request.run({
            method: "TradeAction.getTrades",
            args: [],
            success: function(data) {
                me.set({trade: data.data});
            }
        });
        /*var trade = [
            {
                code:'1101',
                name:'机械',
                secondTrades: 
                [
                    {code:'1201', name:'汽车'},
                    {code:'1202', name:'船舶'}
                ]
            },
            {
                code:'2101',
                name:'食品',
                secondTrades: 
                [
                    {code:'2201', name:'牛奶'},
                    {code:'2202', name:'面包'}
                ]
            }
        ];
        me.set({trade: trade});*/
    }
});