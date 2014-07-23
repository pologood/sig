/*
 * Atlantis View - 客户中心
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Views.AccountCenter = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "onQuery",
        "click a.ad-query": "toggle",
        "click a.custLog": "sendLog"
    },
    
    initialize: function() {
        this.model.bind("change:data", this.renderTable, this);
    },
    
    destroy: function() {
        esui.dispose();
        this.$(".trade").treeselect("destroy");
        this.cs.destroy();
        this.model.unbind();
        this.$el.unbind();
        this.$el.html("");
        Atlantis.Widgets.TreeNavSimple.destroy();
    },
    
    sendLog: function(e) {
        Util.sendCustLog(9);
    },
    
    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(1);
    },
    
    renderTreeNav: function() {
        Atlantis.Widgets.TreeNavSimple = new Atlantis.Views.TreeNavSimple(Atlantis.TreeNav.Cust, 0, 1);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        this.$el.mustache("tpl-right");
        this.$(".report-switch").html('<h3>客户中心</h3>');
        this.$(".topbar").css({overflow: "visible"});
        this.$(".title").before('<div id="ColumnSelect"></div>');
        
        var view = this,
            status = T.url.queryToJson(query).status;
        $.Mustache.load('../../asset/agent/tpl/cust-ac.html').done(function() {
            view.$('.query-form').mustache("tpl-cust-ac");
            view.initComponent(status);
            view.getTrade();
        });
    },
    
    getTrade: function() {
        var view = this;
        dwr.request.run({
            method: "TradeAction.getTrades",
            args: [],
            success: function(response) {
                view.$(".trade").treeselect({
                    options: view.toTreeSelectFormat(response.data),
                    level: 1
                });
                
                view.$("button").hide();
                
                //初始查询
                view.lastArgs = {};
                view.getArgs();
                view.lastArgs.pageSize = 20;
                view.queryFirstPage();
            }
        });
    },
    
    toTreeSelectFormat: function(trade) {
        var data = [];
        for (var i = 0; i < trade.length; i++) {
            var op = {label: trade[i].name, value: trade[i].code};
            if (trade[i].secondTrades) {
                op.children = [];
                for (var j = 0; j < trade[i].secondTrades.length; j++) {
                    op.children.push({
                        label: trade[i].secondTrades[j].name,
                        value: trade[i].secondTrades[j].code
                    });
                }
            }
            data.push(op);
        }
        return data;
    },
    
    initComponent: function(status) {
        var logic = [
            {name:'≥', value: 1},
            {name:'≤', value: 2},
            {name:'＝', value: 3},
            {name:'＞', value: 4},
            {name:'＜', value: 5}
        ];
        
        esui.init(this.el, {
            QueryType: {
                datasource: [
                    {name: '客户ID', value: 1},
                    {name: '客户名称', value: 2},
                    {name: '客户账号', value: 3},
                    {name: '客户URL', value: 6},
                    {name: '关联客服', value: 4},
                    {name: '关联销售', value: 5}
                ],
                value: 2
            },
            PageSize: {
                datasource: [
                    {name: '20', value: 20},
                    {name: '50', value: 50},
                    {name: '100', value: 100}
                ],
                value: 20
            },
            Trade: {
                datasource: [
                    {name: '请选择', value: 0},
                    {name: '一级行业', value: 1},
                    {name: '二级行业', value: 2}
                ],
                value: 0
            },
            Register: {
                range: {
                    begin: new Date(2002, 10, 1),
                    end: Util.date.yesterday()
                },
                valueAsObject: {
                    begin: Util.date.getNDaysBefore(7),
                    end: Util.date.yesterday()
                }
            },
            RegisterType: {
                datasource: [
                    {name: '全部', value: 0},
                    {name: '自定义', value: 1}
                ],
                value: 0
            },
            Maintain: {
                range: {
                    begin: Util.date.getNDaysBefore(91),
                    end: Util.date.yesterday()
                },
                valueAsObject: {
                    begin: Util.date.getNDaysBefore(7),
                    end: Util.date.yesterday()
                }
            },
            MaintainType: {
                datasource: [
                    {name: '全部', value: 0},
                    {name: '自定义', value: 1}
                ],
                value: 0
            },
            Product: {
                datasource: [
                    {name: '请选择', value: 0},
                    {name: '竞价服务', value: 1},
                    {name: '搜狗金榜', value: 2},
                    {name: '商务直投', value: 3}
                ],
                value: 0
            },
            Status: {
                datasource: [
                    {name: '请选择', value: 0},
                    {name: '正常', value: 1},
                    {name: '暂停', value: 2},
                    //{name: '转换', value: 3},
                    {name: '拒绝', value: 4},
                    {name: '待审核', value: 5},
                    {name: '未入资', value: 6},
                    {name: '不入资', value: 7}
                ],
                value: status ? status : 0
            },
            Logic1: {datasource:logic, value: 1},
            Logic2: {datasource:logic, value: 1},
            Logic3: {datasource:logic, value: 1},
            Logic4: {datasource:logic, value: 1},
            Logic5: {datasource:logic, value: 1}
        });
        
        $(".ui-mmcal").hide();
        
        var view = this;
        esui.get("RegisterType").onchange = function(value, item) {
            if (value == 0) {
                view.$("#RegisterWrap").hide();
            } else {
                view.$("#RegisterWrap").show();
            }
        };
        esui.get("MaintainType").onchange = function(value, item) {
            if (value == 0) {
                view.$("#MaintainWrap").hide();
            } else {
                view.$("#MaintainWrap").show();
            }
        };
        esui.get("Trade").onchange = function(value, item) {
            if (value == 0) {
                view.$("button").hide();
            } else {
                view.$("button").show();
                view.$(".trade").treeselect("setLevel", value);
            }
        };
        esui.get("PageSize").onchange = function(value, item) {
            view.lastArgs.pageSize = value;
            view.queryFirstPage();
        };
        esui.get("PageNo").onchange = function(page) {
            view.lastArgs.pageNo = page + 1;
            view.query(view.lastArgs);
        };
        
        //列选择器
        var csTpl = $.Mustache.render("tpl-cust-cs-panel");
        this.cs = new ColSelector('ColumnSelect', csTpl, 5, function() {
            view.renderTable(view.model, view.model.get("data"));
        });
    },
    
    toggle: function(e) {
        var me = $(e.target);
        me.toggleClass("ad-query-show");
        if (me.hasClass("ad-query-show")) {
            this.$(".ad-block").slideDown(200);
        } else {
            this.$(".ad-block").slideUp(200);
        }
    },
    
    getArgs: function() {
        this.lastArgs.selectCustomerId = esui.get("QueryType").value;
        this.lastArgs.selectCustomerValue = T.string.trim(esui.get("Query").getValue());
        
        if (esui.get("RegisterType").value == 0) {
            this.lastArgs.registerDate = null;
        } else {
            var range = esui.get("Register").getValue().split(",");
            this.lastArgs.registerDate = {
                start: range[0],
                end: range[1]
            };
        }
        
        if (esui.get("MaintainType").value == 0) {
            this.lastArgs.latelyUpdateTime = null;
        } else {
            var range = esui.get("Maintain").getValue().split(",");
            this.lastArgs.latelyUpdateTime = {
                start: range[0],
                end: range[1]
            };
        }
        
        var product = esui.get("Product").value;
        this.lastArgs.productType = product == 0 ? null : product;
        var status = esui.get("Status").value;
        this.lastArgs.customerStatus = status == 0 ? null : status;
        
        this.lastArgs.costTotalOpt = esui.get("Logic1").value;
        this.lastArgs.costTotal = T.string.trim(esui.get("Input1").getValue());
        this.lastArgs.customerRemainOpt = esui.get("Logic2").value;
        this.lastArgs.customerRemain = T.string.trim(esui.get("Input2").getValue());
        this.lastArgs.expectedDaysOpt = esui.get("Logic3").value;
        this.lastArgs.expectedDays = T.string.trim(esui.get("Input3").getValue());
        this.lastArgs.yesterdayCostOpt = esui.get("Logic4").value;
        this.lastArgs.yesterdayCost = T.string.trim(esui.get("Input4").getValue());
        this.lastArgs.latelySevenDayCostOpt = esui.get("Logic5").value;
        this.lastArgs.latelySevenDayCost = T.string.trim(esui.get("Input5").getValue());
        
        var tradeType = esui.get("Trade").value;
        this.lastArgs.tradeId = tradeType == 0 ? null : tradeType;
        this.lastArgs.tradeList = tradeType == 0 ? null : [];
        if (tradeType != 0) {
            var view = this,
                trades = this.$(".trade").treeselect("val");
            if (tradeType == 1) {
                $.each(trades, function(index, elem) {
                    view.lastArgs.tradeList.push(parseInt(elem.value, 10));
                });
            } else {
                $.each(trades, function(index, elem) {
                    if (elem.parentNode.tagName.toLowerCase() == "label") {
                        view.lastArgs.tradeList.push(parseInt(elem.value, 10));
                    }
                });
            }
        }
    },
    
    onQuery: function() {
        this.getArgs();
        
        //验证
        if (!Util.isNumber(this.lastArgs.costTotal)) {
            this.showError("总消耗需为数字");
            return;
        }
        if (!Util.isNumber(this.lastArgs.customerRemain)) {
            this.showError("账户余额需为数字");
            return;
        }
        if (!Util.isInt(this.lastArgs.expectedDays)) {
            this.showError("预计可消费天数需为整数");
            return;
        }
        if (!Util.isNumber(this.lastArgs.yesterdayCost)) {
            this.showError("昨日消耗需为数字");
            return;
        }
        if (!Util.isNumber(this.lastArgs.latelySevenDayCost)) {
            this.showError("近7日日均消耗需为数字");
            return;
        }
        
        if ($(".cs-panel :checked").length > this.cs.max) {
            this.showError("选项超过" + this.cs.max + "个，请重选");
            return;
        }
        
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
    
    renderTable: function(model, data) {
        var args = this.lastArgs;
        this.$(".result").show();
        
        if (data.rowCount == 0) {
            this.$(".result .info").show();
            this.$(".result .data").hide();
        } else {
            this.$(".result .info").hide();
            this.$(".result .data").show();
            
            this.renderPage(data.rowCount);
            
            //下载
            this.$(".download").attr({
                href: '../../download?' + T.url.jsonToQuery({
                    reportName: "CustomerCenter",
                    selectCustomerId: args.selectCustomerId,
                    selectCustomerValue: args.selectCustomerValue,
                    productType: args.productType,
                    customerStatus: args.customerStatus,
                    costTotalOpt: args.costTotalOpt,
                    costTotal: args.costTotal,
                    customerRemainOpt: args.customerRemainOpt,
                    customerRemain: args.customerRemain,
                    expectedDaysOpt: args.expectedDaysOpt,
                    expectedDays: args.expectedDays,
                    yesterdayCostOpt: args.yesterdayCostOpt,
                    yesterdayCost: args.yesterdayCost,
                    latelySevenDayCostOpt: args.latelySevenDayCostOpt,
                    latelySevenDayCost: args.latelySevenDayCost,
                    tradeId: args.tradeId,
                    tradeList: args.tradeList == null ? null : args.tradeList.join(","),
                    registerDateStart: args.registerDate == null ? null : args.registerDate.start,
                    registerDateEnd: args.registerDate == null ? null : args.registerDate.end,
                    latelyUpdateTimeStart: args.latelyUpdateTime == null ? null : args.latelyUpdateTime.start,
                    latelyUpdateTimeEnd: args.latelyUpdateTime == null ? null : args.latelyUpdateTime.end
                })
            });
            
            //控制列显示
            var col = {
                c1: $(".cs-panel #c1")[0].checked ? [1] : [],
                c2: $(".cs-panel #c2")[0].checked ? [1] : [],
                c3: $(".cs-panel #c3")[0].checked ? [1] : [],
                c4: $(".cs-panel #c4")[0].checked ? [1] : [],
                c5: $(".cs-panel #c5")[0].checked ? [1] : [],
                c6: $(".cs-panel #c6")[0].checked ? [1] : [],
                c7: $(".cs-panel #c7")[0].checked ? [1] : [],
                c8: $(".cs-panel #c8")[0].checked ? [1] : [],
                c9: $(".cs-panel #c9")[0].checked ? [1] : [],
                c10: $(".cs-panel #c10")[0].checked ? [1] : [],
                c11: $(".cs-panel #c11")[0].checked ? [1] : [],
                c12: $(".cs-panel #c12")[0].checked ? [1] : []
            };
            var table = $.Mustache.render("tpl-cust-ac-table", {
                data: data.data,
                col: col,
                agentUserId: $("#UserId").val()
            });
            this.$(".grid").html(table);
            Util.fixTable(this.$(".grid"));
        }
    },
    
    showError: function(msg) {
        clearTimeout(this.timer);
        
        Atlantis.Widgets.MessageBox.show(msg);
        
        this.timer = setTimeout(function() {
            Atlantis.Widgets.MessageBox.hide();
        }, 5000);
    }
});
