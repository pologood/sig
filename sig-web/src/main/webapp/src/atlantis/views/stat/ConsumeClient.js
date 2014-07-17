/*
 * Agent View - ConsumeClient 
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.ConsumeClient = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "queryAll",
        "click .grid .perday": "openPerday",
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
        Agent.Widgets.TreeNav.destroy();
    },
    
    renderTopNav: function() {
        Agent.Widgets.TopNav.render(4);
    },
    
    renderTreeNav: function() {
        Agent.Widgets.TreeNav = new Agent.Views.TreeNav(1, 0, 1);
    },
    
    pageRendered: false,
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".report-switch").html($.Mustache.render("tpl-report-type1") + $.Mustache.render("tpl-data-type"));
        this.$(".query-form").html($.Mustache.render("tpl-query-form-dwmq") + $.Mustache.render("tpl-query-form-compare") + $.Mustache.render("tpl-query-form-product")
            + $.Mustache.render("tpl-query-form-cs") + $.Mustache.render("tpl-query-form-client") + $.Mustache.render("tpl-query-form-cost"));
        this.$(".topbar .download").after('<a href="#" hidefocus="true" class="download-btn byday">消耗分日统计报告</a>'
        + '<a href="#" hidefocus="true" class="download-btn all">客户消耗统计报告</a>');
        
        //上次查询参数
        this.lastAction = null;
        //当前查询参数
        this.actionIndex = 0;
        this.action = ["CostStatAction.getCustCpcCostByCs",
                       "CostStatAction.getCustCpcCostByCsCompare",
                       "CostStatAction.getCustCpcCost",
                       "CostStatAction.getCustCpcCostCompare"];
        this.overviewArgsOfWM = null;
        this.overviewArgsOfDWMQ = null;
        this.contrastArgsOfDWMQ = null;
        
        //初始化日历相关元素
        Agent.Calendar.init(this, "current");
        
        this.overviewArgsOfDWMQ.queryType = 3;
        this.overviewArgsOfDWMQ.query = "";
        
        /*
         * 初始化其他的元素
         */
        //选择客服维度
        esui.get("Report1").setChecked(true);
        //选择整体趋势
        esui.get("Data1").setChecked(true);
        
        //绑定事件
        this.bindEsui();
        
        //自动按默认条件查询
        var args = this.overviewArgsOfDWMQ;
        
        if (T.url.getQueryValue(query, "actionindex") == "4") {
            this.actionIndex = 3;
            args = this.contrastArgsOfDWMQ;
            var change = T.url.getQueryValue(query, "change");
            if (change != null) {
                args.change = change;
                args.queryType = 1;
                args.query = "";
                esui.get("ClientConsume").setValue(change);
            }
            esui.get("Report2").setChecked(true);
            esui.get("Data2").setChecked(true);
            $("#Right .block12").hide();
            $("#Right .block2").show();
            $("#Right .block3").hide();
            $("#Right .block4").hide();
            $("#Right .block5").show();
        }
        
        this.query({
            method: this.action[this.actionIndex],
            args: args
        });
    },
    
    bindEsui: function() {
        var view = this;
        
        //切换报告
        esui.get("Report1").onclick = function(value, item) {
            if (esui.get("Data1").isChecked()) {
                $("#Right .block12").show();
                $("#Right .block2").hide();
                $("#Right .block3").show();
                $("#Right .block4").hide();
                $("#Right .block5").hide();
                view.actionIndex = 0;
            } else {
                $("#Right .block12").hide();
                $("#Right .block2").show();
                $("#Right .block3").show();
                $("#Right .block4").hide();
                $("#Right .block5").hide();
                view.actionIndex = 1;
            }
        };
        esui.get("Report2").onclick = function(value, item) {
            if (esui.get("Data1").isChecked()) {
                $("#Right .block12").show();
                $("#Right .block2").hide();
                $("#Right .block3").hide();
                $("#Right .block4").show();
                $("#Right .block5").hide();
                view.actionIndex = 2;
            } else {
                $("#Right .block12").hide();
                $("#Right .block2").show();
                $("#Right .block3").hide();
                $("#Right .block4").hide();
                $("#Right .block5").show();
                view.actionIndex = 3;
            }
        };
        esui.get("Data1").onclick = function(value, item) {
            if (esui.get("Report1").isChecked()) {
                $("#Right .block12").show();
                $("#Right .block2").hide();
                $("#Right .block3").show();
                $("#Right .block4").hide();
                $("#Right .block5").hide();
                view.actionIndex = 0;
            } else {
                $("#Right .block12").show();
                $("#Right .block2").hide();
                $("#Right .block3").hide();
                $("#Right .block4").show();
                $("#Right .block5").hide();
                view.actionIndex = 2;
            }
        };
        esui.get("Data2").onclick = function(value, item) {
            if (esui.get("Report1").isChecked()) {
                $("#Right .block12").hide();
                $("#Right .block2").show();
                $("#Right .block3").show();
                $("#Right .block4").hide();
                $("#Right .block5").hide();
                view.actionIndex = 1;
            } else {
                $("#Right .block12").hide();
                $("#Right .block2").show();
                $("#Right .block3").hide();
                $("#Right .block4").hide();
                $("#Right .block5").show();
                view.actionIndex = 3;
            }
        };
    },
    
    queryAll: function() {
        //重新渲染页码
        this.overviewArgsOfDWMQ.pageNo = 1;
        this.contrastArgsOfDWMQ.pageNo = 1;
        this.pageRendered = false;
        //按当前查询区域的状态查询
        var index = this.actionIndex, args;
        switch (index) {
            case 0:
                this.overviewArgsOfDWMQ.queryType = 3;
                this.overviewArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("ServiceName").getValue()));
                args = this.overviewArgsOfDWMQ;
                break;
            case 1:
                this.contrastArgsOfDWMQ.queryType = 3;
                this.contrastArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("ServiceName").getValue()));
                args = this.contrastArgsOfDWMQ;
                break;
            case 2:
                this.overviewArgsOfDWMQ.queryType = esui.get("ClientOverView").value;
                this.overviewArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("ClientOverViewKw").getValue()));
                args = this.overviewArgsOfDWMQ;
                break;
            case 3:
                var consum = T.string.trim(esui.get("ClientConsume").getValue());
                if (consum != "" && !/^[1-9][0-9]*$/.test(consum)) {
                    this.showError("日均消耗变化应为正整数");
                    return;
                }
                this.contrastArgsOfDWMQ.queryType = esui.get("ClientContrast").value;
                this.contrastArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("ClientContrastKw").getValue()));
                this.contrastArgsOfDWMQ.change = consum;
                args = this.contrastArgsOfDWMQ;
        }
        this.query({
            method: this.action[index],
            args: args
        });
    },
    
    query: function(param) {
        this.model.getData(param.method, param.args);
    },
    
    renderTable: function(model, data) {
        this.lastAction = model.lastAction;
        this.$(".result").show();
        if (data.data.length == 0) { //无数据
            this.$(".result .info").show();
            this.$(".result .data").hide();
        } else {
            this.$(".result .info").hide();
            this.$(".result .data").show();
            var args = this.lastAction.args;
            
            if (!data.rowCount) data.rowCount = 1;
            
            //下载
            this.$(".topbar .download").show();
            this.$(".topbar .download-btn").hide();
            
            //表格
            if (this.lastAction.method == "CostStatAction.getCustCpcCostByCs") {
                this.renderCustCpcCostByCs(args, data);
            }
            if (this.lastAction.method == "CostStatAction.getCustCpcCostByCsCompare") {
                this.renderCustCpcCostByCsCompare(args, data);
            }
            if (this.lastAction.method == "CostStatAction.getCustCpcCost") {
                this.renderCustCpcCost(args, data);
            }
            if (this.lastAction.method == "CostStatAction.getCustCpcCostCompare") {
                this.renderCustCpcCostCompare(args, data);
            }
            
            //页码
            if (!this.pageRendered) {
                var total = Math.ceil(data.rowCount / esui.get("PageSize").value),
                    pager = esui.get("PageNo");
                pager.total = total;
                pager.page = 0;
                pager.render();
                this.pageRendered = true;
            }
            
            //总条数
            this.$(".row-count").html("共 " + data.rowCount + " 条");
        }
    },
    
    renderCustCpcCostByCs: function(args, data) {
        //标题
        this.$(".title").html("客服维度客户消耗统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "CustCpcCostByCs",
                type: args.time.type,
                date: args.time.date,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                qYear: args.time.qYear,
                q: args.time.q,
                queryType: 3,
                query: args.query,
                product: args.product
            })
        });
        //表格
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(args.time.type != 1 ? this.TPL_TABLE_1 : this.TPL_TABLE_2, {
            sum: data.sum,
            data: data.data
        })));
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderCustCpcCostByCsCompare: function(args, data) {
        //标题
        this.$(".title").html("客服维度客户消耗波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "CustCpcCostByCsCompare",
                type: args.time.type,
                date: args.time.date,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                qYear: args.time.qYear,
                q: args.time.q,
                "lastTime.type": args.lastTime.type,
                "lastTime.date": args.lastTime.date,
                "lastTime.start": args.lastTime.start,
                "lastTime.end": args.lastTime.end,
                "lastTime.year": args.lastTime.year,
                "lastTime.month": args.lastTime.month,
                "lastTime.qYear": args.lastTime.qYear,
                "lastTime.q": args.lastTime.q,
                queryType: 3,
                query: args.query,
                product: args.product
            })
        });
        if (args.time.type != 1) { //非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_3, {
                sum: data.sum,
                data: data.data
            })));
        } else { //按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_4 : this.TPL_TABLE_4.replace(/环比/g, "周同比"), {
                sum: data.sum,
                data: data.data
            })));
        }
        
        Util.fixTable(this.$(".grid"));
    },
    
    openPerday: function(e) {
        Util.stopDefault(e);
        var me = $(e.target),
            args = Agent.Page.cur.model.lastAction.args,
            json = {
                year: args.time.year,
                month: args.time.month,
                product: args.product,
                custId: me.parent().parent().prev().html(),
                custName: me.prev().children()[0].innerHTML
            },
            param = "year=" + args.time.year
                    + "&month=" + args.time.month
                    + "&product=" + args.product
                    + "&custId=" + me.parent().parent().prev().html()
                    + "&custName=" + me.prev().children()[0].innerHTML,
            style = "width=980,height=450,resizeable=yes,scrollbars=yes,top=100,left=100";
        window.open("#stat/perday/" + encodeURIComponent(param), "", style);
    },
    
    sendLog: function(e) {
        Util.sendCustLog(esui.get("Data1").isChecked() ? 1 : 2);
    },
    
    renderCustCpcCost: function(args, data) {
        //标题
        this.$(".title").html("客户消耗统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "CustCpcCost",
                type: args.time.type,
                date: args.time.date,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                qYear: args.time.qYear,
                q: args.time.q,
                queryType: args.queryType,
                query: args.query,
                product: args.product
            })
        });
        //表格
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(args.time.type != 1 ? this.TPL_TABLE_5 : this.TPL_TABLE_6, {
            sum: data.sum,
            data: data.data
        })));
        
        //按月情况下，分日查看
        if (args.time.type == 3) {
            this.$(".grid .ellipsis").after('<span class="perday" title="每日消耗统计"></span>');
            this.$(".topbar .download").hide();
            this.$(".topbar .download-btn").show();
            this.$(".topbar .all").attr({
                href: '../../download?'+ T.url.jsonToQuery({
                    reportName: "CustCpcCost",
                    type: args.time.type,
                    date: args.time.date,
                    start: args.time.start,
                    end: args.time.end,
                    year: args.time.year,
                    month: args.time.month,
                    qYear: args.time.qYear,
                    q: args.time.q,
                    queryType: args.queryType,
                    query: args.query,
                    product: args.product
                })
            });
            this.$(".topbar .byday").attr({
                href: '../../download?'+ T.url.jsonToQuery({
                    reportName: "CustCpcCostByDayTotal",
                    type: args.time.type,
                    date: args.time.date,
                    start: args.time.start,
                    end: args.time.end,
                    year: args.time.year,
                    month: args.time.month,
                    qYear: args.time.qYear,
                    q: args.time.q,
                    queryType: args.queryType,
                    query: args.query,
                    product: args.product
                })
            });
        }
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderCustCpcCostCompare: function(args, data) {
        //标题
        this.$(".title").html("客户消耗波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "CustCpcCostCompare",
                type: args.time.type,
                date: args.time.date,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                qYear: args.time.qYear,
                q: args.time.q,
                "lastTime.type": args.lastTime.type,
                "lastTime.date": args.lastTime.date,
                "lastTime.start": args.lastTime.start,
                "lastTime.end": args.lastTime.end,
                "lastTime.year": args.lastTime.year,
                "lastTime.month": args.lastTime.month,
                "lastTime.qYear": args.lastTime.qYear,
                "lastTime.q": args.lastTime.q,
                queryType: args.queryType,
                query: args.query,
                change: args.change,
                product: args.product
            })
        });
        //表格
        if (args.time.type != 1) { //非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_7, {
                sum: data.sum,
                data: data.data
            })));
        } else { //按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_8 : this.TPL_TABLE_8.replace(/环比/g, "周同比"), {
                sum: data.sum,
                data: data.data
            })));
        }
        
        Util.fixTable(this.$(".grid"));
    },
    
    TPL_TABLE_1: ['<table><tr>',
        '<th>客服名称</th><th>总消耗</th><th>计业绩消耗</th><th>不计业绩消耗</th><th>有消耗客户数</th>',
        '<th>户均总消耗</th><th>日均总消耗</th><th>日户均总消耗</th><th>点击数</th><th>总消耗点击均价</th></tr>',
        '<tr class="sum">',
        '<td class="text"><strong>总计</strong></td><td>{{sum.cost}}</td><td>{{sum.costAB}}</td><td>{{sum.costC}}</td><td>{{sum.custs}}</td><td>{{sum.costPerCust}}</td>',
        '<td>{{sum.costPerDay}}</td><td>{{sum.costPerCustPerDay}}</td><td>{{sum.click}}</td><td>{{sum.cpc}}</td></tr>',
        '{{#data}}<tr><td class="text">{{csName}}</td><td>{{cost}}</td><td>{{costAB}}</td><td>{{costC}}</td><td>{{custs}}</td><td>{{costPerCust}}</td>',
        '<td>{{costPerDay}}</td><td>{{costPerCustPerDay}}</td><td>{{click}}</td><td>{{cpc}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE_2: ['<table><tr>',
        '<th>客服名称</th><th>总消耗</th><th>计业绩消耗</th><th>不计业绩消耗</th><th>有消耗客户数</th>',
        '<th>户均总消耗</th><th>点击数</th><th>总消耗点击均价</th></tr>',
        '<tr class="sum">',
        '<td class="text"><strong>总计</strong></td><td>{{sum.cost}}</td><td>{{sum.costAB}}</td><td>{{sum.costC}}</td><td>{{sum.custs}}</td><td>{{sum.costPerCust}}</td>',
        '<td>{{sum.click}}</td><td>{{sum.cpc}}</td></tr>',
        '{{#data}}<tr><td class="text">{{csName}}</td><td>{{cost}}</td><td>{{costAB}}</td><td>{{costC}}</td><td>{{custs}}</td><td>{{costPerCust}}</td>',
        '<td>{{click}}</td><td>{{cpc}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE_3: ['<table><tr>',
        '<th rowspan="2">客服名称</th><th colspan="4">总消耗</th><th colspan="4">计业绩消耗</th><th colspan="4">不计业绩消耗</th><th colspan="4">有消耗客户数</th>',
        '<th colspan="4">户均总消耗</th><th colspan="4">日均总消耗</th><th colspan="4">日户均总消耗</th><th colspan="4">点击数</th><th colspan="4">总消耗点击均价</th></tr>',
        '<tr><th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th></tr>',
        '<tr class="sum">',
        '<td class="text"><strong>总计</strong></td>',
        '<td>{{sum.lastCost}}</td><td>{{sum.cost}}</td><td>{{sum.costSub}}</td><td>{{sum.costCompare}}</td>',
        '<td>{{sum.lastCostAB}}</td><td>{{sum.costAB}}</td><td>{{sum.costABSub}}</td><td>{{sum.costABCompare}}</td>',
        '<td>{{sum.lastCostC}}</td><td>{{sum.costC}}</td><td>{{sum.costCSub}}</td><td>{{sum.costCCompare}}</td>',
        '<td>{{sum.lastCusts}}</td><td>{{sum.custs}}</td><td>{{sum.custsSub}}</td><td>{{sum.custsCompare}}</td>',
        '<td>{{sum.lastCostPerCust}}</td><td>{{sum.costPerCust}}</td><td>{{sum.costPerCustSub}}</td><td>{{sum.costPerCustCompare}}</td>',
        '<td>{{sum.lastCostPerDay}}</td><td>{{sum.costPerDay}}</td><td>{{sum.costPerDaySub}}</td><td>{{sum.costPerDayCompare}}</td>',
        '<td>{{sum.lastCostPerCustPerDay}}</td><td>{{sum.costPerCustPerDay}}</td><td>{{sum.costPerCustPerDaySub}}</td><td>{{sum.costPerCustPerDayCompare}}</td>',
        '<td>{{sum.lastClick}}</td><td>{{sum.click}}</td><td>{{sum.clickSub}}</td><td>{{sum.clickCompare}}</td>',
        '<td>{{sum.lastCpc}}</td><td>{{sum.cpc}}</td><td>{{sum.cpcSub}}</td><td>{{sum.cpcCompare}}</td></tr>',
        '{{#data}}<tr><td class="text">{{csName}}</td>',
        '<td>{{lastCost}}</td><td>{{cost}}</td><td>{{costSub}}</td><td>{{costCompare}}</td>',
        '<td>{{lastCostAB}}</td><td>{{costAB}}</td><td>{{costABSub}}</td><td>{{costABCompare}}</td>',
        '<td>{{lastCostC}}</td><td>{{costC}}</td><td>{{costCSub}}</td><td>{{costCCompare}}</td>',
        '<td>{{lastCusts}}</td><td>{{custs}}</td><td>{{custsSub}}</td><td>{{custsCompare}}</td>',
        '<td>{{lastCostPerCust}}</td><td>{{costPerCust}}</td><td>{{costPerCustSub}}</td><td>{{costPerCustCompare}}</td>',
        '<td>{{lastCostPerDay}}</td><td>{{costPerDay}}</td><td>{{costPerDaySub}}</td><td>{{costPerDayCompare}}</td>',
        '<td>{{lastCostPerCustPerDay}}</td><td>{{costPerCustPerDay}}</td><td>{{costPerCustPerDaySub}}</td><td>{{costPerCustPerDayCompare}}</td>',
        '<td>{{lastClick}}</td><td>{{click}}</td><td>{{clickSub}}</td><td>{{clickCompare}}</td>',
        '<td>{{lastCpc}}</td><td>{{cpc}}</td><td>{{cpcSub}}</td><td>{{cpcCompare}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE_4: ['<table><tr>',
        '<th rowspan="2">客服名称</th><th colspan="4">总消耗</th><th colspan="4">计业绩消耗</th><th colspan="4">不计业绩消耗</th><th colspan="4">有消耗客户数</th>',
        '<th colspan="4">户均总消耗</th><th colspan="4">点击数</th><th colspan="4">总消耗点击均价</th></tr>',
        '<tr><th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th></tr>',
        '<tr class="sum">',
        '<td class="text"><strong>总计</strong></td>',
        '<td>{{sum.lastCost}}</td><td>{{sum.cost}}</td><td>{{sum.costSub}}</td><td>{{sum.costCompare}}</td>',
        '<td>{{sum.lastCostAB}}</td><td>{{sum.costAB}}</td><td>{{sum.costABSub}}</td><td>{{sum.costABCompare}}</td>',
        '<td>{{sum.lastCostC}}</td><td>{{sum.costC}}</td><td>{{sum.costCSub}}</td><td>{{sum.costCCompare}}</td>',
        '<td>{{sum.lastCusts}}</td><td>{{sum.custs}}</td><td>{{sum.custsSub}}</td><td>{{sum.custsCompare}}</td>',
        '<td>{{sum.lastCostPerCust}}</td><td>{{sum.costPerCust}}</td><td>{{sum.costPerCustSub}}</td><td>{{sum.costPerCustCompare}}</td>',
        '<td>{{sum.lastClick}}</td><td>{{sum.click}}</td><td>{{sum.clickSub}}</td><td>{{sum.clickCompare}}</td>',
        '<td>{{sum.lastCpc}}</td><td>{{sum.cpc}}</td><td>{{sum.cpcSub}}</td><td>{{sum.cpcCompare}}</td></tr>',
        '{{#data}}<tr><td class="text">{{csName}}</td>',
        '<td>{{lastCost}}</td><td>{{cost}}</td><td>{{costSub}}</td><td>{{costCompare}}</td>',
        '<td>{{lastCostAB}}</td><td>{{costAB}}</td><td>{{costABSub}}</td><td>{{costABCompare}}</td>',
        '<td>{{lastCostC}}</td><td>{{costC}}</td><td>{{costCSub}}</td><td>{{costCCompare}}</td>',
        '<td>{{lastCusts}}</td><td>{{custs}}</td><td>{{custsSub}}</td><td>{{custsCompare}}</td>',
        '<td>{{lastCostPerCust}}</td><td>{{costPerCust}}</td><td>{{costPerCustSub}}</td><td>{{costPerCustCompare}}</td>',
        '<td>{{lastClick}}</td><td>{{click}}</td><td>{{clickSub}}</td><td>{{clickCompare}}</td>',
        '<td>{{lastCpc}}</td><td>{{cpc}}</td><td>{{cpcSub}}</td><td>{{cpcCompare}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE_5: ['<table><tr>',
        '<th>客户ID</th><th>客户名称</th><th>客户账号</th><th>关联客服</th><th>关联销售</th><th>一级行业</th>',
        '<th>二级行业</th><th>总消耗</th><th>计业绩消耗</th><th>不计业绩消耗</th><th>日均总消耗</th><th>点击数</th><th>总消耗点击均价</th></tr>',
        '<tr class="sum">',
        '<td class="text" colspan="7"><strong>总计</strong></td><td>{{sum.cost}}</td><td>{{sum.costAB}}</td><td>{{sum.costC}}</td>',
        '<td>{{sum.costPerDay}}</td><td>{{sum.click}}</td><td>{{sum.cpc}}</td></tr>',
        '{{#data}}<tr><td class="text">{{custId}}</td><td class="text"><div style="width:310px"><div class="ellipsis" style="width:270px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></div></td>',
        '<td class="text">{{custEmail}}</td>',
        '<td class="text">{{custCs}}</td><td class="text">{{custOp}}</td><td class="text">{{firstTrade}}</td><td class="text">{{secondTrade}}</td>',
        '<td>{{cost}}</td><td>{{costAB}}</td><td>{{costC}}</td><td>{{costPerDay}}</td><td>{{click}}</td><td>{{cpc}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE_6: ['<table><tr>',
        '<th>客户ID</th><th>客户名称</th><th>客户账号</th><th>关联客服</th><th>关联销售</th><th>一级行业</th>',
        '<th>二级行业</th><th>总消耗</th><th>计业绩消耗</th><th>不计业绩消耗</th><th>点击数</th><th>总消耗点击均价</th></tr>',
        '<tr class="sum">',
        '<td class="text" colspan="7"><strong>总计</strong></td><td>{{sum.cost}}</td><td>{{sum.costAB}}</td><td>{{sum.costC}}</td>',
        '<td>{{sum.click}}</td><td>{{sum.cpc}}</td></tr>',
        '{{#data}}<tr><td class="text">{{custId}}</td><td class="text"><div style="width:310px"><div class="ellipsis" style="width:270px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></div></td>',
        '<td class="text">{{custEmail}}</td>',
        '<td class="text">{{custCs}}</td><td class="text">{{custOp}}</td><td class="text">{{firstTrade}}</td><td class="text">{{secondTrade}}</td>',
        '<td>{{cost}}</td><td>{{costAB}}</td><td>{{costC}}</td><td>{{click}}</td><td>{{cpc}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE_7: ['<table><tr>',
        '<th rowspan="2">客户ID</th><th rowspan="2">客户名称</th><th rowspan="2">客户账号</th><th rowspan="2">关联客服</th>',
        '<th rowspan="2">关联销售</th><th rowspan="2">一级行业</th><th rowspan="2">二级行业</th>',
        '<th colspan="4">总消耗</th><th colspan="4">计业绩消耗</th><th colspan="4">不计业绩消耗</th><th colspan="4">日均总消耗</th><th colspan="4">点击数</th><th colspan="4">总消耗点击均价</th></tr>',
        '<tr><th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th></tr>',
        '<tr class="sum">',
        '<td class="text" colspan="7"><strong>总计</strong></td>',
        '<td>{{sum.lastCost}}</td><td>{{sum.cost}}</td><td>{{sum.costSub}}</td><td>{{sum.costCompare}}</td>',
        '<td>{{sum.lastCostAB}}</td><td>{{sum.costAB}}</td><td>{{sum.costABSub}}</td><td>{{sum.costABCompare}}</td>',
        '<td>{{sum.lastCostC}}</td><td>{{sum.costC}}</td><td>{{sum.costCSub}}</td><td>{{sum.costCCompare}}</td>',
        '<td>{{sum.lastCostPerDay}}</td><td>{{sum.costPerDay}}</td><td>{{sum.costPerDaySub}}</td><td>{{sum.costPerDayCompare}}</td>',
        '<td>{{sum.lastClick}}</td><td>{{sum.click}}</td><td>{{sum.clickSub}}</td><td>{{sum.clickCompare}}</td>',
        '<td>{{sum.lastCpc}}</td><td>{{sum.cpc}}</td><td>{{sum.cpcSub}}</td><td>{{sum.cpcCompare}}</td></tr>',
        '{{#data}}<tr><td class="text">{{custId}}</td><td class="text"><div style="width:310px"><div class="ellipsis" style="width:270px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></div></td>',
        '<td class="text">{{custEmail}}</td>',
        '<td class="text">{{custCs}}</td><td class="text">{{custOp}}</td><td class="text">{{firstTrade}}</td><td class="text">{{secondTrade}}</td>',
        '<td>{{lastCost}}</td><td>{{cost}}</td><td>{{costSub}}</td><td>{{costCompare}}</td>',
        '<td>{{lastCostAB}}</td><td>{{costAB}}</td><td>{{costABSub}}</td><td>{{costABCompare}}</td>',
        '<td>{{lastCostC}}</td><td>{{costC}}</td><td>{{costCSub}}</td><td>{{costCCompare}}</td>',
        '<td>{{lastCostPerDay}}</td><td>{{costPerDay}}</td><td>{{costPerDaySub}}</td><td>{{costPerDayCompare}}</td>',
        '<td>{{lastClick}}</td><td>{{click}}</td><td>{{clickSub}}</td><td>{{clickCompare}}</td>',
        '<td>{{lastCpc}}</td><td>{{cpc}}</td><td>{{cpcSub}}</td><td>{{cpcCompare}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE_8: ['<table><tr>',
        '<th rowspan="2">客户ID</th><th rowspan="2">客户名称</th><th rowspan="2">客户账号</th><th rowspan="2">关联客服</th>',
        '<th rowspan="2">关联销售</th><th rowspan="2">一级行业</th><th rowspan="2">二级行业</th>',
        '<th colspan="4">总消耗</th><th colspan="4">计业绩消耗</th><th colspan="4">不计业绩消耗</th><th colspan="4">点击数</th><th colspan="4">总消耗点击均价</th></tr>',
        '<tr><th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th></tr>',
        '<tr class="sum">',
        '<td class="text" colspan="7"><strong>总计</strong></td>',
        '<td>{{sum.lastCost}}</td><td>{{sum.cost}}</td><td>{{sum.costSub}}</td><td>{{sum.costCompare}}</td>',
        '<td>{{sum.lastCostAB}}</td><td>{{sum.costAB}}</td><td>{{sum.costABSub}}</td><td>{{sum.costABCompare}}</td>',
        '<td>{{sum.lastCostC}}</td><td>{{sum.costC}}</td><td>{{sum.costCSub}}</td><td>{{sum.costCCompare}}</td>',
        '<td>{{sum.lastClick}}</td><td>{{sum.click}}</td><td>{{sum.clickSub}}</td><td>{{sum.clickCompare}}</td>',
        '<td>{{sum.lastCpc}}</td><td>{{sum.cpc}}</td><td>{{sum.cpcSub}}</td><td>{{sum.cpcCompare}}</td></tr>',
        '{{#data}}<tr><td class="text">{{custId}}</td><td class="text"><div style="width:310px"><div class="ellipsis" style="width:270px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></div></td>',
        '<td class="text">{{custEmail}}</td>',
        '<td class="text">{{custCs}}</td><td class="text">{{custOp}}</td><td class="text">{{firstTrade}}</td><td class="text">{{secondTrade}}</td>',
        '<td>{{lastCost}}</td><td>{{cost}}</td><td>{{costSub}}</td><td>{{costCompare}}</td>',
        '<td>{{lastCostAB}}</td><td>{{costAB}}</td><td>{{costABSub}}</td><td>{{costABCompare}}</td>',
        '<td>{{lastCostC}}</td><td>{{costC}}</td><td>{{costCSub}}</td><td>{{costCCompare}}</td>',
        '<td>{{lastClick}}</td><td>{{click}}</td><td>{{clickSub}}</td><td>{{clickCompare}}</td>',
        '<td>{{lastCpc}}</td><td>{{cpc}}</td><td>{{cpcSub}}</td><td>{{cpcCompare}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    showError: function(msg) {
        clearTimeout(this.timer);
        
        Agent.Widgets.MessageBox.show(msg);
        
        this.timer = setTimeout(function() {
            Agent.Widgets.MessageBox.hide();
        }, 5000);
    }
});
