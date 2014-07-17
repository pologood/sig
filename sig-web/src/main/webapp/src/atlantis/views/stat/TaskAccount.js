/*
 * Atlantis View - TaskAccount
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.TaskAccount = Backbone.View.extend({
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
        Atlantis.Widgets.TreeNav.destroy();
    },
    
    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(4);
    },
    
    renderTreeNav: function() {
        Atlantis.Widgets.TreeNav = new Atlantis.Views.TreeNav(0, 0, 2);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染查询区域
        this.$el.mustache("tpl-task-account");
        
        //初始化esui
        esui.init(this.el, {
            AccountTask: {
                datasource: [
                    {name:'当前任务进度', value: 1},
                    {name:'历史三个月任务', value: 2}
                ],
                value: 1
            }
        });
        
        //初始请求
        this.lastArgs = {};
        this.getArgs();
        this.query(this.lastArgs);
    },
    
    getArgs: function() {
        this.lastArgs.timeType = esui.get("AccountTask").value;
    },
    
    queryAll: function() {
        this.getArgs();
        this.query(this.lastArgs);
    },
    
    query: function(args) {
        this.model.getData(args);
    },
    
    renderTable: function(model, data) {
        var args = this.lastArgs;
        if (args.timeType === 1) {
            this.$(".data1").show();
            this.$(".data2").show();
            this.$(".data3").hide();
            
            this.$(".data1 .download").attr({
                href: '../../download?reportName=StandardAccountTask&timeType=' + args.timeType
            });
            this.$(".data1 .grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE1, {
                data: data.data
            })));
            this.$(".data2 .grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE2, {
                data: data.data
            })));
        } else {
            this.$(".data1").hide();
            this.$(".data2").hide();
            this.$(".data3").show();
            
            this.$(".data3 .download").attr({
                href: '../../download?reportName=StandardAccountTask&timeType=' + args.timeType
            });
            this.$(".data3 .grid").html(Util.format.toRed(Mustache.to_html(this.TPL_TABLE3, {
                data: data.data
            })));
        }
    },
    
    TPL_TABLE1: ['<table><tr><th>达标任务</th><th>有消耗客户数</th><th>达标客户数</th><th>目前达标率</th><th>任务差距</th></tr>',
        '{{#data}}<tr><td>{{stdTask}}</td><td>{{costCusts}}</td><td>{{reachCusts}}</td><td>{{reachPercent}}</td><td>{{taskSub}}</td></tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE2: ['<table>',
        '<tr><th colspan="2">推广计划</th><th colspan="2">创意数</th><th colspan="2">关键词</th><th colspan="2">关键词广泛匹配</th><th colspan="2">预算撞线</th></tr>',
        '<tr><th>达标客户数</th><th>达标率</th><th>达标客户数</th><th>达标率</th><th>达标客户数</th><th>达标率</th>',
        '<th>达标客户数</th><th>达标率</th><th>达标客户数</th><th>达标率</th></tr>',
        '{{#data}}<tr><td>{{planReach}}</td><td>{{planReachPercent}}</td><td>{{ideaReach}}</td><td>{{ideaReachPercent}}</td><td>{{keyReach}}</td><td>{{keyReachPercent}}</td>',
        '<td>{{matchReach}}</td><td>{{matchReachPercent}}</td><td>{{pauseReach}}</td><td>{{pauseReachPercent}}</td></tr>{{/data}}</table>'
    ].join(""),
    
    TPL_TABLE3: ['<table><tr><th>时间</th><th>达标任务</th><th>有消耗客户数</th><th>达标客户数</th><th>达标率</th></tr>',
        '{{#data}}<tr><td class="text">{{time}}</td><td>{{stdTask}}</td><td>{{costCusts}}</td><td>{{reachCusts}}</td><td>{{reachPercent}}</td></tr>{{/data}}</table>'
    ].join("")
});
