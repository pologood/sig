/*
 * Atlantis View - RemindCostCust
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.RemindCostCust = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "queryAll",
        "click a.custLog": "sendLog"
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
        Atlantis.Widgets.TreeNavSimple = new Atlantis.Views.TreeNavSimple(Atlantis.TreeNav.Cust, 2, 0);
    },
    
    renderTabNav: function() {
        Atlantis.Widgets.TabNav.render(Atlantis.TreeNav.Cust, 2, 0, 0);
    },
    
    sendLog: function(e) {
        Util.sendCustLog(5);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".topbar").remove();
        this.$(".report-switch").remove();
        this.$(".query-form").html([
            this.TPL_TITLE,
            this.TPL_TAB,
            this.TPL_DATE,
            this.TPL_CUST,
            this.TPL_OP
        ].join(""));
        this.$(".query-form").before(this.TPL_TIP);
        
        this.renderTabNav();
        
        //初始化控件
        this.initEsui();
        this.bindEsui();
        
        //初始查询
        this.lastArgs = {};
        this.lastArgs.pageNo = 1;
        this.lastArgs.pageSize = 20;
        this.pageRendered = false;
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
            },
            Cust: {
                datasource: [
                    {name:'客户ID', value: 0},
                    {name:'客户名称', value: 2},
                    {name:'客户账号', value: 1},
                    {name:'关联客服', value: 3}
                ],
                value: 2
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
        esui.get("PageSize").onchange = function(value, item) {
            view.lastArgs.pageSize = value;
            view.lastArgs.pageNo = 1;
            view.pageRendered = false;
            view.query(view.lastArgs);
        };
        esui.get("PageNo").onchange = function(page) {
            view.lastArgs.pageNo = page + 1;
            view.query(view.lastArgs);
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
            this.lastArgs.startDate = mdate[0];
            this.lastArgs.endDate = mdate[1];
        }
        this.lastArgs.userType = esui.get("Cust").value;
        this.lastArgs.userId = encodeURIComponent($.trim(esui.get("CustKw").getValue()));
        this.lastArgs["delete"] = esui.get("Delete").isChecked();
        this.lastArgs["pause"] = esui.get("Pause").isChecked();
        this.lastArgs["reduce"] = esui.get("Reduce").isChecked();
        this.lastArgs["modify"] = esui.get("Update").isChecked();
    },
    
    queryAll: function() {
        this.getArgs();
        this.lastArgs.pageNo = 1;
        this.pageRendered = false;
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
            
            //页码
            if (!this.pageRendered) {
                var total = Math.ceil(data.rowCount / esui.get("PageSize").value),
                    pager = esui.get("PageNo");
                pager.total = total;
                pager.page = 0;
                pager.render();
                this.pageRendered = true;
            }
            this.$(".row-count").html("共 " + data.rowCount + " 条");
            
            //表格
            this.$(".grid").html(Mustache.to_html(this.TPL_TABLE, {
                data: data.data,
                type: args.type,
                sd: args.sd,
                ed: args.ed,
                'delete': args['delete'],
                'pause': args['pause'],
                'reduce': args['reduce'],
                'modify': args['modify']
            }));
            Util.fixTable(this.$(".grid"));
        }
    },
    
    TPL_TAB: '<div class="tab"></div>',
    
    TPL_TIP: '<div class="alert">客户影响消耗操作仅针对旭日提醒</div>',
    
    TPL_TITLE: '<div class="block"><h3>客户影响消耗操作提醒<span class="help" title="仅提醒客户登录进行的操作"></span></h3></div>',
    
    TPL_DATE: [
        '<div class="block">',
        '<strong>时间范围：</strong>',
        '<div ui="type:Select;id:DateRange;width:75"></div>',
        '<div class="time" style="display:none"><div ui="type:MultiCalendar;id:Calendar"></div></div></div>'
    ].join(""),
    
    TPL_CUST: [
        '<div class="block">',
        '<strong>选择客户：</strong>',
        '<div ui="type:Select;id:Cust;width:75"></div>',
        '<input ui="type:TextInput;id:CustKw;width:100" type="text" />',
        '</div>'
    ].join(""),
    
    TPL_OP: [
        '<div class="block">',
        '<strong>操作类型：</strong>',
        '<input type="checkbox" title="删除" hidefocus="ture" ui="type:CheckBox;id:Delete" checked />',
        '<input type="checkbox" title="暂停" hidefocus="ture" ui="type:CheckBox;id:Pause" checked />',
        '<input type="checkbox" title="减少" hidefocus="ture" ui="type:CheckBox;id:Reduce" checked />',
        '<input type="checkbox" title="修改" hidefocus="ture" ui="type:CheckBox;id:Update" checked />',
        '</div>'
    ].join(""),
    
    TPL_TABLE: [
        '<table>',
        '<tr><th>客户ID</th><th>客户名称</th><th>客户账号</th><th>关联客服</th><th>操作类型</th><th>操作次数</th>',
        '<th>近7日日均消耗</th><th>查看详情</th></tr>',
        '{{#data}}<tr>',
        '<td class="text">{{custId}}</td>',
        '<td class="text"><div class="ellipsis" style="width:200px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></td>',
        '<td class="text">{{custEmail}}</td>',
        '<td class="text">{{custCs}}</td>',
        '<td class="text">{{opType}}</td>',
        '<td>{{opCount}}</td>',
        '<td>{{avgCost}}</td>',
        '<td class="text"><a href="#cust/remind/cost/custdetail/custId={{custId}}&custName={{custName}}&type={{type}}&sd={{sd}}&ed={{ed}}&delete={{delete}}&pause={{pause}}&reduce={{reduce}}&modify={{modify}}" target="_blank">具体操作</a></td>',
        '</tr>{{/data}}',
        '</table>'
    ].join("")
});
