/*
 * Atlantis View - 账户优化详情
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Views.OptDetail = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.edit-match": "editMatch"
    },
    
    initialize: function() {
        _.bindAll(this, 'renderTable');
        this.model.bind("change:data", this.renderTable);
    },
    
    destroy: function() {
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.html("");
        Atlantis.Widgets.TreeNavSimple.destroy();
    },
    
    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(1);
    },
    
    renderTreeNav: function() {
        Atlantis.Widgets.TreeNavSimple = new Atlantis.Views.TreeNavSimple(Atlantis.TreeNav.Cust, 1, 0);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //加载模版
        $.Mustache.load('../../asset/agent/tpl/slide-panel.html');
        $.Mustache.load('../../asset/agent/tpl/slide-panel-kwmatch.html');
        
        this.$el.mustache("tpl-right");
        this.$(".query-form").remove();
        this.$(".query").remove();
        this.$(".topbar").remove();
        this.$(".page").remove();
        this.$(".report-switch").css({"border": 0});
        this.$(".result").css({"margin-top": 10});
        var view = this;
        $.Mustache.load("../../asset/agent/tpl/opt-detail.html").done(function() {
            view.$(".report-switch").before($.Mustache.render("tpl-opt-detail-bread"));
            view.$(".report-switch").mustache("tpl-opt-detail-title");
            
            //查询
            if (query != "") {
                view.model.getData({custId: parseInt(query, 10)});
            }
        });
    },
    
    renderTable: function(model, data) {
        var args = this.lastArgs;
        
        var summary = $.Mustache.render("tpl-opt-detail-summary", {
            data: data.data
        });
        this.$(".report-switch").after(summary);
        this.$(".result").show();
        
        if (data.data.optimizeDetail.length == 0) {
            this.$(".result .info").show();
            this.$(".result .data").hide();
        } else {
            this.$(".result .info").hide();
            this.$(".result .data").show();
            
            var table = $.Mustache.render("tpl-opt-detail-table", {
                detail: data.data.optimizeDetail
            });
            this.$(".grid").html(table);
            Util.fixTable(this.$(".grid"));
        }
    },
    
    editMatch: function() {
        Atlantis.Widgets.Panel.KeyWordMatch = new Atlantis.Views.Panel.KeyWordMatch({
            parentView: this,
            custId: parseInt($("#CustId").val(), 10),
            custName: $("#CustName").val()
        });
    }
});
