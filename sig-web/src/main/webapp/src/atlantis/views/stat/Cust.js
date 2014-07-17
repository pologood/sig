/*
 * Atlantis View - Cust
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.Cust = Backbone.View.extend({
    el: document.body,
    
    events: {
        "click a.query": "queryAll",
        "click a.custLog": "sendLog"
    },
    
    initialize: function() {
        _.bindAll(this, 'renderTrade', 'renderTable');
        this.model.bind("change:trade", this.renderTrade);
        this.model.bind("change:data", this.renderTable);
    },
    
    destroy: function() {
        esui.dispose();
        $(".trade").treeselect("destroy");
        this.model.unbind();
        this.$el.unbind();
        this.$el.html("");
    },
    
    pageRendered: false,
    
    render: function(query) {
        window.focus();
        
        //渲染查询区域
        this.$el.html($.Mustache.render("tpl-right") + '<div id="MessageBox" style="display:none"></div>');
        this.$(".query-form").html($.Mustache.render("tpl-query-form-client") + $.Mustache.render("tpl-query-form-trade"));
        this.$(".report-switch").remove();
        this.$(".block4").show();
        
        //上次查询参数
        this.lastAction = null;
        //当前查询参数
        query = decodeURIComponent(query);
        var url_type = T.url.getQueryValue(query, "type"),
            url_date = T.url.getQueryValue(query, "date"),
            url_start = T.url.getQueryValue(query, "start"),
            url_end = T.url.getQueryValue(query, "end"),
            url_year = T.url.getQueryValue(query, "year"),
            url_month = T.url.getQueryValue(query, "month"),
            url_qYear = T.url.getQueryValue(query, "qYear"),
            url_q = T.url.getQueryValue(query, "q"),
            
            url_lastTime_type = T.url.getQueryValue(query, "lastTime.type"),
            url_lastTime_date = T.url.getQueryValue(query, "lastTime.date"),
            url_lastTime_start = T.url.getQueryValue(query, "lastTime.start"),
            url_lastTime_end = T.url.getQueryValue(query, "lastTime.end"),
            url_lastTime_year = T.url.getQueryValue(query, "lastTime.year"),
            url_lastTime_month = T.url.getQueryValue(query, "lastTime.month"),
            url_lastTime_qYear = T.url.getQueryValue(query, "lastTime.qYear"),
            url_lastTime_q = T.url.getQueryValue(query, "lastTime.q"),
            
            url_customerInfoType = T.url.getQueryValue(query, "customerInfoType"),
            url_dimType = T.url.getQueryValue(query, "dimType"),
            url_effectType = T.url.getQueryValue(query, "effectType"),
            url_tradeType = T.url.getQueryValue(query, "tradeType"),
            url_csQuery = T.url.getQueryValue(query, "csQuery"),
            url_opQuery = T.url.getQueryValue(query, "opQuery"),
            url_csId = T.url.getQueryValue(query, "csId"),
            url_opId = T.url.getQueryValue(query, "opId"),
            url_curAddExistDate = T.url.getQueryValue(query, "curAddExistDate"),
            url_product = T.url.getQueryValue(query, "product");
        
        if (url_customerInfoType == "1" && url_csQuery == "无对应客服") {
            url_customerInfoType = "6";
            url_csQuery = "";
            url_csId = "";
        }
        if (url_opQuery == "无对应销售") {
            url_customerInfoType = "7";
            url_opQuery = "";
            url_opId = "";
        }
        if (url_opQuery == "二级代理") {
            url_customerInfoType = "8";
            url_opQuery = "";
            url_opId = "";
        }
        if (url_customerInfoType == "10" && url_csQuery == "无对应客服") {
            url_customerInfoType = "9";
            url_csQuery = "";
            url_csId = "";
        }
        
        this.args = {
            //url参数
            time: {
                type: url_type == null ? "" : url_type,
                date: url_date == null ? "" : url_date,
                start: url_start == null ? "" : url_start,
                end: url_end == null ? "" : url_end,
                year: url_year == null ? "" : url_year,
                month: url_month == null ? "" : url_month,
                qYear: url_qYear == null ? "" : url_qYear,
                q: url_q == null ? "" : url_q
            },
            lastTime: {                                                        
            	type:  url_lastTime_type  == null ? "" : url_lastTime_type,
            	date:  url_lastTime_date  == null ? "" : url_lastTime_date,
            	start: url_lastTime_start == null ? "" : url_lastTime_start,
            	end:   url_lastTime_end   == null ? "" : url_lastTime_end,
            	year:  url_lastTime_year  == null ? "" : url_lastTime_year,
            	month: url_lastTime_month == null ? "" : url_lastTime_month,
            	qYear: url_lastTime_qYear == null ? "" : url_lastTime_qYear,
            	q:     url_lastTime_q     == null ? "" : url_lastTime_q
            },
            cutomerInfo: {
                customerInfoType: url_customerInfoType == null ? "" : url_customerInfoType,
                dimType: url_dimType == null ? "" : url_dimType,
                effectType: url_effectType == null ? "" : url_effectType,
                tradeType: url_tradeType == null ? "" : url_tradeType,
                csQuery: url_csQuery == null ? "" : url_csQuery,
                opQuery: url_opQuery == null ? "" : url_opQuery,
                csId: url_csId == null ? "" : url_csId,
                opId: url_opId == null ? "" : url_opId
            },
            curAddExistDate: url_curAddExistDate == null ? "" : url_curAddExistDate,
            product: url_product == null ? "" : url_product,
            
            //本页默认参数
            pageSize: 20,
            pageNo: 1,
            queryType: 1,
            query: "",
            firstTrades: [], //待获取
            secondTrades: []
        };
        
        //初始化esui
        esui.init(this.el, {
            ClientOverView: {
                datasource: [
                    {name:'客户ID', value: 1},
                    {name:'客户名称', value: 2},
                    {name:'客户账号', value: 5},
                    {name:'关联客服', value: 3},
                    {name:'关联销售', value: 4}
                ],
                value: 1
            },
            Trade: {
                datasource: [
                    {name:'一级行业', value: 1},
                    {name:'二级行业', value: 2}
                ],
                value: 1
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
        
        //绑定事件
        var view = this;
        esui.get("Trade").onchange = function(value, item) {
            $(".trade").treeselect("setLevel", value);
        };
        esui.get("PageSize").onchange = function(value, item) {
            view.lastAction.args.pageSize = value;
            //重新渲染页码
            view.lastAction.args.pageNo = 1;
            view.pageRendered = false;
            //按上次查询条件查询
            view.query(view.lastAction.args);
        };
        esui.get("PageNo").onchange = function(page) {
            view.lastAction.args.pageNo = page + 1;
            //按上次查询条件查询
            view.query(view.lastAction.args);
        };
        
        //获取行业
        if (this.model.get("trade") == null) {
            this.model.getTrade();
        } else { //使用缓存
            this.renderTrade(this.model, this.model.get("trade"));
        }
    },
    
    renderTrade: function(model, data) {
        $(".trade").treeselect({
            options: this.toTreeSelectFormat(data),
            level: 1
        });
        
        //自动按默认条件查询
        this.query(this.args);
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
    
    queryAll: function() {
        //重新渲染页码
        this.args.pageNo = 1;
        this.pageRendered = false;
        
        this.args.queryType = esui.get("ClientOverView").value;
        this.args.query = encodeURIComponent(T.string.trim(esui.get("ClientOverViewKw").getValue()));
        this.args.firstTrades = [];
        this.args.secondTrades = [];
        
        var view = this,
            tradeChecked = $(".trade").treeselect("val");
        if (esui.get("Trade").value == 1) {
            $.each(tradeChecked, function(index, elem) {
                view.args.firstTrades.push(elem.value);
            });
            this.args.secondTrades = [];
        } else {
            $.each(tradeChecked, function(index, elem) {
                if (elem.parentNode.tagName.toLowerCase() == "label") {
                    view.args.secondTrades.push(elem.value);
                }
            });
            this.args.firstTrades = [];
        }
        
        this.query(this.args);
    },
    
    query: function(args) {
        this.model.getData(args);
    },
    
    sendLog: function(e) {
        Util.sendCustLog(4);
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
            this.renderCustomerInfo(args, data);
            
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
    
    renderCustomerInfo: function(args, data) {
        //标题
        this.$(".title").html("客户情况列表");
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "CustsinfoStat",
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
                "lastTime.q": args.lastTime.q,
                "lastTime.qYear": args.lastTime.qYear,
                customerInfoType: args.cutomerInfo.customerInfoType,
                dimType: args.cutomerInfo.dimType,
                effectType: args.cutomerInfo.effectType,
                tradeType: args.cutomerInfo.tradeType,
                csQuery: args.cutomerInfo.csQuery,
                opQuery: args.cutomerInfo.opQuery,
                csId: args.cutomerInfo.csId,
                opId: args.cutomerInfo.opId,
                curAddExistDate: args.curAddExistDate,
                queryType: args.queryType,
                query: args.query,
                firstTrades: args.firstTrades.join(","),
                secondTrades: args.secondTrades.join(","),
                product: args.product
            })
        });
        //表格
        this.$(".grid").html(Mustache.to_html(this.TPL_TABLE, {
            data: data.data
        }));
        Util.fixTable(this.$(".grid"));
    },
    
    TPL_TABLE: ['<table><tr>',
        '<th>客户ID</th><th>客户名称</th><th>客户账号</th><th>关联销售</th><th>关联客服</th><th>一级行业</th><th>二级行业</th><th>注册时间</th></tr>',
        '{{#data}}<tr><td class="text">{{custId}}</td><td class="text"><div class="ellipsis" style="width:270px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></td>',
        '<td class="text">{{custEmail}}</td>',
        '<td class="text">{{custOp}}</td><td class="text">{{custCs}}</td><td class="text">{{firstTrade}}</td>',
        '<td class="text">{{secondTrade}}</td><td class="text">{{registerDate}}</td>',
        '</tr>{{/data}}</table>'
    ].join("")
});
