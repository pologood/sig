/*
 * Agent View - IncrementOverview
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.IncrementOverview = Backbone.View.extend({
    el: $("#Right"),

    events: {
        "click a.query": "queryAll",
        "click .grid a": "openCustPage"
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
        Agent.Widgets.TreeNav = new Agent.Views.TreeNav(1, 2, 0);
    },

    pageRendered: false,

    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();

        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".report-switch").html($.Mustache.render("tpl-report-type2") + $.Mustache.render("tpl-data-type"));
        this.$(".query-form").html($.Mustache.render("tpl-query-form-wm") + $.Mustache.render("tpl-query-form-compare")
            + $.Mustache.render("tpl-query-form-product") + $.Mustache.render("tpl-query-form-duration") + $.Mustache.render("tpl-query-form-duration-compare"));
        $(this.$(".block11 .time")[1]).append('<span class="toggle-date" id="ToggleDate1"></span>');
        $(this.$(".block2 .time")[2]).append('<span class="toggle-date" id="ToggleDate2"></span>');

        //上次查询参数
        this.lastAction = null;
        //当前查询参数
        this.actionIndex = 0;
        this.action = ["CostStatAction.getAddCpcCost",
                       "CostStatAction.getAddCpcCostCompare",
                       "NewCustomerStatAction.getNewCustomerStat",
                       "NewCustomerStatAction.getNewCustomerStatCompare",
                       "NewCustomerOnlineStatAction.getNewCustomerOnline",
                       "NewCustomerOnlineStatAction.getNewCustomerOnlineCompare"];
        this.overviewArgsOfWM = null;
        this.overviewArgsOfDWMQ = null;
        this.contrastArgsOfDWMQ = null;

        //初始化日历相关元素
        Agent.Calendar.init(this);
        
        /*
         * 初始化其他的元素
         */
        //选择整体趋势
        esui.get("Data1").setChecked(true);
        //选择消耗分析
        esui.get("Report1").setChecked(true);
        //绑定事件
        this.bindEsui();

        //自动按默认条件查询
        var args = this.overviewArgsOfWM;
        
        if (T.url.getQueryValue(query, "actionindex") == "3") {
            this.actionIndex = 2;
            args = this.overviewArgsOfWM;
            esui.get("Report2").setChecked(true);
            $("#Right .block9").hide();
            $("#ToggleDate1").hide();
        }
        
        this.query({
            method: this.action[this.actionIndex],
            args: args
        });
    },

    hideDuration: function() {
        $("#DurationCal1").hide();
        $("#DurationCal2").hide();
        $("#ToggleDate1").removeClass("toggle-date-show");
        $("#ToggleDate2").removeClass("toggle-date-show");
    },

    bindEsui: function() {
        var view = this;

        //切换报告
        esui.get("Report1").onclick = function(value, item) {
            if(esui.get("Data1").isChecked()) {
                $("#Right .block11").show();
                $("#Right .block2").hide();
                view.actionIndex = 0;
            } else {
                $("#Right .block11").hide();
                $("#Right .block2").show();
                view.actionIndex = 1;
            }
            $("#Right .block9").show();
            view.hideDuration();
            $("#ToggleDate1").show();
            $("#ToggleDate2").show();
        };
        esui.get("Report2").onclick = function(value, item) {
            if(esui.get("Data1").isChecked()) {
                $("#Right .block11").show();
                $("#Right .block2").hide();
                view.actionIndex = 2;
            } else {
                $("#Right .block11").hide();
                $("#Right .block2").show();
                view.actionIndex = 3;
            }
            $("#Right .block9").hide();
            view.hideDuration();
            $("#ToggleDate1").hide();
            $("#ToggleDate2").hide();
        };
        esui.get("Report3").onclick = function(value, item) {
            if(esui.get("Data1").isChecked()) {
                $("#Right .block11").show();
                $("#Right .block2").hide();
                view.actionIndex = 4;
            } else {
                $("#Right .block11").hide();
                $("#Right .block2").show();
                view.actionIndex = 5;
            }
            $("#Right .block9").hide();
            view.hideDuration();
            $("#ToggleDate1").hide();
            $("#ToggleDate2").hide();
        };
        esui.get("Data1").onclick = function(value, item) {
            if(esui.get("Report1").isChecked()) {
                $("#Right .block11").show();
                $("#Right .block2").hide();
                view.actionIndex = 0;
            } else if(esui.get("Report2").isChecked()) {
                $("#Right .block11").show();
                $("#Right .block2").hide();
                view.actionIndex = 2;
            } else {
                $("#Right .block11").show();
                $("#Right .block2").hide();
                view.actionIndex = 4;
            }
            view.hideDuration();
        };
        esui.get("Data2").onclick = function(value, item) {
            if(esui.get("Report1").isChecked()) {
                $("#Right .block11").hide();
                $("#Right .block2").show();
                view.actionIndex = 1;
            } else if(esui.get("Report2").isChecked()) {
                $("#Right .block11").hide();
                $("#Right .block2").show();
                view.actionIndex = 3;
            } else {
                $("#Right .block11").hide();
                $("#Right .block2").show();
                view.actionIndex = 5;
            }
            view.hideDuration();
        };

        $("#ToggleDate1").click(function() {
            $("#DurationCal1").toggle(200);
            $(this).toggleClass("toggle-date-show");
        });
        $("#ToggleDate2").click(function() {
            $("#DurationCal2").toggle(200);
            $(this).toggleClass("toggle-date-show");
        });
    },

    queryAll: function() {
        //重新渲染页码
        this.overviewArgsOfWM.pageNo = 1;
        this.contrastArgsOfDWMQ.pageNo = 1;
        this.pageRendered = false;
        //按当前查询区域的状态查询
        var args;
        switch (this.actionIndex) {
            case 0:
                args = this.overviewArgsOfWM;
                break;
            case 1:
                args = this.contrastArgsOfDWMQ;
                break;
            case 2:
                args = this.overviewArgsOfWM;
                break;
            case 3:
                args = this.contrastArgsOfDWMQ;
                break;
            case 4:
                args = this.overviewArgsOfWM;
                break;
            case 5:
                args = this.contrastArgsOfDWMQ;
        }
        this.query({
            method: this.action[this.actionIndex],
            args: args
        });
    },

    query: function(param) {
        this.model.getData(param.method, param.args);
    },
    
    openCustPage: function(e) {
        Util.stopDefault(e);
        Util.openCustPage($(e.target).attr('param'));
    },
    
    renderTable: function(model, data) {
        this.lastAction = model.lastAction;
        this.$(".result").show();
        if(data.data == null || data.data.length == 0) {//无数据
            this.$(".result .info").show();
            this.$(".result .data").hide();
        } else {
            this.$(".result .info").hide();
            this.$(".result .data").show();
            var args = this.lastAction.args;

            if(!data.rowCount)
                data.rowCount = 1;

            //表格
            if(this.lastAction.method == "CostStatAction.getAddCpcCost") {
                this.renderAddCpcCost(args, data);
            }
            if(this.lastAction.method == "CostStatAction.getAddCpcCostCompare") {
                this.renderAddCpcCostCompare(args, data);
            }
            if(this.lastAction.method == "NewCustomerStatAction.getNewCustomerStat") {
                this.renderNewAccountStat(args, data);
            }
            if(this.lastAction.method == "NewCustomerStatAction.getNewCustomerStatCompare") {
                this.renderNewAccountStatCompare(args, data);
            }
            if(this.lastAction.method == "NewCustomerOnlineStatAction.getNewCustomerOnline") {
                this.renderNewCustomerOnline(args, data);
            }
            if(this.lastAction.method == "NewCustomerOnlineStatAction.getNewCustomerOnlineCompare") {
                this.renderNewCustomerOnlineCompare(args, data);
            }

            //页码
            if(!this.pageRendered) {
                var total = Math.ceil(data.rowCount / esui.get("PageSize").value), pager = esui.get("PageNo");
                pager.total = total;
                pager.page = 0;
                pager.render();
                this.pageRendered = true;
            }

            //总条数
            this.$(".row-count").html("共 " + data.rowCount + " 条");
        }
    },

    renderAddCpcCost: function(args, data) {
        //标题
        this.$(".title").html("增量消耗分析统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "AddCpcCost",
                type: args.time.type,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                curAddExistDate: args.curAddExistDate,
                lastAddExistDate: args.lastAddExistDate,
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

    renderAddCpcCostCompare: function(args, data) {
        //标题
        this.$(".title").html("增量消耗分析波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "AddCpcCostCompare",
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
                curAddExistDate: args.curAddExistDate,
                lastAddExistDate: args.lastAddExistDate,
                product: args.product
            })
        });
        //表格
        if(args.time.type != 1) {//非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_2_1, {
                data: data.data
            })));
        } else {//按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_2 : this.TPL_TABLE_2.replace(/环比/g, "周同比"), {
                data: data.data
            })));
        }

        Util.fixTable(this.$(".grid"));
    },

    renderNewAccountStat: function(args, data) {
        //标题
        this.$(".title").html("新开客户和入资分析统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerStat",
                type: args.time.type,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month
            })
        });
        
        //表格
        var params = {
            customerInfoType: 1,
            dimType: 1
        };
        var thisargs = Util.toUrl(args, params, 1, 1);
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_3, {
            sum: data.sum,
            data: data.data,
            args: thisargs
        })));

        Util.fixTable(this.$(".grid"));
    },

    renderNewAccountStatCompare: function(args, data) {
        //标题
        this.$(".title").html("新开客户和入资分析波动统计");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerStatCompare",
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
                "lastTime.q": args.lastTime.q
            })
        });

        var params = {
            customerInfoType: 1,
            dimType: 1
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        var lastargs = Util.toUrl(args, params, 2, 2);
        //表格
        if(args.time.type != 1) {//非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_4, {
                data: data.data,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        } else {//按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_4 : this.TPL_TABLE_4.replace(/环比/g, "周同比"), {
                data: data.data,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        }

        Util.fixTable(this.$(".grid"));
    },

    renderNewCustomerOnline: function(args, data) {
        //标题
        this.$(".title").html("客户上线情况统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerOnline",
                type: args.time.type,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month
            })
        });
        
        var params = {
            customerInfoType: 1,
            dimType: 1
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        //表格
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_5, {
            sum: data.sum,
            data: data.data,
            args: thisargs
        })));

        Util.fixTable(this.$(".grid"));
    },

    renderNewCustomerOnlineCompare: function(args, data) {
        //标题
        this.$(".title").html("客户上线情况波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerOnlineCompare",
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
                "lastTime.q": args.lastTime.q
            })
        });
        
        var params = {
            customerInfoType: 1,
            dimType: 1
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        var lastargs = Util.toUrl(args, params, 2, 2);
        //表格
        if(args.time.type != 1) {//非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_6, {
                data: data.data,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        } else {//按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_6 : this.TPL_TABLE_6.replace(/环比/g, "周同比"), {
                data: data.data,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        }

        Util.fixTable(this.$(".grid"));
    },

    //增量消耗分析统计报告
    TPL_TABLE_1: ['<table><tr>',
        '<th colspan="1" rowspan="2">时间</th>', '<th colspan="3">消耗</th>', '<th colspan="3">有消耗客户数</th>', '<th colspan="3">户均消耗</th>',
        '<th colspan="3">点击数</th>', '<th colspan="3">点击均价</th></tr>', '<tr>', '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>', '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>', '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th></tr>',
        
        '<tr class="sum"><td class="text"><strong>总计</strong></td>', '<td>{{sum.cost}}</td><td>{{sum.costCommon}}</td><td>{{sum.costB}}</td>',
        '<td>{{sum.custs}}</td><td>{{sum.custsCommon}}</td><td>{{sum.custsCustB}}</td>',
        '<td>{{sum.costPerCust}}</td><td>{{sum.costPerCustCommon}}</td><td>{{sum.costPerCustB}}</td>',
        '<td>{{sum.click}}</td><td>{{sum.clickCommon}}</td><td>{{sum.clickB}}</td>',
        '<td>{{sum.cpc}}</td><td>{{sum.cpcCommon}}</td><td>{{sum.cpcB}}</td></tr>',
        
        '{{#data}}<tr><td class="text">{{date}}</td><td>{{cost}}</td><td>{{costCommon}}</td><td>{{costB}}</td>',
        '<td>{{custs}}</td><td>{{custsCommon}}</td><td>{{custsCustB}}</td>',
        '<td>{{costPerCust}}</td><td>{{costPerCustCommon}}</td><td>{{costPerCustB}}</td>',
        '<td>{{click}}</td><td>{{clickCommon}}</td><td>{{clickB}}</td>',
        '<td>{{cpc}}</td><td>{{cpcCommon}}</td><td>{{cpcB}}</td></tr>{{/data}}',
        '</table>'].join(""),

    //增量消耗分析波动统计报告
    TPL_TABLE_2_1: ['<table><tr>',
        '<th colspan="12">消耗</th>', '<th colspan="12">有消耗客户数</th>', '<th colspan="12">户均消耗</th><th colspan="12">日均消耗</th><th colspan="12">日户均消耗</th>', '<th colspan="12">点击数</th>',
        '<th colspan="12">点击均价</th></tr>', '<tr><th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th></tr>',
        '<tr>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '</tr>','<tr>',
        //消耗
        '<td>{{data.lastCost}}</td><td>{{data.cost}}</td><td>{{data.costSub}}</td><td>{{data.costCompare}}</td>',
        '<td>{{data.lastCostCommon}}</td><td>{{data.costCommon}}</td><td>{{data.costCommonSub}}</td><td>{{data.costCommonCompare}}</td>',
        '<td>{{data.lastCostB}}</td><td>{{data.costB}}</td><td>{{data.costBSub}}</td><td>{{data.costBCompare}}</td>',
        //有消耗客户数
        '<td>{{data.lastCusts}}</td><td>{{data.custs}}</td><td>{{data.custsSub}}</td><td>{{data.custsCompare}}</td>',
        '<td>{{data.lastCustsCommon}}</td><td>{{data.custsCommon}}</td><td>{{data.custsCommonSub}}</td><td>{{data.custsCommonCompare}}</td>',
        '<td>{{data.lastCustsB}}</td><td>{{data.custsB}}</td><td>{{data.custsBSub}}</td><td>{{data.custsBCompare}}</td>',
        //户均消耗数
        '<td>{{data.lastCostPerCust}}</td><td>{{data.costPerCust}}</td><td>{{data.costPerCustSub}}</td><td>{{data.costPerCustCompare}}</td>',
        '<td>{{data.lastCostPerCustCommon}}</td><td>{{data.costPerCustCommon}}</td><td>{{data.costPerCustCommonSub}}</td><td>{{data.costPerCustCommonCompare}}</td>',
        '<td>{{data.lastCostPerCustB}}</td><td>{{data.costPerCustB}}</td><td>{{data.costPerCustBSub}}</td><td>{{data.costPerCustBCompare}}</td>',
        //日均消耗数
        '<td>{{data.lastCostPerDay}}</td><td>{{data.costPerDay}}</td><td>{{data.costPerDaySub}}</td><td>{{data.costPerDayCompare}}</td>',
        '<td>{{data.lastCostPerDayCommon}}</td><td>{{data.costPerDayCommon}}</td><td>{{data.costPerDayCommonSub}}</td><td>{{data.costPerDayCommonCompare}}</td>',
        '<td>{{data.lastCostPerDayB}}</td><td>{{data.costPerDayB}}</td><td>{{data.costPerDayBSub}}</td><td>{{data.costPerDayBCompare}}</td>',
        //日户均消耗数
        '<td>{{data.lastCostPerCustPerDay}}</td><td>{{data.costPerCustPerDay}}</td><td>{{data.costPerCustPerDaySub}}</td><td>{{data.costPerCustPerDayCompare}}</td>',
        '<td>{{data.lastCostPerCustPerDayCommon}}</td><td>{{data.costPerCustPerDayCommon}}</td><td>{{data.costPerCustPerDayCommonSub}}</td><td>{{data.costPerCustPerDayCommonCompare}}</td>',
        '<td>{{data.lastCostPerCustPerDayB}}</td><td>{{data.costPerCustPerDayB}}</td><td>{{data.costPerCustPerDayBSub}}</td><td>{{data.costPerCustPerDayBCompare}}</td>',
        //点击数
        '<td>{{data.lastClick}}</td><td>{{data.click}}</td><td>{{data.clickSub}}</td><td>{{data.clickCompare}}</td>',
        '<td>{{data.lastClickCommon}}</td><td>{{data.clickCommon}}</td><td>{{data.clickCommonSub}}</td><td>{{data.clickCommonCompare}}</td>',
        '<td>{{data.lastClickB}}</td><td>{{data.clickB}}</td><td>{{data.clickBSub}}</td><td>{{data.clickBCompare}}</td>',
        //点击均价
        '<td>{{data.lastCpc}}</td><td>{{data.cpc}}</td><td>{{data.cpcSub}}</td><td>{{data.cpcCompare}}</td>',
        '<td>{{data.lastCpcCommon}}</td><td>{{data.cpcCommon}}</td><td>{{data.cpcCommonSub}}</td><td>{{data.cpcCommonCompare}}</td>',
        '<td>{{data.lastCpcB}}</td><td>{{data.cpcB}}</td><td>{{data.cpcBSub}}</td><td>{{data.cpcBCompare}}</td>', '</tr>',
        '</table>'].join(""),
    
    TPL_TABLE_2: ['<table><tr>',
        '<th colspan="12">消耗</th>', '<th colspan="12">有消耗客户数</th>', '<th colspan="12">户均消耗</th>', '<th colspan="12">点击数</th>',
        '<th colspan="12">点击均价</th></tr>', '<tr><th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th></tr>',
        '<tr>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '</tr>','<tr>',
        //消耗
        '<td>{{data.lastCost}}</td><td>{{data.cost}}</td><td>{{data.costSub}}</td><td>{{data.costCompare}}</td>',
        '<td>{{data.lastCostCommon}}</td><td>{{data.costCommon}}</td><td>{{data.costCommonSub}}</td><td>{{data.costCommonCompare}}</td>',
        '<td>{{data.lastCostB}}</td><td>{{data.costB}}</td><td>{{data.costBSub}}</td><td>{{data.costBCompare}}</td>',
        //有消耗客户数
        '<td>{{data.lastCusts}}</td><td>{{data.custs}}</td><td>{{data.custsSub}}</td><td>{{data.custsCompare}}</td>',
        '<td>{{data.lastCustsCommon}}</td><td>{{data.custsCommon}}</td><td>{{data.custsCommonSub}}</td><td>{{data.custsCommonCompare}}</td>',
        '<td>{{data.lastCustsB}}</td><td>{{data.custsB}}</td><td>{{data.custsBSub}}</td><td>{{data.custsBCompare}}</td>',
        //户均消耗数
        '<td>{{data.lastCostPerCust}}</td><td>{{data.costPerCust}}</td><td>{{data.costPerCustSub}}</td><td>{{data.costPerCustCompare}}</td>',
        '<td>{{data.lastCostPerCustCommon}}</td><td>{{data.costPerCustCommon}}</td><td>{{data.costPerCustCommonSub}}</td><td>{{data.costPerCustCommonCompare}}</td>',
        '<td>{{data.lastCostPerCustB}}</td><td>{{data.costPerCustB}}</td><td>{{data.costPerCustBSub}}</td><td>{{data.costPerCustBCompare}}</td>',
        //点击数
        '<td>{{data.lastClick}}</td><td>{{data.click}}</td><td>{{data.clickSub}}</td><td>{{data.clickCompare}}</td>',
        '<td>{{data.lastClickCommon}}</td><td>{{data.clickCommon}}</td><td>{{data.clickCommonSub}}</td><td>{{data.clickCommonCompare}}</td>',
        '<td>{{data.lastClickB}}</td><td>{{data.clickB}}</td><td>{{data.clickBSub}}</td><td>{{data.clickBCompare}}</td>',
        //点击均价
        '<td>{{data.lastCpc}}</td><td>{{data.cpc}}</td><td>{{data.cpcSub}}</td><td>{{data.cpcCompare}}</td>',
        '<td>{{data.lastCpcCommon}}</td><td>{{data.cpcCommon}}</td><td>{{data.cpcCommonSub}}</td><td>{{data.cpcCommonCompare}}</td>',
        '<td>{{data.lastCpcB}}</td><td>{{data.cpcB}}</td><td>{{data.cpcBSub}}</td><td>{{data.cpcBCompare}}</td>', '</tr>',
        '</table>'].join(""),

    //新开客户和入资分析统计报告
    TPL_TABLE_3: ['<table><tr>',
        '<th colspan="1" rowspan="2">时间</th>', '<th colspan="4">新开户数</th>', '<th colspan="3">首次入资金额</th>',
        '<th colspan="3">户均首次入资金额</th></tr>', '<tr>', '<th>开户总数</th><th>有效开户数</th><th>无效开户数(特殊行业)</th><th>无效开户数(其他)</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>', '<th>所有行业</th><th>正常行业</th><th>特殊行业</th></tr>',
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td><a href="#" param="{{args}}&effectType=1">{{sum.newCusts}}</a></td><td><a href="#" param="{{args}}&effectType=2">{{sum.newCustsEffect}}</a></td><td><a href="#" param="{{args}}&effectType=3">{{sum.newCustsB}}</a></td><td><a href="#" param="{{args}}&effectType=4">{{sum.newCustsCommon}}</a></td>',
        '<td>{{sum.newInvest}}</td><td>{{sum.newInvestCommon}}</td><td>{{sum.newInvestB}}</td>',
        '<td>{{sum.newInvestPerCust}}</td><td>{{sum.newInvestPerCustCommon}}</td><td>{{sum.newInvestPerCustB}}</td></tr>',
        
        '{{#data}}<tr><td class="text">{{date}}</td>', '<td><a href="#" param="customerInfoType=1&effectType=1&type=1&date={{date}}">{{newCusts}}</a></td><td><a href="#" param="customerInfoType=1&effectType=2&type=1&date={{date}}">{{newCustsEffect}}</a></td><td><a href="#" param="customerInfoType=1&effectType=3&type=1&date={{date}}">{{newCustsB}}</a></td><td><a href="#" param="customerInfoType=1&effectType=4&type=1&date={{date}}">{{newCustsCommon}}</a></td>',
        '<td>{{newInvest}}</td><td>{{newInvestCommon}}</td><td>{{newInvestB}}</td>',
        '<td>{{newInvestPerCust}}</td><td>{{newInvestPerCustCommon}}</td><td>{{newInvestPerCustB}}</td></tr>{{/data}}',
        '</table>'].join(""),

    //新开客户和入资分析波动统计
    TPL_TABLE_4: ['<table><tr>', '<th colspan="16">新开户数</th>', '<th colspan="12">首次入资金额</th>', '<th colspan="12">户均首次入资金额</th></tr>',
        '<tr><th colspan="4">开户总数</th><th colspan="4">有效开户数</th><th colspan="4">无效开户数(特殊行业)</th><th colspan="4">无效开户数(其他)</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th></tr>',
        '<tr>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>', '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '</tr>', '<tr>',
        
        //新开户数
        '<td><a href="#" param="{{lastargs}}&effectType=1">{{data.lastNewCusts}}</a></td><td><a href="#" param="{{thisargs}}&effectType=1">{{data.newCusts}}</a></td><td>{{data.newCustsSub}}</td><td>{{data.newCustsCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=2">{{data.lastNewCustsEffect}}</a></td><td><a href="#" param="{{thisargs}}&effectType=2">{{data.newCustsEffect}}</a></td><td>{{data.newCustsEffectSub}}</td><td>{{data.newCustsEffectCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=3">{{data.lastNewCustsB}}</a></td><td><a href="#" param="{{thisargs}}&effectType=3">{{data.newCustsB}}</a></td><td>{{data.newCustsBSub}}</td><td>{{data.newCustsBCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=4">{{data.lastNewCustsCommon}}</a></td><td><a href="#" param="{{thisargs}}&effectType=4">{{data.newCustsCommon}}</a></td><td>{{data.newCustsCommonSub}}</td><td>{{data.newCustsCommonCompare}}</td>',
        
        //首次入资金额
        '<td>{{data.lastNewInvest}}</td><td>{{data.newInvest}}</td><td>{{data.newInvestSub}}</td><td>{{data.newInvestCompare}}</td>',
        '<td>{{data.lastNewInvestCommon}}</td><td>{{data.newInvestCommon}}</td><td>{{data.newInvestCommonSub}}</td><td>{{data.newInvestCommonCompare}}</td>',
        '<td>{{data.lastNewInvestB}}</td><td>{{data.newInvestB}}</td><td>{{data.newInvestBSub}}</td><td>{{data.newInvestBCompare}}</td>',
        //户均首次入资金额
        '<td>{{data.lastNewInvestPerCust}}</td><td>{{data.newInvestPerCust}}</td><td>{{data.newInvestPerCustSub}}</td><td>{{data.newInvestPerCustCompare}}</td>',
        '<td>{{data.lastNewInvestPerCustCommon}}</td><td>{{data.newInvestPerCustCommon}}</td><td>{{data.newInvestPerCustCommonSub}}</td><td>{{data.newInvestPerCustCommonCompare}}</td>',
        '<td>{{data.lastNewInvestPerCustB}}</td><td>{{data.newInvestPerCustB}}</td><td>{{data.newInvestPerCustBSub}}</td><td>{{data.newInvestPerCustBCompare}}</td>', '</tr>', '</table>'].join(""),

    //客户上线情况统计报告
    TPL_TABLE_5: ['<table><tr>', '<th colspan="1"></th>', '<th colspan="3">新开户数</th>', '<th colspan="3">新开有消耗客户数</th>',
        '<th colspan="3">新开无消耗客户数</th></tr>', '<tr><th>日期</th><th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th>',
        '<th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th>',
        '<th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th></tr>',
        //总体
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td><a href="#" param="{{args}}&tradeType=1">{{sum.newCusts}}</a></td><td><a href="#" param="{{args}}&tradeType=2">{{sum.newCustsCommon}}</a></td><td><a href="#" param="{{args}}&tradeType=3">{{sum.newCustsB}}</a></td>',
        '<td>{{sum.newCostCusts}}</td><td>{{sum.newCostCustsCommon}}</td><td>{{sum.newCostCustsB}}</td>',
        '<td>{{sum.newNoCostCusts}}</td><td>{{sum.newNoCostCustsCommon}}</td><td>{{sum.newNoCostCustsB}}</td></tr>',
        
        '{{#data}}<tr><td class="text">{{date}}</td>',
        //按日期统计
        '<td><a href="#" param="customerInfoType=1&tradeType=1&type=1&date={{date}}">{{newCusts}}</a></td><td><a href="#" param="customerInfoType=1&type=1&tradeType=2&date={{date}}">{{newCustsCommon}}</a></td><td><a href="#" param="customerInfoType=1&type=1&tradeType=3&date={{date}}">{{newCustsB}}</a></td>',
        '<td>{{newCostCusts}}</td><td>{{newCostCustsCommon}}</td><td>{{newCostCustsB}}</td>',
        '<td>{{newNoCostCusts}}</td><td>{{newNoCostCustsCommon}}</td><td>{{newNoCostCustsB}}</td></tr>',
        '</tr>{{/data}}', '</table>'].join(""),

    TPL_TABLE_6: ['<table><tr>', '<th colspan="12">新开户数</th>', '<th colspan="12">新开有消耗客户数</th>',
        '<th colspan="12">新开无消耗客户数</th></tr>', '<tr><th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>', '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th></tr>', '<tr>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '</tr>', '<tr>', '<td><a href="#" param="{{lastargs}}&tradeType=1">{{data.lastNewCusts}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=1">{{data.newCusts}}</a></td><td>{{data.newCustsSub}}</td><td>{{data.newCustsCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=2">{{data.lastNewCustsCommon}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=2">{{data.newCustsCommon}}</a></td><td>{{data.newCustsCommonSub}}</td><td>{{data.newCustsCommonCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=3">{{data.lastNewCustsB}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=3">{{data.newCustsB}}</a></td><td>{{data.newCustsBSub}}</td><td>{{data.newCustsBCompare}}</td>',
        '<td>{{data.lastNewCostCusts}}</td><td>{{data.newCostCusts}}</td><td>{{data.newCostCustsSub}}</td><td>{{data.newCostCustsCompare}}</td>',
        '<td>{{data.lastNewCostCustsCommon}}</td><td>{{data.newCostCustsCommon}}</td><td>{{data.newCostCustsCommonSub}}</td><td>{{data.newCostCustsCommonCompare}}</td>',
        '<td>{{data.lastNewCostCustsB}}</td><td>{{data.newCostCustsB}}</td><td>{{data.newCostCustsBSub}}</td><td>{{data.newCostCustsBCompare}}</td>',
        '<td>{{data.lastNewNoCostCusts}}</td><td>{{data.newNoCostCusts}}</td><td>{{data.newNoCostCustsSub}}</td><td>{{data.newNoCostCustsCompare}}</td>',
        '<td>{{data.lastNewNoCostCustsCommon}}</td><td>{{data.newNoCostCustsCommon}}</td><td>{{data.newNoCostCustsCommonSub}}</td><td>{{data.newNoCostCustsCommonCompare}}</td>', '<td>{{data.lastNewNoCostCustsB}}</td><td>{{data.newNoCostCustsB}}</td><td>{{data.newNoCostCustsBSub}}</td><td>{{data.newNoCostCustsBCompare}}</td>',
        '</tr>', '</table>'].join("")
});
