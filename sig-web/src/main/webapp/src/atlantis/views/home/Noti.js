/*
 * Atlantis View - 通知
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Views.Noti = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "onQuery"
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderTable, this);
    },
    
    destroy: function() {
        $("#Slider").unbind();
        $("#Left").empty();
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(0);
    },
    
    render: function(query) {
        this.renderTopNav();
        
        var view = this;
        $.Mustache.load('../../asset/agent/tpl/noti.html').done(function() {
            $("#Left").html($.Mustache.render("tpl-noti-treenav"));
            $("#Slider").click(view.slide);
            view.$el.html($.Mustache.render("tpl-noti"));
            
            view.initComponent();
            
            view.lastArgs = {};
            view.getArgs();
            view.lastArgs.pageSize = 20;
            view.queryFirstPage();
        });
    },
    
    initComponent: function() {
        esui.init(this.el, {
            NotiRange: {
                range: {
                    begin: new Date(2009, 8, 1),
                    end: new Date()
                },
                valueAsObject: {
                    begin: new Date(2009, 8, 1),
                    end: new Date()
                }
            },
            PageSize: {
                datasource: [
                    {name:'20', value: 20},
                    {name:'50', value: 50},
                    {name:'100', value: 100}
                ],
                value: 20
            }
        });
        
        this.bindPage();
        
        //隐藏双日历快捷键
        $(".ui-mmcal").hide();
    },
    
    getArgs: function() {
        this.lastArgs.titleKeyWord = esui.get("Keyword").getValue();
        var range = esui.get("NotiRange").getValue().split(",");
        this.lastArgs.timeRange = {
            start: range[0],
            end: range[1]
        };
    },
    
    onQuery: function() {
        this.getArgs();
        this.queryFirstPage();
    },
    
    queryFirstPage: function() {
        this.lastArgs.pageNo = 1;
        this.pageRendered = false;
        this.query(this.lastArgs);
    },
    
    query: function(args) {
        this.model.getData(args);
    },
    
    renderTable: function(model, data) {
        var args = this.lastArgs;
        
        if (data.rowCount == 0) {
            this.$(".info").show();
            this.$(".data").hide();
        } else {
            this.$(".info").hide();
            this.$(".data").show();
            
            //页码
            this.renderPage(data.rowCount);
            
            //表格
            this.$(".grid").html($.Mustache.render("tpl-noti-list", {
                data: data.data
            }));
            Util.fixTable(this.$(".grid"));
        }
    },
    
    bindPage: function() {
        var view = this;
        esui.get("PageSize").onchange = function(value, item) {
            view.lastArgs.pageSize = value;
            view.queryFirstPage();
        };
        esui.get("PageNo").onchange = function(page) {
            view.lastArgs.pageNo = page + 1;
            view.query(view.lastArgs);
        };
    },
    
    renderPage: function(rowCount) {
        if (!this.pageRendered) {
            var total = Math.ceil(rowCount / esui.get("PageSize").value);
            var pager = esui.get("PageNo");
            pager.total = total;
            pager.page = 0;
            pager.render();
            this.pageRendered = true;
        }
        this.$(".row-count").html("共 " + rowCount + " 条");
    },
    
    slide: function(e) {
        $(e.target).toggleClass("slide-right");
        $("#Left .tab").toggle();
        $("#TreeNav").toggle();
        $("#Left").toggleClass("left-hide", 200);
        $("#Right").toggleClass("right-expand", 200);
    }
});
