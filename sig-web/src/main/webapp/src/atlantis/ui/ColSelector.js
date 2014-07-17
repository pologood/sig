/*
 * 信息列选择器
 * @param id {String} 容器id
 * @param tpl {String} 内容模版
 * @param max {Number} 最多可选个数
 * @param callback {Function} 点击确定回调
 */

function ColSelector(id, tpl, max, callback) {
    this.id = id;
    this.tpl = tpl;
    this.max = max;
    this.callback = callback;
    this.init();
}

ColSelector.prototype = {
    init: function() {
        var selector = "#" + this.id;
        $(selector).css({position: "relative"}).html([
            '<a href="javascript:void(0)" hidefocus="true" class="cs-trigger">&nbsp;</a>',
            '<div class="cs-panel" style="display:none"></div>'
        ].join(""));
        this.panel = $(selector + " .cs-panel");
        this.panel.html(this.tpl);
        this.trigger = $(selector + " .cs-trigger");
        
        //绑定事件
        var me = this;
        $(selector).delegate(".cs-trigger", "click", this.toggle);
        
        $(selector).delegate(".cs-panel", "click", function(e) {
            Util.stopBubble(e);
        });
        
        $(selector).delegate(".cs-panel .ok", "click", function() {
            if ($(".cs-panel :checked").length > me.max) {
                me.showError("选项超过" + me.max + "个，请重选");
                return;
            }
            me.hide();
            me.callback();
        });
        
        $(selector).delegate(".cs-panel .cancel", "click", this.hide);
        
        $(document).bind("click", this.hide);
    },
    
    destroy: function() {
        var selector = "#" + this.id;
        $(selector).undelegate();
        $(selector).empty();
        $(document).unbind("click", this.hide);
    },
    
    toggle: function(e) {
        Util.stopBubble(e);
        var me = $(this);
        me.toggleClass("cs-trigger-down");
        if(me.hasClass("cs-trigger-down")) {
            $(".cs-panel").slideDown(200);
        } else {
            $(".cs-panel").slideUp(200);
        }
    },
    
    hide: function() {
        $(".cs-trigger").removeClass("cs-trigger-down");
        $(".cs-panel").slideUp(200);
    },
    
    showError: function(msg) {
        clearTimeout(this.timer);
        Atlantis.Widgets.MessageBox.show(msg);
        this.timer = setTimeout(function() {
            Atlantis.Widgets.MessageBox.hide();
        }, 5000);
    }
};
