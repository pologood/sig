/*
 * Atlantis View - IncrementService
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.IncrementService = Backbone.View.extend({
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
        Atlantis.Widgets.TreeNav.destroy();
    },

    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(4);
    },

    renderTreeNav: function() {
        Atlantis.Widgets.TreeNav = new Atlantis.Views.TreeNav(1, 2, 2);
    },

    pageRendered: false,

    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();

        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".report-switch").html($.Mustache.render("tpl-report-type4") + $.Mustache.render("tpl-data-type"));
        this.$(".query-form").html($.Mustache.render("tpl-query-form-dwmq") + $.Mustache.render("tpl-query-form-compare")
            + $.Mustache.render("tpl-query-form-duration") + $.Mustache.render("tpl-query-form-duration-compare") + $.Mustache.render("tpl-query-form-product") + $.Mustache.render("tpl-query-form-cs"));
        $(this.$(".block12 .time")[2]).append('<span class="toggle-date" id="ToggleDate1"></span>');
        $(this.$(".block2 .time")[2]).append('<span class="toggle-date" id="ToggleDate2"></span>');

        //上次查询参数
        this.lastAction = null;
        //当前查询参数
        this.actionIndex = 0;
        this.action = ["CostStatAction.getAddCpcCostByCs",
                       "CostStatAction.getAddCpcCostByCsCompare",
                       "NewCustomerOnlineStatAction.getNewCustomerOnlineByCs",
                       "NewCustomerOnlineStatAction.getNewCustomerOnlineByCsCompare"];
        this.overviewArgsOfWM = null;
        this.overviewArgsOfDWMQ = null;
        this.contrastArgsOfDWMQ = null;

        //初始化日历相关元素
        Atlantis.Calendar.init(this);

        this.overviewArgsOfDWMQ.queryType = 5;
        this.overviewArgsOfDWMQ.query = "";
        this.contrastArgsOfDWMQ.queryType = 5;
        this.contrastArgsOfDWMQ.query = "";

        /*
        * 初始化其他的元素
        */
        //选择消耗分析
        esui.get("Report1").setChecked(true);
        //选择整体趋势
        esui.get("Data1").setChecked(true);

        //绑定事件
        this.bindEsui();
        //自动按默认条件查询
        this.query({
            method: this.action[this.actionIndex],
            args: this.overviewArgsOfDWMQ
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
                $("#Right .block12").show();
                $("#Right .block2").hide();
                $("#Right .block3").show();
                view.actionIndex = 0;
            } else {
                $("#Right .block12").hide();
                $("#Right .block2").show();
                $("#Right .block3").show();
                view.actionIndex = 1;
            }
            $("#Right .block9").show();
            view.hideDuration();
            $("#ToggleDate1").show();
            $("#ToggleDate2").show();
        };
        esui.get("Report2").onclick = function(value, item) {
            if(esui.get("Data1").isChecked()) {
                $("#Right .block12").show();
                $("#Right .block2").hide();
                $("#Right .block3").show();
                view.actionIndex = 2;
            } else {
                $("#Right .block12").hide();
                $("#Right .block2").show();
                $("#Right .block3").show();
                view.actionIndex = 3;
            }
            $("#Right .block9").hide();
            view.hideDuration();
            $("#ToggleDate1").hide();
            $("#ToggleDate2").hide();
        };
        esui.get("Data1").onclick = function(value, item) {
            if(esui.get("Report1").isChecked()) {
                $("#Right .block12").show();
                $("#Right .block2").hide();
                $("#Right .block3").show();
                view.actionIndex = 0;
            } else {
                $("#Right .block12").show();
                $("#Right .block2").hide();
                $("#Right .block3").show();
                view.actionIndex = 2;
            }
            view.hideDuration();
        };
        esui.get("Data2").onclick = function(value, item) {
            if(esui.get("Report1").isChecked()) {
                $("#Right .block12").hide();
                $("#Right .block2").show();
                $("#Right .block3").show();
                view.actionIndex = 1;
            } else {
                $("#Right .block12").hide();
                $("#Right .block2").show();
                $("#Right .block3").show();
                view.actionIndex = 3;
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
        var argsthis;
        switch (this.actionIndex) {
            case 0:
                this.overviewArgsOfDWMQ.queryType = 5;
                this.overviewArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("ServiceName").getValue()));
                argsthis = this.overviewArgsOfDWMQ;
                break;
            case 1:
                this.contrastArgsOfDWMQ.queryType = 5;
                this.contrastArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("ServiceName").getValue()));
                argsthis = this.contrastArgsOfDWMQ;
                break;
            case 2:
            this.overviewArgsOfDWMQ.queryType = 5;
                this.overviewArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("ServiceName").getValue()));
                argsthis = this.overviewArgsOfDWMQ;
                break;
            case 3:
                this.contrastArgsOfDWMQ.queryType = 5;
                this.contrastArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("ServiceName").getValue()));
                argsthis = this.contrastArgsOfDWMQ;
                break;
        }
        this.query({
            method: this.action[this.actionIndex],
            args: argsthis
        });
    },

    query: function(param) {
        this.model.getData(param.method, param.args);
    },
    
    openCustPage: function(e) {
        Util.stopDefault(e);
        var param = $(e.target).attr('param');
        if (T.url.getQueryValue(param, "csId") == "-2") {
            alert("暂不提供客户详情");
        } else {
            Util.openCustPage(param);
        }
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
            if(this.lastAction.method == "CostStatAction.getAddCpcCostByCs") {
                this.renderAddCpcCostByCs(args, data);
            }
            if(this.lastAction.method == "CostStatAction.getAddCpcCostByCsCompare") {
                this.renderAddCpcCostByCsCompare(args, data);
            }
            if(this.lastAction.method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByCs") {
                this.renderNewCustomerOnlineByCs(args, data);
            }
            if(this.lastAction.method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByCsCompare") {
                this.renderNewCustomerOnlineByCsCompare(args, data);
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
    
    renderAddCpcCostByCs: function(args, data) {
        //标题
        this.$(".title").html("客服维度增量消耗分析统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "AddCpcCostByCs",
                type: args.time.type,
                date: args.time.date,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                q: args.time.q,
                qYear: args.time.qYear,
                curAddExistDate: args.curAddExistDate,
                lastAddExistDate: args.lastAddExistDate,
                queryType: args.queryType,
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

    renderAddCpcCostByCsCompare: function(args, data) {
        //标题
        this.$(".title").html("客服维度增量消耗分析波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "AddCpcCostByCsCompare",
                type: args.time.type,
                date: args.time.date,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                q: args.time.q,
                qYear: args.time.qYear,
                "lastTime.type": args.lastTime.type,
                "lastTime.date": args.lastTime.date,
                "lastTime.start": args.lastTime.start,
                "lastTime.end": args.lastTime.end,
                "lastTime.year": args.lastTime.year,
                "lastTime.month": args.lastTime.month,
                "lastTime.q": args.lastTime.q,
                "lastTime.qYear": args.lastTime.qYear,
                curAddExistDate: args.curAddExistDate,
                lastAddExistDate: args.lastAddExistDate,
                queryType: args.queryType,
                query: args.query,
                product: args.product
            })
        });
        //表格
        if(args.time.type != 1) {//非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_3, {
                sum: data.sum,
                data: data.data
            })));
        } else {//按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_4 : this.TPL_TABLE_4.replace(/环比/g, "周同比"), {
                sum: data.sum,
                data: data.data
            })));
        }
        
        Util.fixTable(this.$(".grid"));
    },

    renderNewCustomerOnlineByCs: function(args, data) {
        //标题
        this.$(".title").html("客服维度客户上线情况统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerOnlineByCs",
                type: args.time.type,
                date: args.time.date,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                q: args.time.q,
                qYear: args.time.qYear,
                queryType: args.queryType,
                query: args.query
            })
        });
        var params = {
            customerInfoType: 1,
            dimType: 3
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        //表格
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_5, {
            cs: decodeURIComponent(args.query),
            sum: data.sum,
            data: data.data,
            args: thisargs
        })));
        
        Util.fixTable(this.$(".grid"));
    },

    renderNewCustomerOnlineByCsCompare: function(args, data) {
        //标题
        this.$(".title").html("客服维度客户上线情况波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerOnlineByCsCompare",
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
                query: args.query
            })
        });

        var params = {
            customerInfoType: 1,
            dimType: 3
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        var lastargs = Util.toUrl(args, params, 2, 2);
        //表格
        if(args.time.type != 1) {//非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_6, {
                cs: decodeURIComponent(args.query),
                data: data.data,
                sum: data.sum,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        } else {//按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_6 : this.TPL_TABLE_6.replace(/环比/g, "周同比"), {
                cs: decodeURIComponent(args.query),
                data: data.data,
                sum: data.sum,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        }
        
        Util.fixTable(this.$(".grid"));
    },
    
    TPL_TABLE_1: ['<table><tr>',
        '<th colspan="1" rowspan="2">客服名称</th>',
        '<th colspan="3">消耗</th>',
        '<th colspan="3">有消耗客户</th>',
        '<th colspan="3">户均消耗</th>',
        '<th colspan="3">日均消耗</th>',
        '<th colspan="3">日户均消耗</th>',
        '<th colspan="3">点击数</th>',
        '<th colspan="3">点击均价</th></tr>',
        '<tr><th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th></tr>',
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td>{{sum.cost}}</td><td>{{sum.costCommon}}</td><td>{{sum.costB}}</td>',
        '<td>{{sum.custs}}</td><td>{{sum.custsCommon}}</td><td>{{sum.custsB}}</td>',
        '<td>{{sum.costPerCust}}</td><td>{{sum.costPerCustCommon}}</td><td>{{sum.costPerCustB}}</td>',
        '<td>{{sum.costPerDay}}</td><td>{{sum.costPerDayCommon}}</td><td>{{sum.costPerDayB}}</td>',
        '<td>{{sum.costPerCustPerDay}}</td><td>{{sum.costPerCustPerDayCommon}}</td><td>{{sum.costPerCustPerDayB}}</td>',
        '<td>{{sum.click}}</td><td>{{sum.clickCommon}}</td><td>{{sum.clickB}}</td>',
        '<td>{{sum.cpc}}</td><td>{{sum.cpcCommon}}</td><td>{{sum.cpcB}}</td></tr>',
        '{{#data}}<tr><td class="text">{{csName}}</td>',
        '<td>{{cost}}</td><td>{{costCommon}}</td><td>{{costB}}</td>',
        '<td>{{custs}}</td><td>{{custsCommon}}</td><td>{{custsB}}</td>',
        '<td>{{costPerCust}}</td><td>{{costPerCustCommon}}</td><td>{{costPerCustB}}</td>',
        '<td>{{costPerDay}}</td><td>{{costPerDayCommon}}</td><td>{{costPerDayB}}</td>',
        '<td>{{costPerCustPerDay}}</td><td>{{costPerCustPerDayCommon}}</td><td>{{costPerCustPerDayB}}</td>',
        '<td>{{click}}</td><td>{{clickCommon}}</td><td>{{clickB}}</td>',
        '<td>{{cpc}}</td><td>{{cpcCommon}}</td><td>{{cpcB}}</td></tr>{{/data}}',
        '</table>'
    ].join(""),
    
    TPL_TABLE_2: ['<table><tr>',
        '<th colspan="1" rowspan="2">客服名称</th>',
        '<th colspan="3">消耗</th>',
        '<th colspan="3">有消耗客户</th>',
        '<th colspan="3">户均消耗</th>',
        '<th colspan="3">点击数</th>',
        '<th colspan="3">点击均价</th></tr>',
        '<tr><th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th></tr>',
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td>{{sum.cost}}</td><td>{{sum.costCommon}}</td><td>{{sum.costB}}</td>',
        '<td>{{sum.custs}}</td><td>{{sum.custsCommon}}</td><td>{{sum.custsB}}</td>',
        '<td>{{sum.costPerCust}}</td><td>{{sum.costPerCustCommon}}</td><td>{{sum.costPerCustB}}</td>',
        '<td>{{sum.click}}</td><td>{{sum.clickCommon}}</td><td>{{sum.clickB}}</td>',
        '<td>{{sum.cpc}}</td><td>{{sum.cpcCommon}}</td><td>{{sum.cpcB}}</td></tr>',
        '{{#data}}<tr><td class="text">{{csName}}</td>',
        '<td>{{cost}}</td><td>{{costCommon}}</td><td>{{costB}}</td>',
        '<td>{{custs}}</td><td>{{custsCommon}}</td><td>{{custsB}}</td>',
        '<td>{{costPerCust}}</td><td>{{costPerCustCommon}}</td><td>{{costPerCustB}}</td>',
        '<td>{{click}}</td><td>{{clickCommon}}</td><td>{{clickB}}</td>',
        '<td>{{cpc}}</td><td>{{cpcCommon}}</td><td>{{cpcB}}</td></tr>{{/data}}',
        '</table>'
    ].join(""),
    
    TPL_TABLE_3: ['<table><tr>',
        '<th colspan="1" rowspan="3">客服名称</th>',
        '<th colspan="12">消耗</th>',
        '<th colspan="12">有消耗客户</th>',
        '<th colspan="12">户均消耗</th>',
        '<th colspan="12">日均消耗</th>',
        '<th colspan="12">日户均消耗</th>',
        '<th colspan="12">点击数</th>',
        '<th colspan="12">点击均价</th>',
        '</tr>',
        
        '<tr><th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th></tr>',
        '<tr>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '</tr>',
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        //消耗
        '<td>{{sum.lastCost}}</td><td>{{sum.cost}}</td><td>{{sum.costSub}}</td><td>{{sum.costCompare}}</td>',
        '<td>{{sum.lastCostCommon}}</td><td>{{sum.costCommon}}</td><td>{{sum.costCommonSub}}</td><td>{{sum.costCommonCompare}}</td>',
        '<td>{{sum.lastCostB}}</td><td>{{sum.costB}}</td><td>{{sum.costBSub}}</td><td>{{sum.costBCompare}}</td>',
        
        //有消耗客户数-所有行业
        '<td>{{sum.lastCusts}}</td><td>{{sum.custs}}</td><td>{{sum.custsSub}}</td><td>{{sum.custsCompare}}</td>',
        //有消耗客户数-正常行业
        '<td>{{sum.lastCustsCommon}}</td><td>{{sum.custsCommon}}</td><td>{{sum.custsCommonSub}}</td><td>{{sum.custsCommonCompare}}</td>',
        //有消耗客户数-特殊行业行业
       '<td>{{sum.lastCustsB}}</td><td>{{sum.custsB}}</td><td>{{sum.custsBSub}}</td><td>{{sum.custsBCompare}}</td>',
      
       //costPerCust:xxx,//户均消耗-所有行业
       '<td>{{sum.lastCostPerCust}}</td><td>{{sum.costPerCust}}</td><td>{{sum.costPerCustSub}}</td><td>{{sum.costPerCustCompare}}</td>',
       //costPerCustCommon:xxx,//户均消耗-正常行业
       '<td>{{sum.lastCostPerCustCommon}}</td><td>{{sum.costPerCustCommon}}</td><td>{{sum.costPerCustCommonSub}}</td><td>{{sum.costPerCustCommonCompare}}</td>',
        //costPerCustB:xxx,//户均消耗-特殊行业行业
       '<td>{{sum.lastCostPerCustB}}</td><td>{{sum.costPerCustB}}</td><td>{{sum.costPerCustBSub}}</td><td>{{sum.costPerCustBCompare}}</td>',
       
        //costPerDay:xxx,//日均消耗-所有行业-本期
        '<td>{{sum.lastCostPerDay}}</td><td>{{sum.costPerDay}}</td><td>{{sum.costPerDaySub}}</td><td>{{sum.costPerDayCompare}}</td>',
        //costPerDayCommon:xxx,//日均消耗-正常行业-本期
        '<td>{{sum.lastCostPerDayCommon}}</td><td>{{sum.costPerDayCommon}}</td><td>{{sum.costPerDayCommonSub}}</td><td>{{sum.costPerDayCommonCompare}}</td>',
        //costPerDayB:xxx,//日均消耗-特殊行业行业-本期
        '<td>{{sum.lastCostPerDayB}}</td><td>{{sum.costPerDayB}}</td><td>{{sum.costPerDayBSub}}</td><td>{{sum.costPerDayBCompare}}</td>',
       
        //costPerCustPerDay:xxx,//日户均消耗-所有行业-本期
        '<td>{{sum.lastCostPerCustPerDay}}</td><td>{{sum.costPerCustPerDay}}</td><td>{{sum.costPerCustPerDaySub}}</td><td>{{sum.costPerCustPerDayCompare}}</td>',
        '<td>{{sum.lastCostPerCustPerDayCommon}}</td><td>{{sum.costPerCustPerDayCommon}}</td><td>{{sum.costPerCustPerDayCommonSub}}</td><td>{{sum.costPerCustPerDayCommonCompare}}</td>',
        '<td>{{sum.lastCostPerCustPerDayB}}</td><td>{{sum.costPerCustPerDayB}}</td><td>{{sum.costPerCustPerDayBSub}}</td><td>{{sum.costPerCustPerDayBCompare}}</td>',
         
         //点击数Click
        '<td>{{sum.lastClick}}</td><td>{{sum.click}}</td><td>{{sum.clickSub}}</td><td>{{sum.clickCompare}}</td>',
        '<td>{{sum.lastClickCommon}}</td><td>{{sum.clickCommon}}</td><td>{{sum.clickCommonSub}}</td><td>{{sum.clickCommonCompare}}</td>',
        '<td>{{sum.lastClickB}}</td><td>{{sum.clickB}}</td><td>{{sum.clickBSub}}</td><td>{{sum.clickBCompare}}</td>',
        
        //平均点击数
        '<td>{{sum.lastCpc}}</td><td>{{sum.cpc}}</td><td>{{sum.cpcSub}}</td><td>{{sum.cpcCompare}}</td>',
        '<td>{{sum.lastCpcCommon}}</td><td>{{sum.cpcCommon}}</td><td>{{sum.cpcCommonSub}}</td><td>{{sum.cpcCommonCompare}}</td>',
        '<td>{{sum.lastCpcB}}</td><td>{{sum.cpcB}}</td><td>{{sum.cpcBSub}}</td><td>{{sum.cpcBCompare}}</td>',
         
        '</tr>',
        '{{#data}}<tr>',
        '<td class="text">{{csName}}</td>',
         '<td>{{lastCost}}</td><td>{{cost}}</td><td>{{costSub}}</td><td>{{costCompare}}</td>',
        '<td>{{lastCostCommon}}</td><td>{{costCommon}}</td><td>{{costCommonSub}}</td><td>{{costCommonCompare}}</td>',
        '<td>{{lastCostB}}</td><td>{{costB}}</td><td>{{costBSub}}</td><td>{{costBCompare}}</td>',
        
        //有消耗客户数-所有行业
        '<td>{{lastCusts}}</td><td>{{custs}}</td><td>{{custsSub}}</td><td>{{custsCompare}}</td>',
        //有消耗客户数-正常行业
        '<td>{{lastCustsCommon}}</td><td>{{custsCommon}}</td><td>{{custsCommonSub}}</td><td>{{custsCommonCompare}}</td>',
        //有消耗客户数-特殊行业行业
       '<td>{{lastCustsB}}</td><td>{{custsB}}</td><td>{{custsBSub}}</td><td>{{custsBCompare}}</td>',
      
       //costPerCust:xxx,//户均消耗-所有行业
       '<td>{{lastCostPerCust}}</td><td>{{costPerCust}}</td><td>{{costPerCustSub}}</td><td>{{costPerCustCompare}}</td>',
       //costPerCustCommon:xxx,//户均消耗-正常行业
       '<td>{{lastCostPerCustCommon}}</td><td>{{costPerCustCommon}}</td><td>{{costPerCustCommonSub}}</td><td>{{costPerCustCommonCompare}}</td>',
        //costPerCustB:xxx,//户均消耗-特殊行业行业
       '<td>{{lastCostPerCustB}}</td><td>{{costPerCustB}}</td><td>{{costPerCustBSub}}</td><td>{{costPerCustBCompare}}</td>',
       
        //costPerDay:xxx,//日均消耗-所有行业-本期
        '<td>{{lastCostPerDay}}</td><td>{{costPerDay}}</td><td>{{costPerDaySub}}</td><td>{{costPerDayCompare}}</td>',
        //costPerDayCommon:xxx,//日均消耗-正常行业-本期
        '<td>{{lastCostPerDayCommon}}</td><td>{{costPerDayCommon}}</td><td>{{costPerDayCommonSub}}</td><td>{{costPerDayCommonCompare}}</td>',
        //costPerDayB:xxx,//日均消耗-特殊行业行业-本期
        '<td>{{lastCostPerDayB}}</td><td>{{costPerDayB}}</td><td>{{costPerDayBSub}}</td><td>{{costPerDayBCompare}}</td>',
       
        //costPerCustPerDay:xxx,//日户均消耗-所有行业-本期
        '<td>{{lastCostPerCustPerDay}}</td><td>{{costPerCustPerDay}}</td><td>{{costPerCustPerDaySub}}</td><td>{{costPerCustPerDayCompare}}</td>',
        '<td>{{lastCostPerCustPerDayCommon}}</td><td>{{costPerCustPerDayCommon}}</td><td>{{costPerCustPerDayCommonSub}}</td><td>{{costPerCustPerDayCommonCompare}}</td>',
        '<td>{{lastCostPerCustPerDayB}}</td><td>{{costPerCustPerDayB}}</td><td>{{costPerCustPerDayBSub}}</td><td>{{costPerCustPerDayBCompare}}</td>',
         
         //点击数Click
        '<td>{{lastClick}}</td><td>{{click}}</td><td>{{clickSub}}</td><td>{{clickCompare}}</td>',
        '<td>{{lastClickCommon}}</td><td>{{clickCommon}}</td><td>{{clickCommonSub}}</td><td>{{clickCommonCompare}}</td>',
        '<td>{{lastClickB}}</td><td>{{clickB}}</td><td>{{clickBSub}}</td><td>{{clickBCompare}}</td>',
        
        //平均点击数
        '<td>{{lastCpc}}</td><td>{{cpc}}</td><td>{{cpcSub}}</td><td>{{cpcCompare}}</td>',
        '<td>{{lastCpcCommon}}</td><td>{{cpcCommon}}</td><td>{{cpcCommonSub}}</td><td>{{cpcCommonCompare}}</td>',
        '<td>{{lastCpcB}}</td><td>{{cpcB}}</td><td>{{cpcBSub}}</td><td>{{cpcBCompare}}</td>',
        '</tr>{{/data}}',
        '</table>'
    ].join(""),
    
    TPL_TABLE_4: ['<table><tr>',
        '<th colspan="1" rowspan="3">客服名称</th>',
        '<th colspan="12">消耗</th>',
        '<th colspan="12">有消耗客户</th>',
        '<th colspan="12">户均消耗</th>',
        
        '<th colspan="12">点击数</th>',
        '<th colspan="12">点击均价</th>',
        '</tr>',
        
        '<tr><th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th></tr>',
        '<tr>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '</tr>',
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        //消耗
        '<td>{{sum.lastCost}}</td><td>{{sum.cost}}</td><td>{{sum.costSub}}</td><td>{{sum.costCompare}}</td>',
        '<td>{{sum.lastCostCommon}}</td><td>{{sum.costCommon}}</td><td>{{sum.costCommonSub}}</td><td>{{sum.costCommonCompare}}</td>',
        '<td>{{sum.lastCostB}}</td><td>{{sum.costB}}</td><td>{{sum.costBSub}}</td><td>{{sum.costBCompare}}</td>',
        
        //有消耗客户数-所有行业
        '<td>{{sum.lastCusts}}</td><td>{{sum.custs}}</td><td>{{sum.custsSub}}</td><td>{{sum.custsCompare}}</td>',
        //有消耗客户数-正常行业
        '<td>{{sum.lastCustsCommon}}</td><td>{{sum.custsCommon}}</td><td>{{sum.custsCommonSub}}</td><td>{{sum.custsCommonCompare}}</td>',
        //有消耗客户数-特殊行业行业
       '<td>{{sum.lastCustsB}}</td><td>{{sum.custsB}}</td><td>{{sum.custsBSub}}</td><td>{{sum.custsBCompare}}</td>',
      
       //costPerCust:xxx,//户均消耗-所有行业
       '<td>{{sum.lastCostPerCust}}</td><td>{{sum.costPerCust}}</td><td>{{sum.costPerCustSub}}</td><td>{{sum.costPerCustCompare}}</td>',
       //costPerCustCommon:xxx,//户均消耗-正常行业
       '<td>{{sum.lastCostPerCustCommon}}</td><td>{{sum.costPerCustCommon}}</td><td>{{sum.costPerCustCommonSub}}</td><td>{{sum.costPerCustCommonCompare}}</td>',
        //costPerCustB:xxx,//户均消耗-特殊行业行业
       '<td>{{sum.lastCostPerCustB}}</td><td>{{sum.costPerCustB}}</td><td>{{sum.costPerCustBSub}}</td><td>{{sum.costPerCustBCompare}}</td>',
        
         //点击数Click
        '<td>{{sum.lastClick}}</td><td>{{sum.click}}</td><td>{{sum.clickSub}}</td><td>{{sum.clickCompare}}</td>',
        '<td>{{sum.lastClickCommon}}</td><td>{{sum.clickCommon}}</td><td>{{sum.clickCommonSub}}</td><td>{{sum.clickCommonCompare}}</td>',
        '<td>{{sum.lastClickB}}</td><td>{{sum.clickB}}</td><td>{{sum.clickBSub}}</td><td>{{sum.clickBCompare}}</td>',
        
        //平均点击数
        '<td>{{sum.lastCpc}}</td><td>{{sum.cpc}}</td><td>{{sum.cpcSub}}</td><td>{{sum.cpcCompare}}</td>',
        '<td>{{sum.lastCpcCommon}}</td><td>{{sum.cpcCommon}}</td><td>{{sum.cpcCommonSub}}</td><td>{{sum.cpcCommonCompare}}</td>',
        '<td>{{sum.lastCpcB}}</td><td>{{sum.cpcB}}</td><td>{{sum.cpcBSub}}</td><td>{{sum.cpcBCompare}}</td>',
         
        '</tr>',
        '{{#data}}<tr>',
        '<td class="text">{{csName}}</td>',
         '<td>{{lastCost}}</td><td>{{cost}}</td><td>{{costSub}}</td><td>{{costCompare}}</td>',
        '<td>{{lastCostCommon}}</td><td>{{costCommon}}</td><td>{{costCommonSub}}</td><td>{{costCommonCompare}}</td>',
        '<td>{{lastCostB}}</td><td>{{costB}}</td><td>{{costBSub}}</td><td>{{costBCompare}}</td>',
        
        //有消耗客户数-所有行业
        '<td>{{lastCusts}}</td><td>{{custs}}</td><td>{{custsSub}}</td><td>{{custsCompare}}</td>',
        //有消耗客户数-正常行业
        '<td>{{lastCustsCommon}}</td><td>{{custsCommon}}</td><td>{{custsCommonSub}}</td><td>{{custsCommonCompare}}</td>',
        //有消耗客户数-特殊行业行业
       '<td>{{lastCustsB}}</td><td>{{custsB}}</td><td>{{custsBSub}}</td><td>{{custsBCompare}}</td>',
      
       //costPerCust:xxx,//户均消耗-所有行业
       '<td>{{lastCostPerCust}}</td><td>{{costPerCust}}</td><td>{{costPerCustSub}}</td><td>{{costPerCustCompare}}</td>',
       //costPerCustCommon:xxx,//户均消耗-正常行业
       '<td>{{lastCostPerCustCommon}}</td><td>{{costPerCustCommon}}</td><td>{{costPerCustCommonSub}}</td><td>{{costPerCustCommonCompare}}</td>',
        //costPerCustB:xxx,//户均消耗-特殊行业行业
       '<td>{{lastCostPerCustB}}</td><td>{{costPerCustB}}</td><td>{{costPerCustBSub}}</td><td>{{costPerCustBCompare}}</td>',
          
         //点击数Click
        '<td>{{lastClick}}</td><td>{{click}}</td><td>{{clickSub}}</td><td>{{clickCompare}}</td>',
        '<td>{{lastClickCommon}}</td><td>{{clickCommon}}</td><td>{{clickCommonSub}}</td><td>{{clickCommonCompare}}</td>',
        '<td>{{lastClickB}}</td><td>{{clickB}}</td><td>{{clickBSub}}</td><td>{{clickBCompare}}</td>',
        
        //平均点击数
        '<td>{{lastCpc}}</td><td>{{cpc}}</td><td>{{cpcSub}}</td><td>{{cpcCompare}}</td>',
        '<td>{{lastCpcCommon}}</td><td>{{cpcCommon}}</td><td>{{cpcCommonSub}}</td><td>{{cpcCommonCompare}}</td>',
        '<td>{{lastCpcB}}</td><td>{{cpcB}}</td><td>{{cpcBSub}}</td><td>{{cpcBCompare}}</td>',
        '</tr>{{/data}}',
        '</table>'
    ].join(""),
    
    TPL_TABLE_5: ['<table><tr>',
        '<th colspan="1" rowspan="2">客服名称</th>',
        '<th colspan="3">新开户数</th>',
        '<th colspan="3">新开有消耗客户数</th>',
        '<th colspan="3">新开无消耗客户数</th></tr>',

        '<tr><th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th>',
        '<th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th>',
        '<th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th></tr>',
        
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td><a href="#" param="{{args}}&tradeType=1&csQuery={{cs}}">{{sum.newCusts}}</a></td><td><a href="#" param="{{args}}&tradeType=2&csQuery={{cs}}">{{sum.newCustsCommon}}</a></td><td><a href="#" param="{{args}}&tradeType=3&csQuery={{cs}}">{{sum.newCustsB}}</a></td>',
        '<td>{{sum.newCostCusts}}</td><td>{{sum.newCostCustsCommon}}</td><td>{{sum.newCostCustsB}}</td>',
        '<td>{{sum.newNoCostCusts}}</td><td>{{sum.newNoCostCustsCommon}}</td><td>{{sum.newNoCostCustsB}}</td></tr>',
       
        '{{#data}}<tr><td class="text">{{csName}}</td>',//按销售员统计
        '<td><a href="#" param="{{args}}&tradeType=1&csQuery={{csName}}&csId={{csId}}">{{newCusts}}</a></td><td><a href="#" param="{{args}}&tradeType=2&csQuery={{csName}}&csId={{csId}}">{{newCustsCommon}}</a></td><td><a href="#" param="{{args}}&tradeType=3&csQuery={{csName}}&csId={{csId}}">{{newCustsB}}</a></td>',
        '<td>{{newCostCusts}}</td><td>{{newCostCustsCommon}}</td><td>{{newCostCustsB}}</td>',
        '<td>{{newNoCostCusts}}</td><td>{{newNoCostCustsCommon}}</td><td>{{newNoCostCustsB}}</td></tr>',
        '</tr>{{/data}}',
        '</table>'
    ].join(""),
    
    TPL_TABLE_6: ['<table><tr>',
        '<th colspan="1" rowspan="3">客服名称</th>',
        '<th colspan="12">新开户数</th>',
        '<th colspan="12">新开有消耗客户数</th>',
        '<th colspan="12">新开无消耗客户数</th></tr>',

        '<tr><th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th>',
        '<th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th></tr>',
        '<tr>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '</tr>',
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=1&csQuery={{cs}}">{{sum.lastNewCusts}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=1&csQuery={{cs}}">{{sum.newCusts}}</a></td><td>{{sum.newCustsSub}}</td><td>{{sum.newCustsCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=2&csQuery={{cs}}">{{sum.lastNewCustsCommon}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=2&csQuery={{cs}}">{{sum.newCustsCommon}}</a></td><td>{{sum.newCustsCommonSub}}</td><td>{{sum.newCustsCommonCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=3&csQuery={{cs}}">{{sum.lastNewCustsB}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=3&csQuery={{cs}}">{{sum.newCustsB}}</a></td><td>{{sum.newCustsBSub}}</td><td>{{sum.newCustsBCompare}}</td>',
        
        '<td>{{sum.lastNewCostCusts}}</td><td>{{sum.newCostCusts}}</td><td>{{sum.newCostCustsSub}}</td><td>{{sum.newCostCustsCompare}}</td>',
        '<td>{{sum.lastNewCostCustsCommon}}</td><td>{{sum.newCostCustsCommon}}</td><td>{{sum.newCostCustsCommonSub}}</td><td>{{sum.newCostCustsCommonCompare}}</td>',
        '<td>{{sum.lastNewCostCustsB}}</td><td>{{sum.newCostCustsB}}</td><td>{{sum.newCostCustsBSub}}</td><td>{{sum.newCostCustsBCompare}}</td>',
        
        '<td>{{sum.lastNewNoCostCusts}}</td><td>{{sum.newNoCostCusts}}</td><td>{{sum.newNoCostCustsSub}}</td><td>{{sum.newNoCostCustsCompare}}</td>',
        '<td>{{sum.lastNewNoCostCustsCommon}}</td><td>{{sum.newNoCostCustsCommon}}</td><td>{{sum.newNoCostCustsCommonSub}}</td><td>{{sum.newNoCostCustsCommonCompare}}</td>',
        '<td>{{sum.lastNewNoCostCustsB}}</td><td>{{sum.newNoCostCustsB}}</td><td>{{sum.newNoCostCustsBSub}}</td><td>{{sum.newNoCostCustsBCompare}}</td>',
        '</tr>',
        '{{#data}}<tr><td class="text">{{csName}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=1&csQuery={{csName}}&csId={{csId}}">{{lastNewCusts}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=1&csQuery={{csName}}&csId={{csId}}">{{newCusts}}</a></td><td>{{newCustsSub}}</td><td>{{newCustsCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=2&csQuery={{csName}}&csId={{csId}}">{{lastNewCustsCommon}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=2&csQuery={{csName}}&csId={{csId}}">{{newCustsCommon}}</a></td><td>{{newCustsCommonSub}}</td><td>{{newCustsCommonCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=3&csQuery={{csName}}&csId={{csId}}">{{lastNewCustsB}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=3&csQuery={{csName}}&csId={{csId}}">{{newCustsB}}</a></td><td>{{newCustsBSub}}</td><td>{{newCustsBCompare}}</td>',
        
        '<td>{{lastNewCostCusts}}</td><td>{{newCostCusts}}</td><td>{{newCostCustsSub}}</td><td>{{newCostCustsCompare}}</td>',
        '<td>{{lastNewCostCustsCommon}}</td><td>{{newCostCustsCommon}}</td><td>{{newCostCustsCommonSub}}</td><td>{{newCostCustsCommonCompare}}</td>',
        '<td>{{lastNewCostCustsB}}</td><td>{{newCostCustsB}}</td><td>{{newCostCustsBSub}}</td><td>{{newCostCustsBCompare}}</td>',
        
        '<td>{{lastNewNoCostCusts}}</td><td>{{newNoCostCusts}}</td><td>{{newNoCostCustsSub}}</td><td>{{newNoCostCustsCompare}}</td>',
        '<td>{{lastNewNoCostCustsCommon}}</td><td>{{newNoCostCustsCommon}}</td><td>{{newNoCostCustsCommonSub}}</td><td>{{newNoCostCustsCommonCompare}}</td>',
        '<td>{{lastNewNoCostCustsB}}</td><td>{{newNoCostCustsB}}</td><td>{{newNoCostCustsBSub}}</td><td>{{newNoCostCustsBCompare}}</td>',
        '</tr>{{/data}}',
        '</table>'
    ].join("")
});
