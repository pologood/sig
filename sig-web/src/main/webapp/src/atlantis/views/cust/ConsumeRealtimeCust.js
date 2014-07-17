/*
 * Agent View - ConsumeRealtimeCust
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.ConsumeRealtimeCust = Backbone.View.extend({
    el: $("#Right"),

    events: {
        "click a.query": "queryAll",
        "click a.custLog": "sendCustLog",
        "click a.clickLog": "sendClickLog",
        "click th.sortable": "sort"
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
        Agent.Widgets.TreeNavSimple = new Agent.Views.TreeNavSimple(Agent.TreeNav.Cust, 0, 0);
    },

    sendCustLog: function(e) {
        Util.sendCustLog(6);
    },
    
    sendClickLog: function(e) {
        var logid = $(e.target).attr("logid");
        Util.sendClickLog(logid);
    },

    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();

        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".report-switch").html('<h3>客户实时消耗</h3>');
        
        var view = this;
        $.Mustache.load('../../asset/agent/tpl/cust-realtime.html').done(function() {
            view.$(".query-form").mustache("tpl-cust-realtime-query");
            view.$(".report-switch").before($.Mustache.render("tpl-cust-realtime-tip"));
            var today = new Date().getTime();
            if (Util.date.CONSUME_REALTIME_WEEK_CONTRAST_OPEN.getTime() >= today) {
                view.$(".query-form").before($.Mustache.render("tpl-cust-realtime-start"));
            }
            
            //初始化控件
            view.initEsui();
            view.bindEsui();
            
            //初始查询
            view.lastArgs = {};
            view.lastArgs.pageNo = 1;
            view.lastArgs.pageSize = 20;
            view.lastArgs.orderBy = null;
            view.lastArgs.des = null;
            view.pageRendered = false;
            view.getArgs();
            view.query(view.lastArgs);
        });
    },

    initEsui: function() {
        var custDataSource = [
            {name: '客户ID', value: 1},
            {name: '客户名称', value: 2},
            {name: '客户账号', value: 5},
            {name: '关联客服', value: 3}
        ];
        
        esui.init(this.el, {
            Cust: {
                datasource: custDataSource,
                value: 2
            },
            ConsumeCompare: {
                datasource: [
                    {name: '消耗环比', value: 1},
                    {name: '消耗同比', value: 2}
                ],
                value: 1
            },
            PageSize: {
                datasource: [
                    {name: '20', value: 20},
                    {name: '50', value: 50},
                    {name: '100', value: 100}
                ],
                value: 20
            }
        });
    },

    bindEsui: function() {
        var view = this;
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
        this.lastArgs.queryType = esui.get("Cust").value;
        this.lastArgs.query = encodeURIComponent($.trim(esui.get("CustKw").getValue()));
        this.lastArgs.changeType = esui.get("ConsumeCompare").value;
        this.lastArgs.costChangeValue = encodeURIComponent($.trim(esui.get("ConsumeCompareKw").getValue()));
    },

    queryAll: function() {
        this.getArgs();

        if (esui.get("Cust").value == 1) {
            var custId = T.string.trim(esui.get("CustKw").getValue());
            if (custId != "" && !/^[1-9][0-9]*$/.test(custId)) {
                this.showError("客户ID应为正整数");
                return;
            }
            this.lastArgs.query = custId;
        }

        var consume = T.string.trim(esui.get("ConsumeCompareKw").getValue());
        if (consume != "" && !/^[1-9][0-9]*$/.test(consume)) {
            this.showError("消耗变化数值应为正整数");
            return;
        }
        this.lastArgs.costChangeValue = consume;
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
            
            //下载
            this.$(".download").attr({
                href: '../../download?' + T.url.jsonToQuery({
                    reportName: "CustCurrentCost",
                    queryType: args.queryType,
                    query: args.query,
                    changeType: args.changeType,
                    costChangeValue: args.costChangeValue,
                    orderBy: args.orderBy,
                    des: args.des
                })
            });

            //表格
            var table = $.Mustache.render("tpl-cust-realtime-table", {
                sum: data.sum,
                data: data.data,
                agentUserId: $("#UserId").val(),
                op: $("#AdminRoleID").val() == "1007" ? [] : [1]
            });
            this.$(".grid").html(this.toRed(table));
            
            //排序
            if (args.orderBy != null) {
                var th = this.$('.grid th[sortby="' + args.orderBy + '"]');
                th.addClass(args.des == true ? "des" : "asc");
            }
            
            Util.fixTable(this.$(".grid"));
        }
    },

    toRed: function(src) {
        return src.replace(/<td>-([^<\/td>]+)<\/td>/gi, '<td><span style="color:#c13832">-$1</span></td>');
    },
    
    sort: function(e) {
        var me = e.target,
            th = me.tagName.toLowerCase() != "th" ? $(me).parent() : $(me);
        this.lastArgs.orderBy = th.attr("sortby");
        if (th.hasClass("asc")) { //升序
            this.lastArgs.des = true;
        } else if (th.hasClass("des")) { //降序
            this.lastArgs.des = false;
        } else { //未排序
            this.lastArgs.des = true;
        }
        
        this.lastArgs.pageNo = 1;
        this.pageRendered = false;
        this.query(this.lastArgs);
    },
    
    showError: function(msg) {
        clearTimeout(this.timer);
        
        Agent.Widgets.MessageBox.show(msg);
        
        this.timer = setTimeout(function() {
            Agent.Widgets.MessageBox.hide();
        }, 5000);
    }
});
