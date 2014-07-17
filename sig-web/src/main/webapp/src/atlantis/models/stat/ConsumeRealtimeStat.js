/*
 * Atlantis Model - ConsumeRealtimeStat 
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.ConsumeRealtimeStat = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    initialize: function() {},
    
    lastAction: null,
    
    getData: function(args) {
        var me = this;
        var method="CustCurrentCostAction.getCurrentCostPerHour";
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
//    	cust_id:xxx,//客户id
//    	s_time:xxx,//消耗时段时间
//    	todayCost:xxx,//今日消耗
//    	yesterdayCost:xxx//昨日同期消耗
//    	lastWeekDayCost:xxx //上周同期消耗 
//    	acctStatus:xxx,//账户状态 1：账户无余额 2：账户/计划撞线 3：关键词展现较低 4：有计划不在投放时段
    	
//    	for(var i=0;i<data.data.length;i++){
//        	if(data.data[i].todayCost==null){
//        		data.data.splice(i,i);
//        		i--;
//        	}
//    	}
    	
        $.each(data.data, function(index, val) {
//            val.cust_id = Util.format.number(val.cust_id);
            //val.s_time = Util.format.number(val.s_time);
            val.todayCost = val.todayCost==null?0:val.todayCost;
            val.yesterdayCost = val.yesterdayCost==null?0:val.yesterdayCost;
            val.lastWeekDayCost = val.lastWeekDayCost==null?0:val.lastWeekDayCost;
        	switch(val.acctStatus){
        	case null:val.acctStatus=0;break;
            case 1:val.acctStatus="旭日无余额";break;
            case 2:val.acctStatus="账户/计划撞线";break;
            case 3:val.acctStatus="关键词展现较低";break;
            case 4:val.acctStatus="有计划不在投放时段";break;
        	}
        });
        
        return data;
    }
    
});