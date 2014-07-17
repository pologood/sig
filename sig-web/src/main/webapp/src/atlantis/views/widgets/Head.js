/*
 * Agent View - Head
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.Head = Backbone.View.extend({
    el: $("#Head"),
    
    initialize: function() {
        this.render();
    },
    
    render: function() {
        this.$el.mustache("tpl-head", {
            username: $("#UserName").val()
        });
        
        //分时问候
        if (!T.ie || T.ie > 8) {
            var greeting = Util.date.getGreedings();
            this.$el.append($.Mustache.render("tpl-greetings", {
                icon: greeting.icon,
                text: greeting.text
            }));
            setTimeout(function() {
                $("#Greeting").hide(200);
            }, 5000);
        }
        
        //代管用户无退出
        if ($("#Delegate").val() == "true") {
            this.$(".logout").remove();
        }
        
        //搜狗兼容提示
        if (Util.isSeCompatible) {
            this.$el.before($.Mustache.render("tpl-se-tip"));
        }
    }
});
