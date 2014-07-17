/*
 * Agent View - RemindCostOp
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.RemindCostOp = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "queryAll"
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
        Agent.Widgets.TreeNavSimple.destroy();
    },
    
    renderTopNav: function() {
        Agent.Widgets.TopNav.render(1);
    },
    
    renderTreeNav: function() {
        Agent.Widgets.TreeNavSimple = new Agent.Views.TreeNavSimple(Agent.TreeNav.Cust, 2, 0);
    },
    
    renderTabNav: function() {
        Agent.Widgets.TabNav.render(Agent.TreeNav.Cust, 2, 0, 1);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".topbar").remove();
        this.$(".page").html("");
        this.$(".report-switch").remove();
        this.$(".query-form").html([
            this.TPL_TITLE,
            this.TPL_TAB,
            this.TPL_DATE
        ].join(""));
        this.$(".query-form").before(this.TPL_TIP);
        
        this.renderTabNav();
        
        //初始化控件
        this.initEsui();
        this.bindEsui();
        
        //初始查询
        this.lastArgs = {};
        this.getArgs();
        this.query(this.lastArgs);
    },
    
    initEsui: function() {
        esui.init(this.el, {
            DateRange: {
                datasource: [
                    {name:'今日', value: 1},
                    {name:'前7日', value: 2}
                ],
                value: 1
            },
            Calendar: {
                range: {
                    begin: Util.date.getNDaysBefore(8),
                    end: Util.date.yesterday()
                },
                valueAsObject: {
                    begin: Util.date.getNDaysBefore(7),
                    end: Util.date.yesterday()
                }
            }
        });
        
        //隐藏双日历快捷键
        $(".ui-mmcal").hide();
    },
    
    bindEsui: function() {
        var view = this;
        esui.get("DateRange").onchange = function(value, item) {
            if (value === 1) {
                view.$(".time").hide();
            } else {
                view.$(".time").show();
            }
        };
    },
    
    getArgs: function() {
        var mdate = esui.get("Calendar").getValue().split(",");
        this.lastArgs.type = esui.get("DateRange").value;
        this.lastArgs.sd = mdate[0];
        this.lastArgs.ed = mdate[1];
        
        if (this.lastArgs.type == 1) {
            this.lastArgs.startDate = this.lastArgs.endDate = T.date.format(new Date(), "yyyy-MM-dd");
        } else {
            var date = esui.get("Calendar").getValue().split(",");
            this.lastArgs.startDate = mdate[0];
            this.lastArgs.endDate = mdate[1];
        }
    },
    
    queryAll: function() {
        this.getArgs();
        this.query(this.lastArgs);
    },
    
    query: function(args) {
        this.model.getData(args);
    },
    
    renderTable: function(model, data) {
        var args = this.lastArgs;
        this.$(".result").show();
        if (data.rowCount == 0) {
            this.$(".result .info").show();
            this.$(".result .data").hide();
        } else {
            this.$(".result .info").hide();
            this.$(".result .data").show();
            
            //表格
            this.$(".grid").html(Mustache.to_html(this.TPL_TABLE, {
                data: data.data,
                type: args.type,
                sd: args.sd,
                ed: args.ed
            }));
            Util.fixTable(this.$(".grid"));
        }
    },
    
    TPL_TIP: '<div class="alert">客户影响消耗操作仅针对旭日提醒</div>',
    
    TPL_TAB: '<div class="tab"></div>',
    
    TPL_TITLE: '<div class="block"><h3>客户影响消耗操作提醒<span class="help" title="仅提醒客户登录进行的操作"></span></h3></div>',
    
    TPL_DATE: [
        '<div class="block">',
        '<strong>时间范围：</strong>',
        '<div ui="type:Select;id:DateRange;width:75"></div>',
        '<div class="time" style="display:none"><div ui="type:MultiCalendar;id:Calendar"></div></div></div>'
    ].join(""),
    
    TPL_TABLE: [
        '<table>',
        '<tr><th>操作类型</th><th>操作内容</th><th>操作客户数</th><th>操作次数</th><th>查看详情</th></tr>',
        '{{#data}}<tr class="sum">',
        '<td class="text">{{opType}}</td>',
        '<td class="text">——</td>',
        '<td>{{custCount}}</td>',
        '<td>{{opCount}}</td>',
        '<td class="text">&nbsp;</td>',
        '</tr>',
        '{{#detail}}<tr>',
        '<td>&nbsp;</td>',
        '<td class="text">{{opContent}}</td>',
        '<td>{{custCount}}</td>',
        '<td>{{opCount}}</td>',
        '<td class="text"><a href="#cust/remind/cost/opdetail/type={{type}}&sd={{sd}}&ed={{ed}}&opType={{opType}}&opContent={{opContent}}" target="_blank">具体客户</a></td>',
        '</tr>{{/detail}}',
        '{{/data}}',
        '</table>'
    ].join("")
});
