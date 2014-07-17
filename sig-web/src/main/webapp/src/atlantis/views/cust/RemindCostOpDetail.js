/*
 * Agent View - RemindCostOpDetail
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.RemindCostOpDetail = Backbone.View.extend({
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
        Agent.Widgets.TreeNavSimple.destroy();
    },
    
    renderTopNav: function() {
        Agent.Widgets.TopNav.render(1);
    },
    
    renderTreeNav: function() {
        Agent.Widgets.TreeNavSimple = new Agent.Views.TreeNavSimple(Agent.TreeNav.Cust, 2, 0);
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
        this.$(".download").remove();
        this.$(".report-switch").html(this.TPL_TITLE);
        this.$(".query-form").html([
            this.TPL_DATE,
            this.TPL_CUST
        ].join(""));
        
        if (query == "") {
            alert("缺少操作类型");
            return;
        }
        
        //初始化控件
        this.initEsui(query);
        this.bindEsui();
        
        //初始查询
        this.lastArgs = {};
        this.lastArgs.pageNo = 1;
        this.lastArgs.pageSize = 20;
        this.pageRendered = false;
        this.getArgs();
        this.query(this.lastArgs);
    },
    
    initEsui: function(query) {
        var json = T.url.queryToJson(decodeURIComponent(query));
        this.opType = json.opType;
        this.opContent = json.opContent;
        
        esui.init(this.el, {
            DateRange: {
                datasource: [
                    {name:'今日', value: 1},
                    {name:'前7日', value: 2}
                ],
                value: parseInt(json.type, 10)
            },
            Calendar: {
                range: {
                    begin: Util.date.getNDaysBefore(8),
                    end: Util.date.yesterday()
                },
                valueAsObject: {
                    begin: T.date.parse(json.sd),
                    end: T.date.parse(json.ed)
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
        
        if (esui.get("DateRange").value == 2) {
            this.$(".time").show();
        }
        
        //隐藏双日历快捷键
        $(".ui-mmcal").hide();
        
        //标题
        this.$(".title").html("执行" + this.opType + "操作的客户");
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
        this.lastArgs.opType = this.opType;
        this.lastArgs.opContent = this.opContent;
        if (esui.get("DateRange").value == 1) {
            this.lastArgs.startDate = this.lastArgs.endDate = T.date.format(new Date(), "yyyy-MM-dd");
        } else {
            var date = esui.get("Calendar").getValue().split(",");
            this.lastArgs.startDate = date[0];
            this.lastArgs.endDate = date[1];
        }
        this.lastArgs.userType = esui.get("Cust").value;
        this.lastArgs.userId = encodeURIComponent($.trim(esui.get("CustKw").getValue()));
    },
    
    queryAll: function() {
        if (!this.opType) {
            alert("缺少操作类型");
            return;
        }
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
                agentUserId: $("#UserId").val(),
                op: $("#AdminRoleID").val() == "1007" ? [] : [1]
            }));
            Util.fixTable(this.$(".grid"));
        }
    },
    
    TPL_TAB: [
        '<div class="tab"><a href="#cust/remind/cost/cust/" hidefocus="true">客户概况</a>',
        '<a href="#cust/remind/cost/op/" class="active" hidefocus="true">操作概况</a></div>'
    ].join(""),
    
    TPL_TITLE: '<h3>客户影响消耗操作提醒<span class="help" title="仅提醒客户登录进行的操作"></span></h3>',
    
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
    
    TPL_TABLE: [
        '<table>',
        '<tr><th>客户ID</th><th>客户名称</th><th>客户账号</th><th>关联客服</th><th>操作内容</th><th>近7日日均消耗</th>',
        '<th>操作前</th><th>操作后</th>{{#op}}<th>维护入口</th>{{/op}}</tr>',
        '{{#data}}<tr>',
        '<td class="text">{{custId}}</td>',
        '<td class="text"><div class="ellipsis" style="width:200px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></td>',
        '<td class="text">{{custEmail}}</td>',
        '<td class="text">{{custCs}}</td>',
        '<td class="text">{{opContent}}：{{opCount}}个</td>',
        '<td>{{avgCost}}</td>',
        '<td class="text op">{{#beforeOp}}',
        '<div class="h" title="{{hierarchy}}">{{hierarchy}}</div>',
        '<div class="c" title="{{content}}">{{content}}</div>',
        '{{/beforeOp}}{{{download1}}}</td>',
        '<td class="text op">{{#afterOp}}',
        '<div class="h" title="{{hierarchy}}">{{hierarchy}}</div>',
        '<div class="c" title="{{content}}">{{content}}</div>',
        '{{/afterOp}}{{{download2}}}</td>',
        '{{#op}}<td class="text"><a class="custLog" href="../../delegate?agentUserId={{agentUserId}}&accountId={{custId}}&toInfo=searchAd" target="_blank">点击维护</a></td>{{/op}}',
        '</tr>{{/data}}',
        '</table>'
    ].join("")
});
