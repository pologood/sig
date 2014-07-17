/*
 * Atlantis View - StockOverview 
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.StockOverview = Backbone.View.extend({
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
        Atlantis.Widgets.TreeNav = new Atlantis.Views.TreeNav(1, 3, 0);
    },
    
    pageRendered: false,
    
    render: function(query) {
        //渲染页面
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染页面右部分
        this.$el.mustache("tpl-right");
        this.$(".report-switch").html($.Mustache.render("tpl-report-type5") + $.Mustache.render("tpl-data-type"));
        this.$(".query-form").html($.Mustache.render("tpl-query-form-wm") + $.Mustache.render("tpl-query-form-compare")
            + $.Mustache.render("tpl-query-form-duration") + $.Mustache.render("tpl-query-form-duration-compare") + $.Mustache.render("tpl-query-form-product"));
        $(this.$(".block11 .time")[1]).append('<span class="toggle-date" id="ToggleDate1"></span>');
        $(this.$(".block2 .time")[2]).append('<span class="toggle-date" id="ToggleDate2"></span>');
        
        //定义绘制报表对应的方法
        this.lastAction = null;
        this.actionIndex = 0;
        this.action = ["CostStatAction.getExistsCpcCost",
                       "CostStatAction.getExistsCpcCostCompare",
                       "LostCustomerAndRenewalStatAction.getLostCustomer",
                       "LostCustomerAndRenewalStatAction.getRenewal",
                       "LostCustomerAndRenewalStatAction.getRenewalCompare"];
        this.overviewArgsOfWM = null;
        this.overviewArgsOfDWMQ = null;
        this.contrastArgsOfDWMQ = null;
        
        //初始化日历相关元素
        Atlantis.Calendar.init(this);
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
            esui.get("Data2").disable();
            $(esui.get("Data2").main).next().css({color:'gray'});
        }
        
        if (T.url.getQueryValue(query, "actionindex") == "5") {
            this.actionIndex = 3;
            args = this.overviewArgsOfWM;
            esui.get("Report3").setChecked(true);
            $("#Right .block9").hide();
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
        	esui.get("Data2").enable();
        	$(esui.get("Data2").main).next().css({color:'black'});
            if (esui.get("Data1").isChecked()) {
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
        };
        esui.get("Report2").onclick = function(value, item) {
        	esui.get("Data2").disable();
        	$(esui.get("Data2").main).next().css({color:'gray'});
            if (esui.get("Data1").isChecked()) {
            	$("#Right .block11").show();
            	$("#Right .block2").hide();
            	view.actionIndex = 2;
            } else {
            	$("#Right .block11").show();
            	$("#Right .block2").hide();
            	view.actionIndex = 2;
            	esui.get("Data1").setChecked(true);
            }
            $("#Right .block9").show();
            view.hideDuration();
        };
        esui.get("Report3").onclick = function(value, item) {
        	esui.get("Data2").enable();
        	$(esui.get("Data2").main).next().css({color:'black'});
            if (esui.get("Data1").isChecked()) {
            	$("#Right .block11").show();
            	$("#Right .block2").hide();
            	view.actionIndex = 3;
            } else {
                $("#Right .block11").hide();
            	$("#Right .block2").show();
            	view.actionIndex = 4;
            }
            $("#Right .block9").hide();
            view.hideDuration();
        };
        esui.get("Data1").onclick = function(value, item) {
            if (esui.get("Report1").isChecked()) {
            	$("#Right .block11").show();
            	$("#Right .block2").hide();
            	view.actionIndex = 0;
            } else if (esui.get("Report2").isChecked()) {
            	$("#Right .block11").show();
            	$("#Right .block2").hide();
            	view.actionIndex = 2;
            } else {
            	$("#Right .block11").show();
            	$("#Right .block2").hide();
            	view.actionIndex = 3;
            }
            view.hideDuration();
        };
        esui.get("Data2").onclick = function(value, item) {
           if (esui.get("Report1").isChecked()) {
            	$("#Right .block11").hide();
            	$("#Right .block2").show();
            	view.actionIndex = 1;
            } else if (esui.get("Report2").isChecked()) {
            	$("#Right .block11").hide();
            	$("#Right .block2").show();
            	view.actionIndex = 2;
            } else {
            	$("#Right .block11").hide();
            	$("#Right .block2").show();
            	view.actionIndex = 4;
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
            case 0: args = this.overviewArgsOfWM; break;
            case 1: args = this.contrastArgsOfDWMQ; break;
            case 2: args = this.overviewArgsOfWM; break;
            case 3: args = this.overviewArgsOfWM; break;
            case 4: args = this.contrastArgsOfDWMQ;
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
        if (data.data == null || data.data.length == 0) { //无数据
            this.$(".result .info").show();
            this.$(".result .data").hide();
        } else {
            this.$(".result .info").hide();
            this.$(".result .data").show();
            var args = this.lastAction.args;
            
            if (!data.rowCount) data.rowCount = 1;
            
            //表格
            if (this.lastAction.method == "CostStatAction.getExistsCpcCost") {
                this.renderExistsCpcCost(args, data);
            }
            if (this.lastAction.method == "CostStatAction.getExistsCpcCostCompare") {
                this.renderExistsCpcCostCompare(args, data);
            }
            if (this.lastAction.method == "LostCustomerAndRenewalStatAction.getLostCustomer") {
                this.renderLostCustomer(args, data);
            }
            if (this.lastAction.method == "LostCustomerAndRenewalStatAction.getRenewal") {
                this.renderRenewal(args, data);
            }
            if (this.lastAction.method == "LostCustomerAndRenewalStatAction.getRenewalCompare") {
                this.renderRenewalCompare(args, data);
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
    
    renderExistsCpcCost: function(args, data) {
        //标题
        this.$(".title").html("存量消耗分析统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "ExistsCpcCost",
                type: args.time.type,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                curAddExistDate:args.curAddExistDate,
                lastAddExistDate:args.lastAddExistDate,
                product: args.product
            })
        });
        //表格
        this.$(".grid").html(Mustache.to_html(this.TPL_TABLE_1, {
            sum: data.sum,
            data: data.data
        }));
        
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_1, {
                sum: data.sum,
                data: data.data
            })));
        
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderExistsCpcCostCompare: function(args, data) {
        //标题
        this.$(".title").html("存量消耗波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "ExistsCpcCostCompare",
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
                curAddExistDate:args.curAddExistDate,
                lastAddExistDate:args.lastAddExistDate,
                product: args.product
            })
        });
        //表格
        if(args.time.type != 1) {//非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_2, {
                sum: data.sum,
                data: data.data
            })));
        } else {//按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE2 : this.TPL_TABLE2.replace(/环比/g, "周同比"), {
                sum: data.sum,
                data: data.data
            })));
        }
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderLostCustomer: function(args, data) {
        //标题
        this.$(".title").html("上期有消耗本期无消耗（流失率）分析统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "LostCustomer",
                type: args.time.type,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                curAddExistDate:args.curAddExistDate,
                lastAddExistDate:args.lastAddExistDate,
                product: args.product
            })
        });
        
        var params = {
            customerInfoType: 4,
            dimType: 1,
            curAddExistDate: args.time.type == 2 ? "" : args.curAddExistDate,
            product: args.product
        };
        var thisargs = Util.toUrl(args, params, 3, 1);
        
        //表格        
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_3, {
            sum: data.sum,
            data: data.data,
            args: thisargs
        })));
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderRenewal: function(args, data) {
        //标题
        this.$(".title").html("续费分析统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "Renewal",
                type: args.time.type,
                start: args.time.start,
                end: args.time.end,
                year: args.time.year,
                month: args.time.month,
                curAddExistDate:args.curAddExistDate,
                lastAddExistDate:args.lastAddExistDate
            })
        });
        //表格
        this.$(".grid").html(Mustache.to_html(this.TPL_TABLE_4, {
            sum: data.sum,
            data: data.data
        }));
        
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_4, {
                sum: data.sum,
                data: data.data
            })));
        
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderRenewalCompare: function(args, data) {
        //标题
        this.$(".title").html("续费分析波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "RenewalCompare",
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
                curAddExistDate:args.curAddExistDate,
                lastAddExistDate:args.lastAddExistDate
            })
        });
        //表格
        if (args.time.type != 1) { //非按日
            this.$(".grid").html(Mustache.to_html(this.TPL_TABLE_5, {
                data: data.data
            }));
        } else { //按日
            this.$(".grid").html(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_5 : this.TPL_TABLE_5.replace(/环比/g, "周同比"), {
                data: data.data
            }));
        }
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_5, {
                data: data.data
            })));
        
        
        Util.fixTable(this.$(".grid"));
    },
    
    
    //存量消耗分析统计报告
    TPL_TABLE_1: ['<table><tr>',
    	'<th colspan="1" rowspan="2">时间</th>',
        '<th colspan="3">消耗</th>',
        '<th colspan="3">有消耗客户数</th>',
        '<th colspan="3">户均消耗</th>',
        '<th colspan="3">点击数</th>',
        '<th colspan="3">点击均价</th></tr>',
        '<tr>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th></tr>',
        
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td>{{sum.cost}}</td><td>{{sum.costCommon}}</td><td>{{sum.costB}}</td>',
        '<td>{{sum.custs}}</td><td>{{sum.custsCommon}}</td><td>{{sum.custsCustB}}</td>',
        '<td>{{sum.costPerCust}}</td><td>{{sum.costPerCustCommon}}</td><td>{{sum.costPerCustB}}</td>',
        '<td>{{sum.click}}</td><td>{{sum.clickCommon}}</td><td>{{sum.clickB}}</td>',
        '<td>{{sum.cpc}}</td><td>{{sum.cpcCommon}}</td><td>{{sum.cpcB}}</td></tr>',
        
        '{{#data}}<tr><td class="text">{{date}}</td><td>{{cost}}</td><td>{{costCommon}}</td><td>{{costB}}</td>',
        '<td>{{custs}}</td><td>{{custsCommon}}</td><td>{{custsCustB}}</td>',
        '<td>{{costPerCust}}</td><td>{{costPerCustCommon}}</td><td>{{costPerCustB}}</td>',
        '<td>{{click}}</td><td>{{clickCommon}}</td><td>{{clickB}}</td>',
        '<td>{{cpc}}</td><td>{{cpcCommon}}</td><td>{{cpcB}}</td></tr>{{/data}}',
        '</table>'
    ].join(""),
    
    //存量消耗分析波动统计报告
    TPL_TABLE_2: ['<table><tr>',
        '<th colspan="12">消耗</th>',
        '<th colspan="12">有消耗客户数</th>',
        '<th colspan="12">户均消耗</th>',
        '<th colspan="12">日均消耗</th>',
        '<th colspan="12">日户均消耗</th>',
        '<th colspan="12">点击数</th>',
        '<th colspan="12">点击均价</th></tr>',
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
        '<tr>',//消耗
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
        
        //costPerDay:xxx,//日均消耗-所有行业-本期
        '<td>{{data.lastCostPerDay}}</td><td>{{data.costPerDay}}</td><td>{{data.costPerDaySub}}</td><td>{{data.costPerDayCompare}}</td>',
        //costPerDayCommon:xxx,//日均消耗-正常行业-本期
        '<td>{{data.lastCostPerDayCommon}}</td><td>{{data.costPerDayCommon}}</td><td>{{data.costPerDayCommonSub}}</td><td>{{data.costPerDayCommonCompare}}</td>',
        //costPerDayB:xxx,//日均消耗-特殊行业行业-本期
        '<td>{{data.lastCostPerDayB}}</td><td>{{data.costPerDayB}}</td><td>{{data.costPerDayBSub}}</td><td>{{data.costPerDayBCompare}}</td>',
       
        //costPerCustPerDay:xxx,//日户均消耗-所有行业-本期
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
        '<td>{{data.lastCpcB}}</td><td>{{data.cpcB}}</td><td>{{data.cpcBSub}}</td><td>{{data.cpcBCompare}}</td>',
         
        '</tr>',
        '</table>'
    ].join(""),
    
    
    TPL_TABLE2: ['<table><tr>',
                  '<th colspan="12">消耗</th>',
                  '<th colspan="12">有消耗客户数</th>',
                  '<th colspan="12">户均消耗</th>',
                  '<th colspan="12">点击数</th>',
                  '<th colspan="12">点击均价</th></tr>',
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
                  '<tr>',//消耗
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
                  '<td>{{data.lastCpcB}}</td><td>{{data.cpcB}}</td><td>{{data.cpcBSub}}</td><td>{{data.cpcBCompare}}</td>',
                   
                  '</tr>',
                  '</table>'
              ].join(""),
    
    //上期有消耗本期无消耗客户分析统计报告
    TPL_TABLE_3: ['<table><tr>',
    	'<th colspan="1" rowspan="2">时间</th>',
        '<th colspan="3">昨日有消耗本日无消耗（流失）客户数</th>',
        '<th colspan="3">昨日有消耗本日无消耗（流失）客户数占比</th>',
        '<tr>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th></tr>',
        
        '{{#data}}<tr><td class="text">{{date}}</td><td><a href="#" param="{{args}}&tradeType=1&date={{date}}">{{lostCusts}}</a></td>',
        '<td><a href="#" param="{{args}}&tradeType=2&date={{date}}">{{lostCustsCommon}}</a></td>',
        '<td><a href="#" param="{{args}}&tradeType=3&date={{date}}">{{lostCustsB}}</a></td>',
        '<td>{{lostCustsRate}}</td><td>{{lostCustsRateCommon}}</td><td>{{lostCustsRateB}}</td></tr>{{/data}}',
        '</table>'
    ].join(""),
    
    //续费分析统计报告
    TPL_TABLE_4: ['<table><tr>',
    	'<th colspan="1" rowspan="2">时间</th>',
        '<th colspan="3">续费金额</th></tr>',
        '<tr>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th></tr>',
        
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td>{{sum.renewal}}</td><td>{{sum.renewalCommon}}</td><td>{{sum.renewalB}}</td></tr>',
        
        '{{#data}}<tr><td class="text">{{date}}</td><td>{{renewal}}</td><td>{{renewalCommon}}</td><td>{{renewalB}}</td></tr>{{/data}}',
        '</table>'
    ].join(""),
    
    //续费分析波动统计报告
    TPL_TABLE_5: ['<table><tr>',
        '<th colspan="12">续费金额</th></tr>',
        '<tr><th colspan="4">所有行业</th><th colspan="4">正常行业</th><th colspan="4">特殊行业</th></tr>',
        
        '<tr>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '<th>上期</th><th>本期</th><th>差值</th><th>环比</th>',
        '</tr>',
        
        '<tr>',
        '<td>{{data.lastRenewal}}</td><td>{{data.renewal}}</td><td>{{data.renewalSub}}</td><td>{{data.renewalCompare}}</td>',
         '<td>{{data.lastRenewalCommon}}</td><td>{{data.renewalCommon}}</td><td>{{data.renewalCommonSub}}</td><td>{{data.renewalCommonCompare}}</td>',
         '<td>{{data.lastRenewalB}}</td><td>{{data.renewalB}}</td><td>{{data.renewalBSub}}</td><td>{{data.renewalBCompare}}</td>',
        '</tr>',
        '</table>'
    ].join("")
});
