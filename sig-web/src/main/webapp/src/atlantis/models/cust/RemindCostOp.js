/*
 * Atlantis Model - RemindCostOp
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.RemindCostOp = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        Util.ajax.run({
            url: "/s/negativeOperationSummary",
            data: args,
            success: function(response) {
                if (response.data.length == 0) {
                    response.rowCount = 0;
                }
                me.set({data: me.format(response)});
            }
        });
    },
    
    format: function(response) {
        var me = this;
        me.total = 0;
        $.each(response.data, function(index, val) {
            me.total++;
            val.custCount = Util.format.number(val.custCount);
            val.opCount = Util.format.number(val.opCount);
            $.each(val.detail, function(index2, val2) {
                me.total++;
                val2.custCount = Util.format.number(val2.custCount);
                val2.opCount = Util.format.number(val2.opCount);
            });
        });
        
        return response;
    }
});
