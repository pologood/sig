/*
 * Agent View - ConsumeOverview 
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.ConsumeOverview = Backbone.View.extend({
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
        Agent.Widgets.TreeNav.destroy();
    },
    
    renderTopNav: function() {
        Agent.Widgets.TopNav.render(4);
    },
    
    renderTreeNav: function() {
        Agent.Widgets.TreeNav = new Agent.Views.TreeNav(1, 0, 0);
    },
    
    pageRendered: false,
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".report-switch").html($.Mustache.render("tpl-data-type"));
        this.$(".query-form").html($.Mustache.render("tpl-query-form-wm") + $.Mustache.render("tpl-query-form-compare") + $.Mustache.render("tpl-query-form-product"));
        
        //上次查询参数
        this.lastAction = null;
        //当前查询参数
        this.actionIndex = 0;
        this.action = ["CostStatAction.getAllCpcCost", "CostStatAction.getAllCpcCostCompare"];
        this.overviewArgsOfWM = null;
        this.overviewArgsOfDWMQ = null;
        this.contrastArgsOfDWMQ = null;
        
        //初始化日历相关元素
        Agent.Calendar.init(this, "current");
        
        /*
         * 初始化其他的元素
         */
        //选择整体趋势
        esui.get("Data1").setChecked(true);
        
        //绑定事件
        this.bindEsui();
        
        //自动按默认条件查询
        this.query({
            method: this.action[0],
            args: this.overviewArgsOfWM
        });
    },
    
    bindEsui: function() {
        var view = this;
        
        //切换报告
        esui.get("Data1").onclick = function(value, item) {
            $("#Right .block11").show();
            $("#Right .block2").hide();
            view.actionIndex = 0;
        };
        esui.get("Data2").onclick = function(value, item) {
            $("#Right .block11").hide();
            $("#Right .block2").show();
            view.actionIndex = 1;
        };
    },
    
    queryAll: function() {
        //重新渲染页码
        this.overviewArgsOfWM.pageNo = 1;
        this.contrastArgsOfDWMQ.pageNo = 1;
        this.pageRendered = false;
        //按当前查询区域的状态查询
        this.query({
            method: this.action[this.actionIndex],
            args: this.actionIndex == 0 ? this.overviewArgsOfWM : this.contrastArgsOfDWMQ
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
            
            //表格
            if (this.lastAction.method == "CostStatAction.getAllCpcCost") {
                this.renderAllCpcCost(args, data);
            }
            if (this.lastAction.method == "CostStatAction.getAllCpcCostCompare") {
                this.renderAllCpcCostCompare(args, data);
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
    
    renderAllCpcCost: function(args, data) {
        //标题
        this.$(".title").html("消耗总体统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "AllCpcCost",
                type: args.time.type,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                product: args.product
            })
        });
        //表格
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_1, {
            sum: data.sum,
            data: data.data
        })));
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderAllCpcCostCompare: function(args, data) {
        //标题
        this.$(".title").html("消耗总体波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "AllCpcCostCompare",
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
                product: args.product
            })
        });
        //表格
        if (args.time.type != 1) { //非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_2, {
                data: data.data
            })));
        } else { //按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_3 : this.TPL_TABLE_3.replace(/环比/g, "周同比"), {
                data: data.data
            })));
        }
        
        Util.fixTable(this.$(".grid"));
    },
    
    TPL_TABLE_1: ['<table><tr>',
        '<th width="150">时间</th><th>总消耗</th><th>计业绩消耗</th><th>不计业绩消耗</th><th>有消耗客户数</th><th width="100">户均总消耗</th><th>点击数</th>',
        '<th>总消耗点击均价</th></tr>',
        '<tr class="sum">',
        '<td class="text"><strong>总计</strong></td><td>{{sum.cost}}</td><td>{{sum.costAB}}</td><td>{{sum.costC}}</td>',
        '<td>{{sum.custs}}</td><td>{{sum.costPerCust}}</td>',
        '<td>{{sum.click}}</td><td>{{sum.cpc}}</td></tr>',
        '{{#data}}<tr><td class="text">{{date}}</td><td>{{cost}}</td><td>{{costAB}}</td><td>{{costC}}</td>',
        '<td>{{custs}}</td><td>{{costPerCust}}</td><td>{{click}}</td><td>{{cpc}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE_2: ['<table><tr>',
        '<th colspan="4">总消耗</th>',
        '<th colspan="4">计业绩消耗</th>',
        '<th colspan="4">不计业绩消耗</th>',
        '<th colspan="4">有消耗客户数</th>',
        '<th colspan="4">户均总消耗</th>',
        '<th colspan="4">日均总消耗</th>',
        '<th colspan="4">日户均总消耗</th>',
        '<th colspan="4">点击数</thd>',
        '<th colspan="4">总消耗点击均价</th></tr>',
        '<tr><th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th></tr>',
        '<tr><td>{{data.lastCost}}</td><td>{{data.cost}}</td><td>{{data.costSub}}</td><td>{{data.costCompare}}</td>',
        '<td>{{data.lastCostAB}}</td><td>{{data.costAB}}</td><td>{{data.costABSub}}</td><td>{{data.costABCompare}}</td>',
        '<td>{{data.lastCostC}}</td><td>{{data.costC}}</td><td>{{data.costCSub}}</td><td>{{data.costCCompare}}</td>',
        '<td>{{data.lastCusts}}</td><td>{{data.custs}}</td><td>{{data.custsSub}}</td><td>{{data.custsCompare}}</td>',
        '<td>{{data.lastCostPerCust}}</td><td>{{data.costPerCust}}</td><td>{{data.costPerCustSub}}</td><td>{{data.costPerCustCompare}}</td>',
        '<td>{{data.lastCostPerDay}}</td><td>{{data.costPerDay}}</td><td>{{data.costPerDaySub}}</td><td>{{data.costPerDayCompare}}</td>',
        '<td>{{data.lastCostPerCustPerDay}}</td><td>{{data.costPerCustPerDay}}</td><td>{{data.costPerCustPerDaySub}}</td><td>{{data.costPerCustPerDayCompare}}</td>',
        '<td>{{data.lastClick}}</td><td>{{data.click}}</td><td>{{data.clickSub}}</td><td>{{data.clickCompare}}</td>',
        '<td>{{data.lastCpc}}</td><td>{{data.cpc}}</td><td>{{data.cpcSub}}</td><td>{{data.cpcCompare}}</td>',
        '</tr></table>'
    ].join(""),
    
    TPL_TABLE_3: ['<table><tr>',
        '<th colspan="4">总消耗</th>',
        '<th colspan="4">计业绩消耗</th>',
        '<th colspan="4">不计业绩消耗</th>',
        '<th colspan="4">有消耗客户数</th>',
        '<th colspan="4">户均总消耗</th>',
        '<th colspan="4">点击数</thd>',
        '<th colspan="4">总消耗点击均价</th></tr>',
        '<tr><th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th></tr>',
        '<tr><td>{{data.lastCost}}</td><td>{{data.cost}}</td><td>{{data.costSub}}</td><td>{{data.costCompare}}</td>',
        '<td>{{data.lastCostAB}}</td><td>{{data.costAB}}</td><td>{{data.costABSub}}</td><td>{{data.costABCompare}}</td>',
        '<td>{{data.lastCostC}}</td><td>{{data.costC}}</td><td>{{data.costCSub}}</td><td>{{data.costCCompare}}</td>',
        '<td>{{data.lastCusts}}</td><td>{{data.custs}}</td><td>{{data.custsSub}}</td><td>{{data.custsCompare}}</td>',
        '<td>{{data.lastCostPerCust}}</td><td>{{data.costPerCust}}</td><td>{{data.costPerCustSub}}</td><td>{{data.costPerCustCompare}}</td>',
        '<td>{{data.lastClick}}</td><td>{{data.click}}</td><td>{{data.clickSub}}</td><td>{{data.clickCompare}}</td>',
        '<td>{{data.lastCpc}}</td><td>{{data.cpc}}</td><td>{{data.cpcSub}}</td><td>{{data.cpcCompare}}</td>',
        '</tr></table>'
    ].join("")
});
