/*
 * Agent View - IncrementSales
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.IncrementSales = Backbone.View.extend({
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
        Agent.Widgets.TreeNav = new Agent.Views.TreeNav(1, 2, 1);
    },

    pageRendered: false,

    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();

        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".report-switch").html($.Mustache.render("tpl-report-type3") + $.Mustache.render("tpl-data-type"));
        this.$(".query-form").html($.Mustache.render("tpl-query-form-dwmq") + $.Mustache.render("tpl-query-form-compare") + $.Mustache.render("tpl-query-form-sale"));

        //上次查询参数
        this.lastAction = null;
        //当前查询参数
        this.actionIndex = 0;
        this.action = ["NewCustomerStatAction.getNewCustomerStatByOp",
                       "NewCustomerStatAction.getNewCustomerStatByOpCompare",
                       "NewCustomerOnlineStatAction.getNewCustomerOnlineByOp",
                       "NewCustomerOnlineStatAction.getNewCustomerOnlineByOpCompare"];
        this.overviewArgsOfWM = null;
        this.overviewArgsOfDWMQ = null;
        this.contrastArgsOfDWMQ = null;

        //初始化日历相关元素
        Agent.Calendar.init(this);

        this.overviewArgsOfDWMQ.queryType = 4;
        this.overviewArgsOfDWMQ.query = "";
        this.contrastArgsOfDWMQ.queryType = 4;
        this.contrastArgsOfDWMQ.query = "";

        /*
         * 初始化其他的元素
         */
        //选择新开户和入资分析
        esui.get("Report1").setChecked(true);
        //选择整体趋势
        esui.get("Data1").setChecked(true);
        this.bindEsui();
        this.query({
            method: this.action[this.actionIndex],
            args: this.overviewArgsOfDWMQ
        });
    },
    
    bindEsui: function() {
        var view = this;

        //切换报告
        esui.get("Report1").onclick = function(value, item) {
            if(esui.get("Data1").isChecked()) {
                view.actionIndex = 0;
            } else if(esui.get("Data2").isChecked()) {
                view.actionIndex = 1;
            }
        };
        esui.get("Report2").onclick = function(value, item) {
            if(esui.get("Data1").isChecked()) {
                view.actionIndex = 2;
            } else if(esui.get("Data2").isChecked()) {
                view.actionIndex = 3;
            }
        };
        esui.get("Data1").onclick = function(value, item) {
            if(esui.get("Report1").isChecked()) {
                view.actionIndex = 0;
            } else if(esui.get("Report2").isChecked()) {
                view.actionIndex = 2;
            }
            $("#Right .block12").show();
            $("#Right .block2").hide();
        };
        esui.get("Data2").onclick = function(value, item) {
            if(esui.get("Report1").isChecked()) {
                view.actionIndex = 1;
            } else if(esui.get("Report2").isChecked()) {
                view.actionIndex = 3;
            }
            $("#Right .block12").hide();
            $("#Right .block2").show();
        };
    },
    
    queryAll: function() {
        //重新渲染页码
        this.overviewArgsOfDWMQ.pageNo = 1;
        this.contrastArgsOfDWMQ.pageNo = 1;
        this.pageRendered = false;
        //按当前查询区域的状态查询
        var argsthis;
        switch(this.actionIndex) {
            case 0:
                this.overviewArgsOfDWMQ.queryType = 4;
                this.overviewArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("SalesName").getValue()));
                argsthis = this.overviewArgsOfDWMQ;
                break;
            case 1:
                this.contrastArgsOfDWMQ.queryType = 4;
                this.contrastArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("SalesName").getValue()));
                argsthis = this.contrastArgsOfDWMQ;
                break;
            case 2:
                this.overviewArgsOfDWMQ.queryType = 4;
                this.overviewArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("SalesName").getValue()));
                argsthis = this.overviewArgsOfDWMQ;
                break;
            case 3:
                this.contrastArgsOfDWMQ.queryType = 4;
                this.contrastArgsOfDWMQ.query = encodeURIComponent(T.string.trim(esui.get("SalesName").getValue()));
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
        if (T.url.getQueryValue(param, "opId") == "-2") {
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
            if(this.lastAction.method == "NewCustomerStatAction.getNewCustomerStatByOp") {
                this.renderNewCustomerStatByOp(args, data);
            }
            if(this.lastAction.method == "NewCustomerStatAction.getNewCustomerStatByOpCompare") {
                this.renderNewCustomerStatByOpCompare(args, data);
            }
            if(this.lastAction.method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByOp") {
                this.renderNewCustomerOnlineByOp(args, data);
            }
            if(this.lastAction.method == "NewCustomerOnlineStatAction.getNewCustomerOnlineByOpCompare") {
                this.renderNewCustomerOnlineByOpCompare(args, data);
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
    
    renderNewCustomerStatByOp: function(args, data) {
        //标题
        this.$(".title").html("销售员维度新开客户和入资分析统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerStatByOp",
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
                query: args.query
            })
        });

        var params = {
            customerInfoType: 1,
            dimType: 2
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        //表格
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_1, {
            op: decodeURIComponent(args.query),
            sum: data.sum,
            data: data.data,
            args: thisargs
        })));
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderNewCustomerStatByOpCompare: function(args, data) {
        //标题
        this.$(".title").html("销售员维度新开客户和入资分析波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerStatByOpCompare",
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
                queryType: args.queryType,
                query: args.query
            })
        });
        //表格
        var params = {
            customerInfoType: 1,
            dimType: 2
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        var lastargs = Util.toUrl(args, params, 2, 2);
        if(args.time.type != 1) {//非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_2, {
                op: decodeURIComponent(args.query),
                sum: data.sum,
                data: data.data,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        } else {//按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_2 : this.TPL_TABLE_2.replace(/环比/g, "周同比"), {
                op: decodeURIComponent(args.query),
                sum: data.sum,
                data: data.data,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        }
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderNewCustomerOnlineByOp: function(args, data) {
        //标题
        this.$(".title").html("销售员维度客户上线情况统计报告");
        //时间
        this.$(".duration").html(Util.getReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerOnlineByOp",
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
            dimType: 2
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        //表格
        this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_3, {
            op: decodeURIComponent(args.query),
            sum: data.sum,
            data: data.data,
            args: thisargs
        })));
        
        Util.fixTable(this.$(".grid"));
    },
    
    renderNewCustomerOnlineByOpCompare: function(args, data) {
        //标题
        this.$(".title").html("销售员维度客户上线情况波动统计报告");
        //时间
        this.$(".duration").html(Util.getCompareReportDuration(args));
        //下载
        this.$(".download").attr({
            href: '../../download?' + T.url.jsonToQuery({
                reportName: "NewCustomerOnlineByOpCompare",
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
                queryType: args.queryType,
                query: args.query
            })
        });

        var params = {
            customerInfoType: 1,
            dimType: 2
        };
        var thisargs = Util.toUrl(args, params, 2, 1);
        var lastargs = Util.toUrl(args, params, 2, 2);
        //表格
        if(args.time.type != 1) {//非按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE_4, {
                op: decodeURIComponent(args.query),
                sum: data.sum,
                data: data.data,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        } else {//按日
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(esui.get("Contrast1").isChecked() ? this.TPL_TABLE_4 : this.TPL_TABLE_4.replace(/环比/g, "周同比"), {
                op: decodeURIComponent(args.query),
                sum: data.sum,
                data: data.data,
                thisargs: thisargs,
                lastargs: lastargs
            })));
        }

        Util.fixTable(this.$(".grid"));
    },
    
    TPL_TABLE_1: ['<table><tr>',
        '<th colspan="1" rowspan="2">销售员名称</th>',
        '<th colspan="4">新开户数</th>',
        '<th colspan="3">首次入资金额</th>',
        '<th colspan="3">户均首次入资金额</th></tr>',
        '<tr>',
        '<th>开户总数</th><th>有效开户数</th><th>无效开户数(特殊行业)</th><th>无效开户数(其他)</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th>',
        '<th>所有行业</th><th>正常行业</th><th>特殊行业</th></tr>',
        
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td><a href="#" param="{{args}}&effectType=1&opQuery={{op}}">{{sum.newCusts}}</a></td><td><a href="#" param="{{args}}&effectType=2&opQuery={{op}}">{{sum.newCustsEffect}}</a></td><td><a href="#" param="{{args}}&effectType=3&opQuery={{op}}">{{sum.newCustsB}}</a></td><td><a href="#" param="{{args}}&effectType=4&opQuery={{op}}">{{sum.newCustsCommon}}</a></td>',
        '<td>{{sum.newInvest}}</td><td>{{sum.newInvestCommon}}</td><td>{{sum.newInvestB}}</td>',
        '<td>{{sum.newInvestPerCust}}</td><td>{{sum.newInvestPerCustCommon}}</td><td>{{sum.newInvestPerCustB}}</td></tr>',
        
        '{{#data}}<tr><td class="text">{{opName}}</td>',
        '<td><a href="#" param="{{args}}&effectType=1&opQuery={{opName}}&opId={{opId}}">{{newCusts}}</a></td><td><a href="#" param="{{args}}&effectType=2&opQuery={{opName}}&opId={{opId}}">{{newCustsEffect}}</a></td><td><a href="#" param="{{args}}&effectType=3&opQuery={{opName}}&opId={{opId}}">{{newCustsB}}</a></td><td><a href="#" param="{{args}}&effectType=4&opQuery={{opName}}&opId={{opId}}">{{newCustsCommon}}</a></td>',
        '<td>{{newInvest}}</td><td>{{newInvestCommon}}</td><td>{{newInvestB}}</td>',
        '<td>{{newInvestPerCust}}</td><td>{{newInvestPerCustCommon}}</td><td>{{newInvestPerCustB}}</td></tr>{{/data}}',
        
        '</table>'
    ].join(""),
    
    //销售员维度新开客户和入资分析波动统计
    TPL_TABLE_2: ['<table><tr>',
        '<th colspan="1" rowspan="3">销售员名称</th>',
        '<th colspan="16">新开户数</th>',
        '<th colspan="12">首次入资金额</th>',
        '<th colspan="12">户均首次入资金额</th></tr>',
        
        '<tr><th colspan="4">开户总数</th><th colspan="4">有效开户数</th><th colspan="4">无效开户数(特殊行业)</th><th colspan="4">无效开户数(其他)</th>',
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
        '</tr>',
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td><a href="#" param="{{lastargs}}&effectType=1&opQuery={{op}}">{{sum.lastNewCusts}}</a></td><td><a href="#" param="{{thisargs}}&effectType=1&opQuery={{op}}">{{sum.newCusts}}</a></td><td>{{sum.newCustsSub}}</td><td>{{sum.newCustsCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=2&opQuery={{op}}">{{sum.lastNewCustsEffect}}</a></td><td><a href="#" param="{{thisargs}}&effectType=2&opQuery={{op}}">{{sum.newCustsEffect}}</a></td><td>{{sum.newCustsEffectSub}}</td><td>{{sum.newCustsEffectCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=3&opQuery={{op}}">{{sum.lastNewCustsB}}</a></td><td><a href="#" param="{{thisargs}}&effectType=3&opQuery={{op}}">{{sum.newCustsB}}</a></td><td>{{sum.newCustsBSub}}</td><td>{{sum.newCustsBCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=4&opQuery={{op}}">{{sum.lastNewCustsCommon}}</a></td><td><a href="#" param="{{thisargs}}&effectType=4&opQuery={{op}}">{{sum.newCustsCommon}}</a></td><td>{{sum.newCustsCommonSub}}</td><td>{{sum.newCustsCommonCompare}}</td>',
        
         //首次入资金额
       '<td>{{sum.lastNewInvest}}</td><td>{{sum.newInvest}}</td><td>{{sum.newInvestSub}}</td><td>{{sum.newInvestCompare}}</td>',
       '<td>{{sum.lastNewInvestCommon}}</td><td>{{sum.newInvestCommon}}</td><td>{{sum.newInvestCommonSub}}</td><td>{{sum.newInvestCommonCompare}}</td>',
       '<td>{{sum.lastNewInvestB}}</td><td>{{sum.newInvestB}}</td><td>{{sum.newInvestBSub}}</td><td>{{sum.newInvestBCompare}}</td>',
        //户均首次入资金额
        '<td>{{sum.lastNewInvestPerCust}}</td><td>{{sum.newInvestPerCust}}</td><td>{{sum.newInvestPerCustSub}}</td><td>{{sum.newInvestPerCustCompare}}</td>',
        '<td>{{sum.lastNewInvestPerCustCommon}}</td><td>{{sum.newInvestPerCustCommon}}</td><td>{{sum.newInvestPerCustCommonSub}}</td><td>{{sum.newInvestPerCustCommonCompare}}</td>',
        '<td>{{sum.lastNewInvestPerCustB}}</td><td>{{sum.newInvestPerCustB}}</td><td>{{sum.newInvestPerCustBSub}}</td><td>{{sum.newInvestPerCustBCompare}}</td>',
        '</tr>',
        '{{#data}}<tr>',//新开户数
        '<td class="text">{{opName}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=1&opQuery={{opName}}&opId={{opId}}">{{lastNewCusts}}</a></td><td><a href="#" param="{{thisargs}}&effectType=1&opQuery={{opName}}&opId={{opId}}">{{newCusts}}</a></td><td>{{newCustsSub}}</td><td>{{newCustsCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=2&opQuery={{opName}}&opId={{opId}}">{{lastNewCustsEffect}}</a></td><td><a href="#" param="{{thisargs}}&effectType=2&opQuery={{opName}}&opId={{opId}}">{{newCustsEffect}}</a></td><td>{{newCustsEffectSub}}</td><td>{{newCustsEffectCompare}}</a></td>',
        '<td><a href="#" param="{{lastargs}}&effectType=3&opQuery={{opName}}&opId={{opId}}">{{lastNewCustsB}}</a></td><td><a href="#" param="{{thisargs}}&effectType=3&opQuery={{opName}}&opId={{opId}}">{{newCustsB}}</a></td><td>{{newCustsBSub}}</td><td>{{newCustsBCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&effectType=4&opQuery={{opName}}&opId={{opId}}">{{lastNewCustsCommon}}</a></td><td><a href="#" param="{{thisargs}}&effectType=4&opQuery={{opName}}&opId={{opId}}">{{newCustsCommon}}</a></td><td>{{newCustsCommonSub}}</td><td>{{newCustsCommonCompare}}</td>',
         //首次入资金额
       '<td>{{lastNewInvest}}</td><td>{{newInvest}}</td><td>{{newInvestSub}}</td><td>{{newInvestCompare}}</td>',
       '<td>{{lastNewInvestCommon}}</td><td>{{newInvestCommon}}</td><td>{{newInvestCommonSub}}</td><td>{{newInvestCommonCompare}}</td>',
       '<td>{{lastNewInvestB}}</td><td>{{newInvestB}}</td><td>{{newInvestBSub}}</td><td>{{newInvestBCompare}}</td>',
        //户均首次入资金额
        '<td>{{lastNewInvestPerCust}}</td><td>{{newInvestPerCust}}</td><td>{{newInvestPerCustSub}}</td><td>{{newInvestPerCustCompare}}</td>',
        '<td>{{lastNewInvestPerCustCommon}}</td><td>{{newInvestPerCustCommon}}</td><td>{{newInvestPerCustCommonSub}}</td><td>{{newInvestPerCustCommonCompare}}</td>',
        '<td>{{lastNewInvestPerCustB}}</td><td>{{newInvestPerCustB}}</td><td>{{newInvestPerCustBSub}}</td><td>{{newInvestPerCustBCompare}}</td>',
        '</tr>{{/data}}',
        '</table>'
    ].join(""),
    
    //销售员维度 客户上线情况统计报告
    TPL_TABLE_3: ['<table><tr>',
        '<th colspan="1" rowspan="2">销售员名称</th>',
        '<th colspan="3">新开户数</th>',
        '<th colspan="3">新开有消耗客户数</th>',
        '<th colspan="3">新开无消耗客户数</th></tr>',

        '<tr><th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th>',
        '<th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th>',
        '<th colspan="1">所有行业</th><th colspan="1">正常行业</th><th colspan="1">特殊行业</th></tr>',
        //总体
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td><a href="#" param="{{args}}&tradeType=1&opQuery={{op}}">{{sum.newCusts}}</a></td><td><a href="#" param="{{args}}&tradeType=2&opQuery={{op}}">{{sum.newCustsCommon}}</a></td><td><a href="#" param="{{args}}&tradeType=3&opQuery={{op}}">{{sum.newCustsB}}</a></td>',
        '<td>{{sum.newCostCusts}}</td><td>{{sum.newCostCustsCommon}}</td><td>{{sum.newCostCustsB}}</td>',
        '<td>{{sum.newNoCostCusts}}</td><td>{{sum.newNoCostCustsCommon}}</td><td>{{sum.newNoCostCustsB}}</td></tr>',
       
        '{{#data}}<tr><td class="text">{{opName}}</td>',//按销售员统计
        '<td><a href="#" param="{{args}}&tradeType=1&opQuery={{opName}}&opId={{opId}}">{{newCusts}}</a></td><td><a href="#" param="{{args}}&tradeType=2&opQuery={{opName}}&opId={{opId}}">{{newCustsCommon}}</a></td><td><a href="#" param="{{args}}&tradeType=3&opQuery={{opName}}&opId={{opId}}">{{newCustsB}}</a></td>',
        '<td>{{newCostCusts}}</td><td>{{newCostCustsCommon}}</td><td>{{newCostCustsB}}</td>',
        '<td>{{newNoCostCusts}}</td><td>{{newNoCostCustsCommon}}</td><td>{{newNoCostCustsB}}</td></tr>',
        '</tr>{{/data}}',
        '</table>'
    ].join(""),
    
    //销售员维度 客户上线情况波动情况报告
    TPL_TABLE_4: ['<table><tr>',
        '<th colspan="1" rowspan="3">销售员名称</th>',
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
        '<td><a href="#" param="{{lastargs}}&tradeType=1&opQuery={{op}}">{{sum.lastNewCusts}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=1&opQuery={{op}}">{{sum.newCusts}}</a></td><td>{{sum.newCustsSub}}</td><td>{{sum.newCustsCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=2&opQuery={{op}}">{{sum.lastNewCustsCommon}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=2&opQuery={{op}}">{{sum.newCustsCommon}}</a></td><td>{{sum.newCustsCommonSub}}</td><td>{{sum.newCustsCommonCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=3&opQuery={{op}}">{{sum.lastNewCustsB}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=3&opQuery={{op}}">{{sum.newCustsB}}</a></td><td>{{sum.newCustsBSub}}</td><td>{{sum.newCustsBCompare}}</td>',
        
        '<td>{{sum.lastNewCostCusts}}</td><td>{{sum.newCostCusts}}</td><td>{{sum.newCostCustsSub}}</td><td>{{sum.newCostCustsCompare}}</td>',
        '<td>{{sum.lastNewCostCustsCommon}}</td><td>{{sum.newCostCustsCommon}}</td><td>{{sum.newCostCustsCommonSub}}</td><td>{{sum.newCostCustsCommonCompare}}</td>',
        '<td>{{sum.lastNewCostCustsB}}</td><td>{{sum.newCostCustsB}}</td><td>{{sum.newCostCustsBSub}}</td><td>{{sum.newCostCustsBCompare}}</td>',
        
        '<td>{{sum.lastNewNoCostCusts}}</td><td>{{sum.newNoCostCusts}}</td><td>{{sum.newNoCostCustsSub}}</td><td>{{sum.newNoCostCustsCompare}}</td>',
        '<td>{{sum.lastNewNoCostCustsCommon}}</td><td>{{sum.newNoCostCustsCommon}}</td><td>{{sum.newNoCostCustsCommonSub}}</td><td>{{sum.newNoCostCustsCommonCompare}}</td>',
        '<td>{{sum.lastNewNoCostCustsB}}</td><td>{{sum.newNoCostCustsB}}</td><td>{{sum.newNoCostCustsBSub}}</td><td>{{sum.newNoCostCustsBCompare}}</td>',
        '</tr>',
        '{{#data}}<tr><td class="text">{{opName}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=1&opQuery={{opName}}&opId={{opId}}">{{lastNewCusts}}</a></td><td><a href="#" param="{{thisargs}}&tradeType=1&opQuery={{opName}}&opId={{opId}}">{{newCusts}}</a></td><td>{{newCustsSub}}</td><td>{{newCustsCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=2&opQuery={{opName}}&opId={{opId}}">{{lastNewCustsCommon}}</td><td><a href="#" param="{{thisargs}}&tradeType=2&opQuery={{opName}}&opId={{opId}}">{{newCustsCommon}}</a></td><td>{{newCustsCommonSub}}</td><td>{{newCustsCommonCompare}}</td>',
        '<td><a href="#" param="{{lastargs}}&tradeType=3&opQuery={{opName}}&opId={{opId}}">{{lastNewCustsB}}</td><td><a href="#" param="{{thisargs}}&tradeType=3&opQuery={{opName}}&opId={{opId}}">{{newCustsB}}</a></td><td>{{newCustsBSub}}</td><td>{{newCustsBCompare}}</td>',
        
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
