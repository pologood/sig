/*
 * Agent View - MessageBox 
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.MessageBox = Backbone.View.extend({
    el: $("#MessageBox"),
    
    show: function(msg) {
        this.$el.html(msg);
        this.$el.show();
    },
    
    hide: function() {
        this.$el.html("");
        this.$el.hide();
    },
    
    showMask: function() {
        //window.scroll(0, 0);
        document.body.style.overflow = "hidden";
        $("#Mask").css({
            height: Math.max(window.screen.availHeight, document.body.offsetHeight)
        }).show();
    },
    
    hideMask: function() {
        $("#Mask").hide();
        document.body.style.overflow = "visible";
    }
});
