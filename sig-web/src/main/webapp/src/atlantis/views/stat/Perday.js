/*
 * Atlantis View - Perday
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.Perday = Backbone.View.extend({
    el: document.body,
    
    initialize: function() {
        _.bindAll(this, 'renderTable');
        this.model.bind("change:data", this.renderTable);
    },
    
    destroy: function() {
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.html("");
    },
    
    render: function(query) {
        window.focus();
        var json = T.url.queryToJson(decodeURIComponent(query));
        
        //渲染查询区域
        this.$el.html($.Mustache.render("tpl-right"));
        this.$(".report-switch").remove();
        this.$(".query-form").remove();
        this.$(".query").remove();
        this.$(".result").show();
        this.$(".page").remove();
        this.$(".result").css({"margin-bottom": 20});
        
        //查询参数
        this.args = {
            time: {
                type: 3,
                year: json.year,
                month: json.month
            },
            custId: json.custId,
            product: json.product,
            pageSize: 50,
            pageNo: 1
        };
        
        //标题
        this.$(".title").html("客户每日消耗统计报告");
        this.$(".topbar").after('<div class="topbar">' + json.custName + '</div>');
        //时间
        this.$(".duration").html(Util.getReportDuration(this.args));
        //下载
        this.$(".download").attr({
            href: '../../download?'+ T.url.jsonToQuery({
                reportName: "CustCpcCostByDay",
                type: 3,
                year: json.year,
                month: json.month,
                custId: json.custId,
                product: json.product
            })
        });
        
        this.query(this.args);
    },
    
    query: function(args) {
        this.model.getData(args);
    },
    
    renderTable: function(model, data) {
        var args = this.args;
        
        if (data.data.length == 0) {
            this.$(".result .info").show();
            this.$(".result .data").hide();
        } else {
            this.$(".result .info").hide();
            this.$(".result .data").show();
            
            //表格
            var th1 = args.product == 1 ? "总消耗" : (args.product == 2 ? "旭日总消耗" : "晨星总消耗"),
                th2 = args.product == 1 ? "计业绩消耗" : (args.product == 2 ? "旭日计业绩消耗" : "晨星计业绩消耗"),
                th3 = args.product == 1 ? "不计业绩消耗" : (args.product == 2 ? "旭日不计业绩消耗" : "晨星不计业绩消耗"),
                th4 = args.product == 1 ? "总消耗点击均价" : (args.product == 2 ? "旭日总消耗点击均价" : "晨星总消耗点击均价");
            this.$(".grid").html(Mustache.to_html(this.TPL_TABLE, {
                th1: th1,
                th2: th2,
                th3: th3,
                th4: th4,
                sum: data.sum,
                data: data.data
            }));
        }
    },
    
    TPL_TABLE: ['<table>',
        '<tr><th>时间</th><th>{{th1}}</th><th>{{th2}}</th><th>{{th3}}</th><th>点击数</th><th>{{th4}}</th></tr>',
        '<tr class="sum"><td class="text"><strong>总计</strong></td>',
        '<td>{{sum.cost}}</td><td>{{sum.costAB}}</td><td>{{sum.costC}}</td><td>{{sum.click}}</td><td>{{sum.cpc}}</td></tr>',
        '{{#data}}<tr><td class="text">{{time}}</td>',
        '<td>{{cost}}</td><td>{{costAB}}</td><td>{{costC}}</td><td>{{click}}</td><td>{{cpc}}</td>',
        '</tr>{{/data}}</table>'
    ].join("")
});
