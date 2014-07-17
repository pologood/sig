/*
 * Agent Model - ConsumeRealtimeCust 
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Models.ConsumeRealtimeCust = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    initialize: function() {},
    
    lastAction: null,
    
    getData: function(args) {
        var me = this;
        var method="CustCurrentCostAction.getCurrentCosts";
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
                    me.set({data: me.format1(data)});
                }
            }
        });
    },
    
    format1: function(data) {
        var today = new Date().getTime(),
            openDay = Util.date.CONSUME_REALTIME_WEEK_CONTRAST_OPEN.getTime();
        
        var sum = data.sum;
        sum.currentCost = Util.format.money(sum.currentCost);
        sum.balance = Util.format.money(sum.balance);
        sum.currentQoQSub = sum.currentQoQSub > 0
                           ? "+" + Util.format.money(sum.currentQoQSub)
                           : Util.format.money(sum.currentQoQSub);
        sum.currentQoQ = Util.format.percent(sum.currentQoQ);
        if (openDay < today) {
            sum.currentYoYSub = sum.currentYoYSub > 0
                              ? "+" + Util.format.money(sum.currentYoYSub)
                              : Util.format.money(sum.currentYoYSub)
            sum.currentYoY = Util.format.percent(sum.currentYoY);
        } else {
            sum.currentYoYSub = " -";
            sum.currentYoY = "-";
        }
        
        $.each(data.data, function(index, val) {
        	val.id=val.id;  //客户id
            val.account=val.account; //客户对应的账户
            val.name=val.name; //客户名称
            val.relatedESQName=val.relatedESQName; //关联客服
            val.currentCost=Util.format.money(val.currentCost);//当前实时消耗
            val.currentQoQSub=(val.currentQoQSub>0)?("+"+Util.format.money(val.currentQoQSub)):
            				Util.format.money(val.currentQoQSub);//环比差值
            val.currentQoQ=Util.format.percent(val.currentQoQ);//环比(%)
            
            if(openDay < today){
           		val.currentYoYSub=
           			(val.currentYoYSub>0)?("+"+Util.format.money(val.currentYoYSub)):
           			Util.format.money(val.currentYoYSub);//周同比差值
            	val.currentYoY=Util.format.percent(val.currentYoY);//周同比(%)
            }else{
            	val.currentYoYSub=" -";
            	val.currentYoY="-";
            }

            val.balance=Util.format.money(val.balance);//账户余额
        });
        
        return data;
    }
    
});