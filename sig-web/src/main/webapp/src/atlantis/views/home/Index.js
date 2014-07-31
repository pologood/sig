/*
 * Home View - 首页
 * @author : aris
 * @date   : 2014
 */

Atlantis.Views.Index = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click #query a": "queryGraph",
    },
    
    initialize: function() {
           this.viewTask = Atlantis.Auth.ViewIndexTask;   
    },
    
    destroy: function() {
        
        esui.dispose();
        this.recoverIndexStyle();
        this.$el.unbind();
        this.$el.empty();
        
        this.floatWindow && this.floatWindow.destroy();
    },
    
    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(0);
    },
    
    recoverIndexStyle: function() {
        $("#Left").removeClass("no-left");
        $("#Left").removeClass("left-hide");
        $("#Right").removeClass("right-max");
        $("#Right").removeClass("right-expand");
        $("#Right").css({"padding-bottom": 30});
        $("#Foot").css({"border-top-width": 1});
    },
    
    renderTreeNav: function() {
        Atlantis.Widgets.TreeNav = new Atlantis.Views.TreeNav(1, 0, 0);
    },
    
    // render function
    render: function(query) {
           this.renderTopNav();
           this.renderTreeNav();
           
           var view = this;
           esui.init();
           $.Mustache.load('assets/tpl/index.html').done(function() {
               view.$el.mustache("tpl-index", {
                   agentUserId: $("#UserId").val(),
                   isDelegate: $("#Delegate").val() == "true" ? [] : [1]
               });
           });
    },
    
    queryGraph: function(e) {
        var me = $(e.target),
            logid = me.attr("logid");
        
        if (me.hasClass("active")) {
            return;
        }
        
        if (logid) {
            Util.sendClickLog(logid);
        }
        
        var className = me.attr("class");
        switch (className) {
            case "total":
                this.renderCostData(this.totalLineData);
                break;
            case "cpc":
                this.renderCostData(this.cpcLineData);
                break;
            case "cx":
                this.renderCostData(this.cxLineData);
        }
        
        this.$("#CostTab a").removeClass("active");
        me.addClass("active");
    }
});
