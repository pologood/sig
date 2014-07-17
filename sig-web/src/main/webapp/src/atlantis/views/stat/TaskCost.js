/*
 * Agent View - TaskCost
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.TaskCost = Backbone.View.extend({
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
        Agent.Widgets.TreeNav = new Agent.Views.TreeNav(0, 0, 0);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染查询区域
        this.$el.mustache("tpl-task");
        
        //上次查询参数
        this.lastAction = null;
        //当前查询参数
        this.args = {
            time: {
                type: 0,
                startYear: Agent.Calendar.lastYearOfMonthSelect,
                startMonth: Agent.Calendar.lastMonthOfMonthSelect,
                endYear: Agent.Calendar.lastYearOfMonthSelect,
                endMonth: Agent.Calendar.lastMonthOfMonthSelect,
                qYear: Agent.Calendar.lastYearOfQSelect,
                q: Agent.Calendar.lastQOfQSelect
            }
        };
        
        //初始化esui
        esui.init(this.el, {
            Task: {
                datasource: [
                    {name:'当前任务进度', value: 0},
                    {name:'按月(区间)', value: 4},
                    {name:'按季度', value: 5}
                ],
                value: 0
            },
            TaskStartYear: {
                datasource: Agent.Calendar.year,
                value: this.args.time.startYear
            },
            TaskStartMonth: {
                datasource: Agent.Calendar.thisMonth == 0
                          ? Agent.Calendar.monthOfLastYear : Agent.Calendar.monthOfThisYear,
                value: this.args.time.startMonth
            },
            TaskEndYear: {
                datasource: Agent.Calendar.year,
                value: this.args.time.endYear
            },
            TaskEndMonth: {
                datasource: Agent.Calendar.thisMonth == 0
                          ? Agent.Calendar.monthOfLastYear : Agent.Calendar.monthOfThisYear,
                value: this.args.time.endMonth
            },
            TaskQYear: {
                datasource: Agent.Calendar.year,
                value: this.args.time.qYear
            },
            TaskQ: {
                datasource: (Agent.Calendar.thisMonth == 0 || Agent.Calendar.thisMonth == 1 || Agent.Calendar.thisMonth == 2)
                            ? Agent.Calendar.quarterOfLastYear : Agent.Calendar.quarterOfThisYear,
                value: this.args.time.q
            }
        });
        
        //绑定事件
        var view = this;
        esui.get("Task").onchange = function(value, item) {
            var times = $(this.main).parent().children("div.time");
            switch (value) {
                case 0:
                    $(times[0]).hide();
                    $(times[1]).hide();
                    break;
                case 4:
                    $(times[0]).show();
                    $(times[1]).hide();
                    break;
                case 5:
                    $(times[0]).hide();
                    $(times[1]).show();
            }
            
            view.args.time.type = value;
        };
        esui.get("TaskStartYear").onchange = function(value, item) {
            var month = esui.get("TaskStartMonth");
            var list = Util.date.getMonthList(value);
            month.datasource = list;
            month.value = list[list.length - 1].value;
            month.render();
            
            view.args.time.startYear = value;
            view.args.time.startMonth = month.value;
        };
        esui.get("TaskEndYear").onchange = function(value, item) {
            var month = esui.get("TaskEndMonth");
            var list = Util.date.getMonthList(value);
            month.datasource = list;
            month.value = list[list.length - 1].value;
            month.render();
            
            view.args.time.endYear = value;
            view.args.time.endMonth = month.value;
        };
        esui.get("TaskQYear").onchange = function(value, item) {
            var quarter = esui.get("TaskQ");
            var list = Util.date.getQuarterList(value);
            quarter.datasource = list;
            quarter.value = list[list.length - 1].value;
            quarter.render();
            
            view.args.time.qYear = value;
            view.args.time.q = quarter.value;
        };
        esui.get("TaskStartMonth").onchange = function(value, item) {
            view.args.time.startMonth = value;
        };
        esui.get("TaskEndMonth").onchange = function(value, item) {
            view.args.time.endMonth = value;
        };
        esui.get("TaskQ").onchange = function(value, item) {
            view.args.time.q = value;
        };
        
        //自动按默认条件查询
        this.query(this.args);
    },
    
    queryAll: function() {
        //验证月区间
        if (this.args.time.type == 4) {
            var start = this.args.time.startMonth + "/1/" + this.args.time.startYear;
            var end = this.args.time.endMonth + "/1/" + this.args.time.endYear;
            if (Date.parse(start).compareTo(Date.parse(end)) == 1) {
                this.showError("开始月份不能晚于结束月份");
                return;
            }
        }
        this.query(this.args);
    },
    
    query: function(args) {
        this.model.getData(args);
    },
    
    renderTable: function(model, data) {
        this.lastAction = model.lastAction;
        var args = this.lastAction.args;
        this.$(".result").show();
        if (args.time.type == 0) {
            this.$(".data1").show();
            this.$(".data2").show();
            this.$(".data1 .download").attr({
                href: '../../download?reportName=CostTaskCurrMonthStat'
            });
            this.$(".data2 .download").attr({
                href: '../../download?reportName=CostTaskCurrQuarterStat'
            });
            this.$(".data1 .grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE1, {
                data: data.data.monthTasks[0]
            })));
            this.$(".data2 .grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE2, {
                data: data.data.quarterTask
            })));
            Util.fixTable(this.$(".data1 .grid"));
            Util.fixTable(this.$(".data2 .grid"));
        }
        if (args.time.type == 4) {
            this.$(".data1").show();
            this.$(".data2").hide();
            this.$(".download").attr({
                href: '../../download?'+ T.url.jsonToQuery({
                    reportName: "CostTaskMonthStat",
                    type: args.time.type,
                    startYear: args.time.startYear,
                    startMonth: args.time.startMonth,
                    endYear: args.time.endYear,
                    endMonth: args.time.endMonth
                })
            });
            this.$(".data1 .grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE3, {
                data: data.data.monthTasks
            })));
            this.$(".data2 .grid").html("");
            Util.fixTable(this.$(".data1 .grid"));
        }
        if (args.time.type == 5) {
            this.$(".data1").hide();
            this.$(".data2").show();
            this.$(".download").attr({
                href: '../../download?'+ T.url.jsonToQuery({
                    reportName: "CostTaskQuarterStat",
                    type: args.time.type,
                    qYear: args.time.qYear,
                    q: args.time.q
                })
            });
            this.$(".data1 .grid").html("");
            this.$(".data2 .grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE4, {
                data: data.data.quarterTask
            })));
            Util.fixTable(this.$(".data2 .grid"));
        }
    },
    
    TPL_TABLE1: ['<table><tr>',
        '<th>总任务</th><th>竞价服务总消耗</th><th>竞价服务计业绩消耗</th><th>竞价服务不计业绩消耗</th><th>旭日总消耗</th><th>晨星总消耗</th><th>任务进度',
        '<span class="help" title="竞价服务计业绩消耗与总任务比值"></span></th>',
        '<th>时间进度</th><th>时间进度差</th><th>剩余日所需日均<span class="help" title="剩余日所需完成竞价服务计业绩消耗均值"></span></th></tr>',
        '<tr><td>{{data.totalPayTask}}</td><td>{{data.totalPay}}</td><td>{{data.abPay}}</td><td>{{data.cpay}}</td><td>{{data.cpcPay}}</td><td>{{data.cxPay}}</td><td>{{data.payTaskProgress}}</td>',
        '<td>{{data.monthTimeProgress}}</td><td>{{data.monthTimeProgressSub}}</td><td>{{data.monthTaskNeedDayPay}}</td>',
        '</tr></table>'
    ].join(""),
    
    TPL_TABLE2: ['<table><tr>',
        '<th>总任务</th><th>竞价服务总消耗</th><th>竞价服务计业绩消耗</th><th>竞价服务不计业绩消耗</th><th>旭日总消耗</th><th>晨星总消耗</th><th>任务进度',
        '<span class="help" title="竞价服务计业绩消耗与总任务比值"></span></th>',
        '<th>时间进度</th><th>时间进度差</th><th>剩余日所需日均<span class="help" title="剩余日所需完成竞价服务计业绩消耗均值"></span></th></tr>',
        '<tr><td>{{data.totalPayTask}}</td><td>{{data.totalPay}}</td><td>{{data.abPay}}</td><td>{{data.cpay}}</td><td>{{data.cpcPay}}</td><td>{{data.cxPay}}</td><td>{{data.payTaskProgress}}</td>',
        '<td>{{data.quarterTimeProgress}}</td><td>{{data.quarterTimeProgressSub}}</td><td>{{data.quarterTaskNeedDayPay}}</td>',
        '</tr></table>'
    ].join(""),
    
    TPL_TABLE3: ['<table><tr><th>时间</th>',
        '<th>总任务</th><th>竞价服务总消耗</th><th>竞价服务计业绩消耗</th><th>竞价服务不计业绩消耗</th><th>旭日总消耗</th><th>晨星总消耗</th><th>任务进度',
        '<span class="help" title="竞价服务计业绩消耗与总任务比值"></span></th></tr>',
        '{{#data}}<tr><td class="text">{{month}}</td><td>{{totalPayTask}}</td><td>{{totalPay}}</td><td>{{abPay}}</td><td>{{cpay}}</td><td>{{cpcPay}}</td><td>{{cxPay}}</td><td>{{payTaskProgress}}</td>',
        '</tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE4: ['<table><tr>',
        '<th>总任务</th><th>竞价服务总消耗</th><th>竞价服务计业绩消耗</th><th>竞价服务不计业绩消耗</th><th>旭日总消耗</th><th>晨星总消耗</th><th>任务进度',
        '<span class="help" title="竞价服务计业绩消耗与总任务比值"></span></th></tr>',
        '<tr><td>{{data.totalPayTask}}</td><td>{{data.totalPay}}</td><td>{{data.abPay}}</td><td>{{data.cpay}}</td><td>{{data.cpcPay}}</td><td>{{data.cxPay}}</td><td>{{data.payTaskProgress}}</td>',
        '</tr></table>'
    ].join(""),
    
    showError: function(msg) {
        clearTimeout(this.timer);
        
        Agent.Widgets.MessageBox.show(msg);
        
        this.timer = setTimeout(function() {
            Agent.Widgets.MessageBox.hide();
        }, 5000);
    }
});
