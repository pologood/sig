/*
 * Atlantis View - 系统消息
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Views.Msg = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "onQuery"
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderTable, this);
    },
    
    destroy: function() {
        $("#Slider").unbind();
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
        $.Mustache.load('../../asset/agent/tpl/msg.html').done(function() {
            $("#Left").html($.Mustache.render("tpl-msg-treenav"));
            $("#Slider").click(view.slide);
            view.$el.html($.Mustache.render("tpl-msg"));
            
            view.initComponent();
            
            view.lastArgs = {};
            view.getArgs();
            view.lastArgs.pageSize = 20;
            view.queryFirstPage();
            
            view.getMsgType();
        });
    },
    
    initComponent: function() {
        esui.init(this.el, {
            MsgType: {
                datasource: [
                    {value: 0, name: "全部"}
                ],
                value: 0
            },
            MsgRange: {
                range: {
                    begin: Util.date.getNDaysBefore(15),
                    end: new Date()
                },
                valueAsObject: {
                    begin: Util.date.getNDaysBefore(14),
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
    
    getMsgType: function() {
        dwr.request.run({
            context: "noLoading",
            method: "NoticeAndSysMessageViewAction.getMessageTypes",
            args: [],
            success: function(response) {
                var type = [{value: 0, name: "全部"}];
                $.each(response.data, function(index, val) {
                    type.push({value: val.id, name: val.name});
                });
                var typeCtrl = esui.get("MsgType");
                typeCtrl.datasource = type;
                typeCtrl.render();
                typeCtrl.setValue(0);
            }
        });
    },
    
    getArgs: function() {
        var type = esui.get("MsgType").value
        this.lastArgs.type = type == 0 ? null : type;
        var range = esui.get("MsgRange").getValue().split(",");
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
            this.$(".grid").html($.Mustache.render("tpl-msg-list", {
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
