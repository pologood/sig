/*
 * Agent View - 账户优化
 * @author : liangxiao
 * @date   : 2013
 */

Agent.Views.OptAccount = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "onQuery",
        "click a.custLog": "sendLog",
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
    
    sendLog: function(e) {
        Util.sendCustLog(8);
    },
    
    renderTopNav: function() {
        Agent.Widgets.TopNav.render(1);
    },
    
    renderTreeNav: function() {
        Agent.Widgets.TreeNavSimple = new Agent.Views.TreeNavSimple(Agent.TreeNav.Cust, 1, Agent.Auth.ViewOptDetail ? 0 : 1);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //加载模版
        this.$el.mustache("tpl-right");
        this.$(".topbar").remove();
        var view = this;
        $.Mustache.load('../../asset/agent/tpl/opt-account.html').done(function() {
            view.$(".report-switch").before($.Mustache.render("tpl-opt-account-tip"));
            view.$('.report-switch').mustache("tpl-opt-account-title");
            view.$('.query-form').mustache("tpl-opt-account-query");
            
            //初始化控件
            view.initComponent();
            
            //初始查询
            view.lastArgs = {};
            view.getArgs();
            view.lastArgs.pageSize = 20;
            view.lastArgs.sortBy = "enhancePotential";
            view.lastArgs.des = true;
            view.queryFirstPage();
        });
    },
    
    initComponent: function() {
        esui.init(this.el, {
            "QueryType": {
                datasource: [
                    {name:'客户ID', value: 1},
                    {name:'客户名称', value: 2},
                    {name:'客户账号', value: 3},
                    {name:'关联客服', value: 4}
                ],
                value: 2
            },
            "Potential": {
                datasource: [
                    {name:'全部', value: 0},
                    {name:'非常高', value: 5},
                    {name:'高', value: 4},
                    {name:'一般', value: 3},
                    {name:'比较低', value: 2},
                    {name:'非常低', value: 1}
                ],
                value: 0
            },
            "PageSize": {
                datasource: [
                    {name:'20', value: 20},
                    {name:'50', value: 50},
                    {name:'100', value: 100}
                ],
                value: 20
            }
        });
        
        this.bindPage();
    },
    
    bindPage: function() {
        var view = this;
        esui.get("PageSize").onchange = function(value, item) {
            view.lastArgs.pageSize = value;
            view.queryFirstPage();
        };
        esui.get("PageNo").onchange = function(page) {
            view.lastArgs.pageNo = page + 1;
            view.query(view.lastArgs);
        };
    },
    
    getArgs: function() {
        this.lastArgs.selectCustomerId = esui.get("QueryType").value;
        this.lastArgs.selectCustomerValue = $.trim(esui.get("Query").getValue());
        
        var opt = [];
        this.$(".query-form input:checkbox").each(function(index, elem) {
            if (elem.checked) {
                opt.push(parseInt(elem.value, 10));
            }
        });
        this.lastArgs.optimizationType = opt.length == 0 ? null : opt;
        
        var potential = esui.get("Potential").value;
        this.lastArgs.enhancePotential = potential == 0 ? null : potential;
    },
    
    onQuery: function() {
        this.getArgs();
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
            
            //页码
            this.renderPage(data.rowCount);
            
            //表格
            var op = true; //优化入口
            if ($("#AdminRoleID").val() == "1007") { //mis代管用户，且为只读权限
                op = false;
            } else if (!Agent.Auth.ViewOptDetail) {
                op = false;
            }
            var table = $.Mustache.render("tpl-opt-account-table", {
                data: data.data,
                op: op ? [1] : [],
                agentUserId: $("#UserId").val()
            });
            this.$(".grid").html(Util.format.toRed(table));
            
            //排序
            var th = this.$('.grid th[sortby="' + args.sortBy + '"]');
            th.addClass(args.des == true ? "des" : "asc");
            
            Util.fixTable(this.$(".grid"));
        }
    },
    
    sort: function(e) {
        var me = e.target,
            th = me.tagName.toLowerCase() != "th" ? $(me).parent() : $(me);
        this.lastArgs.sortBy = th.attr("sortby");
        if (th.hasClass("asc")) { //升序
            this.lastArgs.des = true;
        } else if (th.hasClass("des")) { //降序
            this.lastArgs.des = false;
        } else { //未排序
            this.lastArgs.des = true;
        }
        
        this.queryFirstPage();
    }
});
