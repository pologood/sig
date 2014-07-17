/*
 * Panel基类
 * @author : liangxiao
 * @date   : 2013
 */

Agent.Views.Panel.Base = Backbone.View.extend({
    events: {},
    
    init: function(args) {},
    
    destroyCtrl: function() {},
    
    initialize: function() {
        this.init(arguments[0]); //parent view 传递的参数
        
        //滚动时隐藏所有控件浮层, Backbone不支持scroll事件绑定
        this.$(".body").scroll(function() {
            $(".body").click();
        });
        
        this.showPanel();
    },
    
    showPanel: function() {
        if (!this.level2) {
            window.scroll(0, 0);
            $("body").css({overflow: "hidden"});
            if (T.ie <= 7) {
                $("body").css({position: "relative"});
            }
        }
        this.mask.show();
        this.panel.show();
        var me = this;
        this.panel.addClass("slide-panel-show", 200, function() {
            me.afterShow && me.afterShow();
        });
    },
    
    hidePanel: function() {
        var me = this;
        this.panel.removeClass("slide-panel-show", 200, function() {
            me.panel.hide();
            me.mask.hide();
            if (!me.level2) {
                $("body").css({overflow: "visible"});
                if (T.ie <= 7) {
                    $("body").css({position: "static"});
                }
            }
            //destroy
            me.destroyCtrl();
            me.$(".body").unbind();
            me.$el.unbind();
            me.$el.html("");
            me.$el.remove();
        });
    },
    
    showError: function(msg) {
        this.$(".error").show();
        this.$(".error").html(msg);
        clearTimeout(this.timer);
        this.timer = setTimeout(this.hideError, 5000);
    },
    
    hideError: function() {
        this.$(".error").hide();
        this.$(".error").html("");
    }
});
