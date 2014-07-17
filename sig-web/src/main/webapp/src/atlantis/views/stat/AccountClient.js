/*
 * Atlantis View - AccountClient
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.AccountClient = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "queryAll",
        "click a.ad-query": "toggle",
        "click .tab a": "navigate",
        "click a.custLog": "sendLog"
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
        Atlantis.Widgets.TreeNav = new Atlantis.Views.TreeNav(1, 1, 0);
    },
    
    renderTabNav: function() {
        Atlantis.Widgets.TabNav.render(Atlantis.TreeNav.Stat[1].sub, 1, 0, 1);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".report-switch").remove();
        this.$(".query-form").html([
            $.Mustache.render("tpl-account-time"),
            '<div class="tab"></div>',
            $.Mustache.render("tpl-query-form-client")
        ].join(""));
        this.$(".block4").show();
        this.renderTabNav();
        
        //高级查询
        this.$(".query-form").after($.Mustache.render("tpl-account-client-adquery"));
        
        //初始化控件
        Atlantis.Component.init(this, query);
        
        //初始查询
        this.lastArgs = {};
        this.lastArgs.pageNo = 1;
        this.lastArgs.pageSize = 20;
        this.pageRendered = false;
        this.getArgs();
        this.query(this.lastArgs);
    },
    
    setCtrl: function(type) {
		var times = this.$(".query-form div.time"),
			adBlock = this.$(".ad-block").children(),
			c0 = adBlock[0],
			c2 = adBlock[2],
			span = $(c2).children("span");
		if (type == 1) {
			$(times[0]).show();
			$(times[1]).hide();
			//标准账户达标情况
			$(c0).hide();
			//是否账户撞线
			this.$("#ctrlselectOutSelect").show();
			$(span[0]).show();
			//账户撞线率
			this.$("#ctrlselectLogicSelect5").hide();
			this.$("#ctrltextAdQuery5").hide();
			$(span[1]).hide();
			$(span[2]).hide();
		} else {
			$(times[0]).hide();
			$(times[1]).show();
			//标准账户达标情况
			$(c0).show();
			//是否账户撞线
			this.$("#ctrlselectOutSelect").hide();
			$(span[0]).hide();
			//账户撞线率
			this.$("#ctrlselectLogicSelect5").show();
			this.$("#ctrltextAdQuery5").show();
			$(span[1]).show();
			$(span[2]).show();
		}
    },
    
    toggle: function(e) {
        $(e.target).toggleClass("ad-query-show");
        if ($(e.target).hasClass("ad-query-show")) {
            $(".ad-block").slideDown(200);
        } else {
            $(".ad-block").slideUp(200);
        }
    },
    
    navigate: function(e) {
        Util.stopDefault(e);
        if ($(e.target).hasClass("active")) {
            return;
        }
        
        //切换Tab, 携带当前控件参数
        var monthData = [];
        $.each(esui.get("MonthOfDM").datasource, function(index, val) {
            monthData.push(val.value);
        });
        var param = {
            type: esui.get("DM").value,
            date: esui.get("DayOfDM").getValue(),
            year: esui.get("YearOfDM").value,
            month: esui.get("MonthOfDM").value,
            monthData: monthData.join(",")
        };
        
        var hash = e.target.href.split("#")[1] + T.url.jsonToQuery(param);
        Atlantis.router.navigate(hash, {trigger: true});
    },
    
    getArgs: function() {
        var type = esui.get("DM").value;
        if (type == 1) {
            this.lastArgs.time = {
                type: type,
                date: esui.get("DayOfDM").getValue()
            }
        } else {
            this.lastArgs.time = {
                type: type,
                year: esui.get("YearOfDM").value,
                month: esui.get("MonthOfDM").value
            }
        }
        this.lastArgs.queryType = esui.get("ClientOverView").value;
        this.lastArgs.query = encodeURIComponent(T.string.trim(esui.get("ClientOverViewKw").getValue()));
        this.lastArgs.stdType = esui.get("StandardSelect").value;
        this.lastArgs.planOp = esui.get("LogicSelect1").value;
        this.lastArgs.plan = encodeURIComponent(T.string.trim(esui.get("AdQuery1").getValue()));
        this.lastArgs.grpIdeaOp = esui.get("LogicSelect2").value;
        this.lastArgs.grpIdea = encodeURIComponent(T.string.trim(esui.get("AdQuery2").getValue()));
        this.lastArgs.keyOp = esui.get("LogicSelect3").value;
        this.lastArgs.key = encodeURIComponent(T.string.trim(esui.get("AdQuery3").getValue()));
        this.lastArgs.matchKeyRateOp = esui.get("LogicSelect4").value;
        this.lastArgs.matchKeyRate = encodeURIComponent(T.string.trim(esui.get("AdQuery4").getValue()));
        this.lastArgs.ifPaused = esui.get("OutSelect").value;
        this.lastArgs.pausedRateOp = esui.get("LogicSelect5").value;
        this.lastArgs.pausedRate = encodeURIComponent(T.string.trim(esui.get("AdQuery5").getValue()));
    },
    
    queryAll: function() {
        this.getArgs();
        
        //验证
        if (!Util.isInt(this.lastArgs.plan)) {
            this.showError("推广计划数需为整数");
            return;
        }
        if (!Util.isInt(this.lastArgs.grpIdea)) {
            this.showError("组均创意数需为整数");
            return;
        }
        if (!Util.isInt(this.lastArgs.key)) {
            this.showError("关键词数需为整数");
            return;
        }
        if (!Util.isInt(this.lastArgs.matchKeyRate)
            || (this.lastArgs.matchKeyRate != "" && parseInt(this.lastArgs.matchKeyRate) > 100)
        ) {
            this.showError("关键词广泛匹配占比需为100以内的整数");
            return;
        }
        if (!Util.isInt(this.lastArgs.pausedRate)
            || (this.lastArgs.pausedRate != "" && parseInt(this.lastArgs.pausedRate) > 100)
        ) {
            this.showError("账户撞线率需为100以内的整数");
            return;
        }
        
        this.getArgs();
        this.lastArgs.pageNo = 1;
        this.pageRendered = false;
        this.query(this.lastArgs);
    },
    
    query: function(args) {
        this.model.getData(args);
    },
    
    sendLog: function(e) {
        Util.sendCustLog(3);
    },
    
    renderTable: function(model, data) {
        var args = this.lastArgs;
        this.$(".result").show();
        if (data.data.length == 0) {
            this.$(".result .info").show();
            this.$(".result .data").hide();
        } else {
            this.$(".result .info").hide();
            this.$(".result .data").show();
            
            //页码
            if (!data.rowCount) {
                data.rowCount = 1;
            }
            if (!this.pageRendered) {
                var total = Math.ceil(data.rowCount / esui.get("PageSize").value),
                    pager = esui.get("PageNo");
                pager.total = total;
                pager.page = 0;
                pager.render();
                this.pageRendered = true;
            }
            this.$(".row-count").html("共 " + data.rowCount + " 条");
            //标题
            this.$(".title").html("客户维度账户概况报告");
            //时间
            this.$(".duration").html(Util.getReportDuration(args));
            //下载
            var reportName = args.time.type == 1 ? "StandardAccountByCustByDay" : "StandardAccountByCustByMonth";
            this.$(".download").attr({
                href: '../../download?'+ T.url.jsonToQuery({
                    reportName: reportName,
                    type: args.time.type,
                    date: args.time.date,
                    year: args.time.year,
                    month: args.time.month,
                    queryType: args.queryType,
                    query: args.query,
                    stdType: args.stdType,
                    planOp: args.planOp,
                    plan: args.plan,
                    grpIdeaOp: args.grpIdeaOp,
                    grpIdea: args.grpIdea,
                    keyOp: args.keyOp,
                    key: args.key,
                    matchKeyRateOp: args.matchKeyRateOp,
                    matchKeyRate: args.matchKeyRate,
                    ifPaused: args.ifPaused,
                    pausedRateOp: args.pausedRateOp,
                    pausedRate: args.pausedRate
                })
            });
            //表格
            var tpl = args.time.type == 1 ? this.TPL_BY_DAY : this.TPL_BY_MONTH;
            this.$(".grid").html(Util.format.toRed(Mustache.to_html(tpl, {
                avg: data.avg,
                data: data.data
            })));
            if (args.time.type == 1) { //撞线飘红
                $(".grid table tr td:last-child").each(function(index, val) {
                    val.innerHTML = val.innerHTML.replace("是", '<span style="color:#c13832">是</span>');
                });
            }
            Util.fixTable(this.$(".grid"));
        }
    },
    
    TPL_BY_DAY: [
        '<table><tr><th>客户ID</th><th>客户名称</th><th>客户账号</th><th>关联客服</th><th>一级行业</th><th>二级行业</th>',
        '<th>推广计划数</th><th>推广组数</th><th>创意数</th><th>组均创意数</th><th>关键词数</th><th>关键词广泛匹配占比</th><th>是否撞线</th></tr>',
        
        '<tr class="sum"><td class="text" colspan="6"><strong>户均值</strong></td>',
        '<td>{{avg.cpc_plan}}</td><td>{{avg.cpc_group}}</td><td>{{avg.cpc_idea}}</td><td>{{avg.cpc_grpIdea}}</td>',
        '<td>{{avg.cpc_key}}</td><td>{{avg.matchKeyRate}}</td><td>{{avg.ifPaused}}</td></tr>',
        
        '{{#data}}<tr><td class="text">{{custId}}</td>',
        '<td class="text"><div class="ellipsis" style="width:200px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></td><td class="text">{{custEmail}}</td><td class="text">{{csName}}</td><td class="text">{{firstTrade}}</td><td class="text">{{secondTrade}}</td>',
        '<td>{{cpc_plan}}</td><td>{{cpc_group}}</td><td>{{cpc_idea}}</td><td>{{cpc_grpIdea}}</td>',
        '<td>{{cpc_key}}</td><td>{{matchKeyRate}}</td><td>{{ifPaused}}</td></tr>',
        '{{/data}}</table>'
    ].join(""),
    
    TPL_BY_MONTH: [
        '<table><tr><th>客户ID</th><th>客户名称</th><th>客户账号</th><th>关联客服</th><th>一级行业</th><th>二级行业</th>',
        '<th>平均推广计划数</th><th>平均推广组数</th><th>平均创意数</th><th>组均创意数</th><th>平均关键词数</th><th>关键词广泛匹配占比</th><th>累计账户预算撞线天数</th><th>撞线率</th></tr>',
        
        '<tr class="sum"><td class="text" colspan="6"><strong>户均值</strong></td>',
        '<td>{{avg.cpc_plan}}</td><td>{{avg.cpc_group}}</td><td>{{avg.cpc_idea}}</td><td>{{avg.cpc_grpIdea}}</td>',
        '<td>{{avg.cpc_key}}</td><td>{{avg.matchKeyRate}}</td><td>{{avg.pausedDay}}</td><td>{{avg.pausedRate}}</td></tr>',
        
        '{{#data}}<tr><td class="text">{{custId}}</td>',
        '<td class="text"><div class="ellipsis" style="width:200px"><a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a></div></td><td class="text">{{custEmail}}</td><td class="text">{{csName}}</td><td class="text">{{firstTrade}}</td><td class="text">{{secondTrade}}</td>',
        '<td>{{cpc_plan}}</td><td>{{cpc_group}}</td><td>{{cpc_idea}}</td><td>{{cpc_grpIdea}}</td>',
        '<td>{{cpc_key}}</td><td>{{matchKeyRate}}</td><td>{{pausedDay}}</td><td>{{pausedRate}}</td></tr>',
        '{{/data}}</table>'
    ].join(""),
    
    showError: function(msg) {
        clearTimeout(this.timer);
        
        Atlantis.Widgets.MessageBox.show(msg);
        
        this.timer = setTimeout(function() {
            Atlantis.Widgets.MessageBox.hide();
        }, 5000);
    }
});
