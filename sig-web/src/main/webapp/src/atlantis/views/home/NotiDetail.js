/*
 * Agent View - 通知内容
 * @author : liangxiao
 * @date   : 2013
 */

Agent.Views.NotiDetail = Backbone.View.extend({
    el: $("#Right"),
    
    initialize: function() {
        this.model.bind("change:data", this.renderContent, this);
    },
    
    destroy: function() {
        $("#Slider").unbind();
        $("#Left").empty();
        this.$el.empty();
    },
    
    renderTopNav: function() {
        Agent.Widgets.TopNav.render(0);
    },
    
    render: function(query) {
        this.renderTopNav();
        
        var view = this;
        $.Mustache.load('../../asset/agent/tpl/noti.html').done(function() {
            $("#Left").html($.Mustache.render("tpl-noti-treenav"));
            $("#Slider").click(view.slide);
            
            view.model.getContent(query);
        });
    },
    
    renderContent: function(model, data) {
        this.$el.mustache("tpl-noti-detail", {
            title: data.title,
            content: data.content.replace(/clear:\s?both;?/i, "")
        });
    },
    
    slide: function(e) {
        $(e.target).toggleClass("slide-right");
        $("#Left .tab").toggle();
        $("#TreeNav").toggle();
        $("#Left").toggleClass("left-hide", 200);
        $("#Right").toggleClass("right-expand", 200);
    }
});
