/*
 * Atlantis View - 管理首页
 * @author : liangxiao
 * @date   : 2013
 */

/* $("#RoleId").val()
 * 101 一级代理商
 * 102 一代副总
 * 103 一代财务
 * 104 一代总监
 * 105 一代主管
 * 106 一代业务员（销售）
 * 107 一代客服
 * 108 二级代理商
 * 109 二代财务
 * 110 二代业务员（销售）
 * 111 二代客服
 * 112 BBS用户
 */

/*
 * $("#AtlantisType").val()
 * 1 中小企业代理商
 */
Atlantis.Views.Index = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click #CostTab a": "switchCost",
        "click .task-type input": "switchTask",
        "click a.clickLog": "sendClickLog"
    },
    
    initialize: function() {
        var roleId = parseInt($("#RoleId").val(), 10);
        
        //任务完成情况权限
        this.isKaAtlantis = $("#AtlantisType").val() == "1" ? false : true;
        if (this.isKaAtlantis) {
            this.viewTask = false;
        } else {
            this.viewTask = Atlantis.Auth.ViewIndexTask;
            this.viewCostTask = Atlantis.Auth.ViewIndexCostTask;
            this.viewNewCustTask = Atlantis.Auth.ViewIndexNewCustTask;
            this.viewAccountTask = Atlantis.Auth.ViewIndexAccountTask;
        }
        
        //本月账户概况权限
        this.accountProfileType;
        if (roleId == 101 || roleId == 102 || roleId == 103
            || roleId == 104 || roleId == 105|| roleId == 108 || roleId == 109) {
            //一级代理、副总、财务、总监、主管、二级代理、二代财务
            this.accountProfileType = 1;
        } else if (roleId == 107 || roleId == 111) {
            //客服、二代客服
            this.accountProfileType = 2;
        } else {
            //销售、二代销售
            this.accountProfileType = 3;
        }
        
        //资金记录权限
        this.viewInvest = false;
        if (roleId == 101 || roleId == 102 || roleId == 103 || roleId == 108 || roleId == 109) {
            //一级代理、副总、财务、二级代理、二代财务
            this.viewInvest = true;
        }
        
        //我关注的客户权限
        this.hideStdAccount = false;
   //     if (!Atlantis.Auth.ViewAccountClient || this.isKaAtlantis) {
            this.hideStdAccount = true;
      //  }
        this.hideXuri = false;
     //   if (roleId == 103 || roleId == 106 || roleId == 109 || roleId == 110) {
            //财务、销售、二代财务、二代销售
            this.hideXuri = true;
       // }
        
        this.initChart();
        
        //记录热点图点击
        //this.heatmapData = [];
        //$("body").bind("click", this.storeHeatmap);
    },
    
    destroy: function() {
        //console.log(this.heatmapData)
        //$("body").unbind("click", this.storeHeatmap);
        
        this.lineChart.clear();
        this.pieChart.clear();
        this.donutChart.clear();
        
        esui.dispose();
        this.recoverIndexStyle();
        this.$el.unbind();
        this.$el.empty();
        
        this.floatWindow && this.floatWindow.destroy();
    },
    
    /*storeHeatmap: function(e) {
        var view = Atlantis.Page.cur;
        view.heatmapData.push({x: e.pageX, y: e.pageY});
    },*/
    
    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(0);
    },
    
    sendClickLog: function(e) {
        var logid = $(e.target).attr("logid");
        Util.sendClickLog(logid);
    },
    
    setIndexStyle: function() {
        $("#Left").addClass("no-left");
        $("#Right").addClass("right-max");
        $("#Right").css({"padding-bottom": 0});
        $("#Foot").css({"border-top-width": 0});
    },
    
    recoverIndexStyle: function() {
        $("#Left").removeClass("no-left");
        $("#Left").removeClass("left-hide");
        $("#Right").removeClass("right-max");
        $("#Right").removeClass("right-expand");
        $("#Right").css({"padding-bottom": 30});
        $("#Foot").css({"border-top-width": 1});
    },
    
    // render function
    render: function(query) {
           this.renderTopNav();
     //   this.setIndexStyle();
        
        var view = this;
        $.Mustache.load('assets/tpl/index.html').done(function() {
            view.$el.mustache("tpl-index", {
                agentUserId: $("#UserId").val(),
                isDelegate: $("#Delegate").val() == "true" ? [] : [1]
            });
            
            /*
             * 权限处理
             */
            if (view.viewTask) { //显示任务完成情况
                view.$("#TaskModule").mustache("tpl-index-task", {
                    cost: view.viewCostTask ? [1] : [],       //消耗任务
                    newCust: view.viewNewCustTask ? [1] : [], //开户任务
                    account: view.viewAccountTask ? [1] : []  //标准账户任务
                });
                esui.init();
                //选中第一个
                var ctrlId = $(view.$(".task-type input")[0]).attr("data-control");
                esui.get(ctrlId).setChecked(true);
                //显示第一个
                $(view.$("#TaskModule .task-content")[0]).show();
            } else {
                view.$("#TaskModule").html($.Mustache.render("tpl-index-profile"));
            }
            
            if (view.viewInvest) { //显示资金记录
                view.$("#CostLeft").addClass("invest");
                view.$("#CostRight").show();
            }
            
            if (view.hideStdAccount) { //隐藏'标准账户未达标客户'
                view.$(".r1c3").remove();
            }
            if (view.hideXuri) {
                view.$(".r2c1").remove(); //隐藏'旭日待优化客户'
                view.$(".r2c2").remove(); //隐藏'旭日影响消耗操作客户'
            }
            
            //密码过简提示
            if ($("#SafePwd").val() == "false") {
                view.floatWindow = new FloatWindow('SafeTip', '安全提示', '尊敬的用户：<br>&nbsp;&nbsp;&nbsp;&nbsp;您的密码过于简单，为了保护您的账户安全，请您尽快修改密码！');
            }
            
            //获取饼图
            view.getTaskData();
            
            //获取折线图(->资金记录)
            view.getCostData();
            
            //获取系统消息->最新通知->广告位->我关注的客户
            view.getMsg();
        });
    },
    
    getMsg: function() {
        var view = this;
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisHomePageAction.latestSystemMessage",
            args: [],
            success: function(response) {
                view.renderMsg(response.data);
                view.getNotice();
            }
        });
    },
    
    renderMsg: function(data) {
        if (data == null) {
            this.$("#MsgBar").remove();
            return;
        }
        
        var content = data.content,
            len = content.length;
        if (len > 50) {
            content = content.slice(0, 50) + "...";
            this.$(".msg-detail").show();
        }
        this.$(".msg-body").mustache("tpl-index-msg", {
            date: T.date.format(new Date(data.date), "yyyy.MM.dd HH:mm"),
            content: content
        });
    },
    
    getNotice: function() {
        var view = this;
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisHomePageAction.listLatestNotices",
            args: [],
            success: function(response) {
                view.renderNotice(response.data);
                view.getAD();
            }
        });
    },
    
    renderNotice: function(data) {
        $.each(data, function(index, val) {
            var len = val.title.length;
            if (len > 16) {
                val.alt = val.title;
                val.title = val.title.slice(0, 16) + "...";
            } else {
                val.alt = "";
            }
            val.className = val.top ? "top" : "normal";
            val.date = T.date.format(new Date(val.date), "yyyy/MM/dd");
        });
        this.$(".notice-list").mustache("tpl-index-notice-list", {data: data});
        this.$(".notice-list a.normal")[0].className = "first";
    },
    
    getAD: function() {
        var view = this;
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisHomePageAction.displayAD",
            args: [],
            success: function(response) {
                view.renderAD(response.data);
                view.getClientData();
            }
        });
    },
    
    renderAD: function(data) {
        this.$("#ADLink img").attr({src: data.imageURL});
        this.$("#ADLink").attr({href: data.linkURL}).show();
    },
    
    getClientData: function() {
        var view = this;
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisHomePageAction.myFocusCustomers",
            args: [],
            success: function(response) {
                view.renderClientData(response.data);
            }
        });
    },
    
    renderClientData: function(data) {
        this.addCount("r1c1", data.costWaveAbnormals);
        this.addCount("r1c2", data.lostCusts);
        
        if (!this.hideStdAccount) {
            this.addCount("r1c3", data.unreachedCusts);
        }
        if (!this.hideXuri) {
            this.addCount("r2c1", data.needOptimizationCusts);
            this.addCount("r2c2", data.negativeOperationCusts);
        }
        
        this.addCount("r2c3", data.noCostBeDealCusts);
        this.addCount("r1c4", data.needInvestCusts);
        this.addCount("r1c5", data.searchADExpiredCusts);
        this.addCount("r1c6", data.refusedCusts);
        this.addCount("r2c4", data.pausedCusts);
        this.addCount("r2c5", data.auditingCusts);
    },
    
    addCount: function(position, field) {
        if (field != 0) {
            this.$("." + position).append('<span class="num">' + field + '</span>');
        }
    },
    
    initChart: function() {
        /*
         * 任务饼图
         */
        this.pieChart = new AmCharts.AmPieChart();
        var pieChart = this.pieChart;
        pieChart.depth3D = 10;
        pieChart.angle = 40;
        pieChart.colors = ["#90c01f", "#6aa6dc"];
        pieChart.outlineColor = "#FFFFFF";
        pieChart.outlineAlpha = 0.5;
        pieChart.outlineThickness = 1;
        pieChart.startDuration = 0.5;
        pieChart.labelsEnabled = false;
        pieChart.balloonText = "[[title]]: [[percents]]%";
        pieChart.titleField = "title";
        pieChart.valueField = "value";
        pieChart.dataProvider = [];
        
        var balloon = pieChart.balloon;
        balloon.fontSize = 12;
        balloon.color = "#fff";
        balloon.textShadowColor = "#fff";
        balloon.borderThickness = 1;
        
        var legend = new AmCharts.AmLegend();
        legend.position = "left";
        legend.maxColumns = 1;
        legend.fontSize = 12;
        legend.valueText = "[[description]]";
        if (!T.ie || T.ie >= 9) legend.valueWidth = 0;
        pieChart.addLegend(legend);
        
        this.pieChartLoaded = false;
        
        /*
         * 环图
         */
        this.donutChart = new AmCharts.AmPieChart();
        var donutChart = this.donutChart;
        donutChart.innerRadius = "80%";
        donutChart.depth3D = 5;
        donutChart.angle = 40;
        donutChart.colors = ["#90c01f", "#6aa6dc", "#feca00"];
        donutChart.outlineColor = "#FFFFFF";
        donutChart.outlineAlpha = 0.5;
        donutChart.outlineThickness = 1;
        donutChart.startDuration = 0.5;
        donutChart.labelsEnabled = false;
        donutChart.titleField = "title";
        donutChart.valueField = "value";
        donutChart.dataProvider = [];
        
        var balloon = donutChart.balloon;
        balloon.fontSize = 12;
        balloon.color = "#fff";
        balloon.textShadowColor = "#fff";
        balloon.borderThickness = 1;
        
        var legend = new AmCharts.AmLegend();
        legend.position = "bottom";
        legend.maxColumns = 2;
        legend.fontSize = 12;
        legend.valueText = "[[description]]";
        legend.valueWidth = 0;
        donutChart.addLegend(legend);
        
        /*
         * 消耗折线图
         */
        this.lineChart = new AmCharts.AmSerialChart();
        var lineChart = this.lineChart;
        lineChart.pathToImages = "assets/common/amcharts/";
        lineChart.marginRight = 40;
        lineChart.startDuration = 0.5;
        lineChart.colors = ["#90c01f", "#6aa6dc"];
        lineChart.categoryField = "date";
        lineChart.dataProvider = [];
        
        var balloon = lineChart.balloon;
        balloon.fontSize = 12;
        balloon.color = "#fff";
        balloon.textShadowColor = "#fff";
        balloon.textAlign = "left";
        balloon.borderThickness = 1;
        
        var xAxis = lineChart.categoryAxis;
        xAxis.startOnAxis = true;
        xAxis.axisColor = "#cdcdcd";
        xAxis.color = "#707070";
        xAxis.fillAlpha = 1;
        xAxis.fillColor = "#f9f9f9";
        xAxis.labelFunction = function(valueText, date, categoryAxis) {
            return valueText.replace(/^\d{4}-/, "");
        };
        
        var yAxis = new AmCharts.ValueAxis();
        yAxis.axisColor = "#cdcdcd";
        yAxis.color = "#707070";
        yAxis.integersOnly = true;
        lineChart.addValueAxis(yAxis);
        
        var legend = new AmCharts.AmLegend();
        legend.position = "top";
        legend.align = "right";
        legend.fontSize = 12;
        legend.valueWidth = 0;
        lineChart.addLegend(legend);
        
        var line1 = new AmCharts.AmGraph(),
            line2 = new AmCharts.AmGraph();
        line1.type = line2.type = "line";//"smoothedLine";
        line1.lineThickness = line2.lineThickness = 2;
        line1.bullet = line2.bullet = "round";
        line1.bulletSize = line2.bulletSize = 6;
        line1.bulletColor = line2.bulletColor = "#f9f9f9";
        line1.bulletBorderColor = "#90c01f";
        line2.bulletBorderColor = "#6aa6dc";
        line1.title = "7日平均消耗";
        line2.title = "每日消耗";
        line1.valueField = "avCost";
        line2.valueField = "cost";
        line1.balloonText = "均值：[[value]]元";
        line2.balloonText = "[[category]]<br>消耗：[[value]]元";
        lineChart.addGraph(line1);
        lineChart.addGraph(line2);
        
        this.lineChartLoaded = false;
    },
    
    getTaskData: function() {
        var view = this;
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisHomePageAction.accountMonthTaskAndCostStatInfo",
            args: [],
            success: function(response) {
                view.formatTaskData(response.data);
                view.renderTaskData(response.data);
            }
        });
    },
    
    formatTaskData: function(data) {
        if (this.viewTask) {
            if (this.viewCostTask) {
                var progress = data.costTask.payTaskProgress;
                this.costPieData = [
                    {title: "已完成", value: progress},
                    {title: "未完成", value: 1 - progress}           
                ];
                    
            }
            if (this.viewNewCustTask) {
                var progress = data.newCustTask.newCustTaskProgress;
                this.newCustPieData = [
                    {title: "已完成", value: progress},
                    {title: "未完成", value: 1 - progress}           
                ];
            }
            if (this.viewAccountTask) {
                var progress = data.stdAccountTask.reachPercent;
                this.accountPieData = [
                    {title: "已完成", value: progress},
                    {title: "未完成", value: 1 - progress}           
                ];
            }
        } else {
            var accountStat = data.accountStat;
            if (this.accountProfileType == 3) {
                this.donutData = [
                    {title: "有效开户数", value: accountStat.effectNewCustNum},
                    {title: "无效开户数(特殊行业)", value: accountStat.invalidBNewCustNum},
                    {title: "无效开户数(其他)", value: accountStat.invalidOtherNewCustNum}
                ];
                this.donutChart.balloonText = "[[title]]: [[value]]个([[percents]]%)";
            } else {
                this.donutData = [
                    {title: "竞价服务计业绩消耗", value: accountStat.abPay},
                    {title: "竞价服务不计业绩消耗", value: accountStat.cpay}
                ];
                this.donutChart.balloonText = "[[title]]: [[value]]元([[percents]]%)";
            }
        }
    },
    
    renderTaskData: function(data) {
        var negative = /^-\d+.*/;
        
        if (this.viewTask) {
            this.$("#PieChart").css({background: "none"});
            
            if (this.viewCostTask) { //消耗任务
                var costTask = data.costTask;
                this.$("#CostTaskContent").mustache("tpl-index-cost-task", {
                    totalPayTask: Util.format.money(costTask.totalPayTask),
                    totalPay: Util.format.money(costTask.totalPay),
                    monthTimeProgress: Util.format.percent(costTask.monthTimeProgress),
                    monthTimeProgressSub: Util.format.percent(costTask.monthTimeProgressSub),
                    monthTaskNeedDayPay: Util.format.money(costTask.monthTaskNeedDayPay)
                });
                var taskSub = this.$("#CostTaskContent .task-sub").html();
                if (negative.test(taskSub)) {
                    $("#CostTaskContent .task-sub").addClass("negative");
                }
            }
            if (this.viewNewCustTask) { //开户任务
                var newCustTask = data.newCustTask;
                this.$("#NewCustTaskContent").mustache("tpl-index-new-cust-task", {
                    newCustTask: Util.format.number(newCustTask.newCustTask),
                    newCustNum: Util.format.number(newCustTask.newCustNum),
                    monthTimeProgress: Util.format.percent(newCustTask.monthTimeProgress),
                    monthTimeProgressSub: Util.format.percent(newCustTask.monthTimeProgressSub),
                    newCustRemainedPerDay: Util.format.number(newCustTask.newCustRemainedPerDay)
                });
                var taskSub = this.$("#NewCustTaskContent .task-sub").html();
                if (negative.test(taskSub)) {
                    $("#NewCustTaskContent .task-sub").addClass("negative");
                }
            }
            if (this.viewAccountTask) { //标准账户任务
                var accountTask = data.stdAccountTask;
                this.$("#AccountTaskContent").mustache("tpl-index-account-task", {
                    stdTask: Util.format.percent(accountTask.stdTask),
                    reachPercent: Util.format.percent(accountTask.reachPercent),
                    taskSub: Util.format.percent(accountTask.taskSub)
                });
                var taskSub = this.$("#AccountTaskContent .task-sub").html();
                if (negative.test(taskSub)) {
                    $("#AccountTaskContent .task-sub").addClass("negative");
                }
            }
            
            //渲染第一个饼图
            var id = $(this.$(".task-type input")[0]).attr("data-control");
            this.selectTaskPie(id);
        } else {
            this.$("#DonutChart").css({background: "none"});
            
            var accountStat = data.accountStat;
            if (this.accountProfileType == 1) {
                this.$("#TaskModule").append($.Mustache.render("tpl-index-profile1", {
                    cpcPay: Util.format.money(accountStat.cpcPay),
                    cxPay: Util.format.money(accountStat.cxPay),
                    newCustNum: Util.format.number(accountStat.newCustNum),
                    reachPercent: Util.format.percent(accountStat.reachPercent)
                }));
                this.$("#DonutTotal .title").html("竞价服务总消耗");
                this.$("#DonutTotal .value").html(Util.format.money(accountStat.totalPay) + "元");
            } else if (this.accountProfileType == 2) {
                this.$("#TaskModule").append($.Mustache.render("tpl-index-profile2", {
                    cpcPay: Util.format.money(accountStat.cpcPay),
                    cxPay: Util.format.money(accountStat.cxPay),
                    reachPercent: Util.format.percent(accountStat.reachPercent)
                }));
                this.$("#DonutTotal .title").html("竞价服务总消耗");
                this.$("#DonutTotal .value").html(Util.format.money(accountStat.totalPay) + "元");
            } else {
                this.$("#TaskModule").append($.Mustache.render("tpl-index-profile3", {
                    newInvest: Util.format.money(accountStat.newInvest),
                    newCostCusts: Util.format.number(accountStat.newCostCusts),
                    newNoCostCusts: Util.format.number(accountStat.newNoCostCusts)
                }));
                this.$("#DonutTotal").css({top: 100});
                this.$("#DonutTotal .title").html("新开户总数");
                this.$("#DonutTotal .value").html(Util.format.number(accountStat.newCustNum) + "个");
            }
            
            //渲染环图
            this.donutChart.dataProvider = this.donutData;
            this.donutChart.validateData();
            this.donutChart.write("DonutChart");
        }
    },
    
    selectTaskPie: function(id) {
        switch (id) {
            case "Cost":
                this.renderTaskPie(this.costPieData);
                this.$("#PieChartLink").attr({href: "#stat/task/cost/", logid: 103});
                break;
            case "NewCust":
                this.renderTaskPie(this.newCustPieData);
                this.$("#PieChartLink").attr({href: "#stat/task/new/", logid: 104});
                break;
            case "Account":
                this.renderTaskPie(this.accountPieData);
                this.$("#PieChartLink").attr({href: "#stat/task/account/", logid: 105});
        }
    },
    
    renderTaskPie: function(data) {
        this.pieChart.dataProvider = data;
        this.pieChart.validateData();
        if (!this.pieChartLoaded) {
            this.pieChart.write("PieChart");
            this.pieChartLoaded = false;
        }
    },
    
    switchTask: function(e) {
        var me = $(e.target),
            id = me.attr("data-control");
        this.$(".task-content").hide();
        this.$("#" + id + "TaskContent").show();
        this.selectTaskPie(id);
    },
    
    getCostData: function() {
        var view = this;
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisHomePageAction.latest7DayCostStat",
            args: [],
            success: function(response) {
                view.$("#LineChart").css({background: "none"});
                view.formatCostData(response.data);
                view.renderCostData(view.totalLineData);
                if (view.viewInvest) {
                    view.getInvest();
                }
            }
        });
    },
    
    formatCostData: function(data) {
        var view = this, avCost;
        
        this.totalLineData = [];
        avCost = data.totalAverageCost;
        $.each(data.latest7DayTotalCost, function(index, val) {
            view.totalLineData.push({date: val.date, cost: val.cost, avCost: avCost});
        });
        
        this.cpcLineData = [];
        avCost = data.cpcAverageCost;
        $.each(data.latest7DayCPCCost, function(index, val) {
            view.cpcLineData.push({date: val.date, cost: val.cost, avCost: avCost});
        });
        
        this.cxLineData = [];
        avCost = data.cxAverageCost;
        $.each(data.latest7DayCXCost, function(index, val) {
            view.cxLineData.push({date: val.date, cost: val.cost, avCost: avCost});
        });
    },
    
    renderCostData: function(data) {
        this.lineChart.dataProvider = data;
        this.lineChart.validateData();
        if (!this.lineChartLoaded) {
            this.lineChart.write("LineChart");
            this.lineChartLoaded = false;
        }
    },
    
    switchCost: function(e) {
        var me = $(e.target),
            logid = me.attr("logid");
        
        if (me.hasClass("active")) {
            return;
        }
        
        if (logid) {
            Util.sendClickLog(logid);
        }
        
        var className = me.attr("class");
        switch (className) {
            case "total":
                this.renderCostData(this.totalLineData);
                break;
            case "cpc":
                this.renderCostData(this.cpcLineData);
                break;
            case "cx":
                this.renderCostData(this.cxLineData);
        }
        
        this.$("#CostTab a").removeClass("active");
        me.addClass("active");
    },
    
    getInvest: function() {
        var view = this;
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisHomePageAction.agentBillInfo",
            args: [],
            success: function(response) {
                view.renderInvest(response.data);
            }
        });
    },
    
    renderInvest: function(data) {
        data.invest = Util.format.money(data.invest);
        data.remain = Util.format.money(data.remain);
        data.spend = Util.format.money(data.spend);
        data.depositInvest = Util.format.money(data.depositInvest);
        data.depositRemain = Util.format.money(data.depositRemain);
        this.$("#CostRight").mustache("tpl-index-invest", {data: data});
    }
});
