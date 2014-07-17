/*
 * Agent View - ConsumeRealtimeStat
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.ConsumeRealtimeStat = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click a.query": "queryAll",
        "click a.custLog": "sendLog"
    },
    
    initialize: function() {
        _.bindAll(this, 'renderChart');
        this.model.bind("change:data", this.renderChart);
    },
    
    destroy: function() {
    	this.disposeChart();
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
        Agent.Widgets.TreeNav = new Agent.Views.TreeNav(1, 0, 2);
    },
    
    sendLog: function(e) {
        Util.sendCustLog(7);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //渲染查询区域
        this.$el.mustache("tpl-right");
        this.$(".topbar").remove();
        this.$(".report-switch").remove();
        this.$(".query-form").html([
            this.TPL_CUST,
            this.TPL_PRODUCT
        ].join(""));
        var today=new Date().getTime();
        if(Util.date.CONSUME_REALTIME_WEEK_CONTRAST_OPEN.getTime()>=today){
        	this.$(".query-form").before(this.TPL_TIP_DEPLOY);
        }
        
        //初始化控件
        this.initEsui(query);
        this.bindEsui();
    	this.initChart();
        
        //初始查询
        this.lastArgs = {};
        this.lastArgs.pageNo = 1;
        this.lastArgs.pageSize = 20;
        this.pageRendered = false;
        this.getArgs();
        this.query(this.lastArgs);
    },
    
    lastAction: null,
    
    disposeChart: function (){
    	this.$(".result .data").html("");
    	this.chart.destroy();
    },
    
    chart: null,
    
    initChart: function() {
    	var me=this;
    	me.chart = new AmCharts.AmSerialChart();
    	me.chart.pathToImages = "../../asset/common/amcharts/";
    	me.chart.dataProvider = [];
    	me.chart.categoryField = "s_time";
        me.chart.balloon.color = "#000000";
        me.chart.balloon.enabled = false;

        // AXES
        // category
        var categoryAxis = me.chart.categoryAxis;
        categoryAxis.fillAlpha = 1;
        categoryAxis.fillColor = "#FAFAFA";
        categoryAxis.gridAlpha = 0;
        categoryAxis.axisAlpha = 0;
        categoryAxis.gridPosition = "start";

        // value
        var valueAxis = new AmCharts.ValueAxis();
        //valueAxis.title = "消耗";
        valueAxis.dashLength = 5;
        valueAxis.axisAlpha = 0;
//        valueAxis.integersOnly = true;
        valueAxis.gridCount = 10;
        me.chart.addValueAxis(valueAxis);

        // GRAPHS
        // yesterday graph
        var graph = new AmCharts.AmGraph();
        graph.title = Util.date.yesterdayString();
        graph.valueField = "yesterdayCost";
        graph.balloonText = "[[category]]点消耗: [[value]]";
        graph.bullet = "round";
        graph.bulletSize =5;
        graph.lineColor = "#99c431";
        me.chart.addGraph(graph);

        // last week graph
        var graph = new AmCharts.AmGraph();
        graph.title = Util.date.lastWeekString();
        graph.valueField = "lastWeekDayCost";
        graph.balloonText = "[[category]]点消耗: [[value]]";
        graph.bullet = "round";
        graph.hidden = true;
        graph.bulletSize =5;
        graph.lineColor = "#ffae01";
        me.chart.addGraph(graph);
        
        // today graph						            		
        var graph = new AmCharts.AmGraph();
        graph.title = Util.date.toString(new Date());
        graph.valueField = "todayCost";
        graph.balloonText = "[[category]]点消耗: [[value]]";
        graph.lineAlpha = 1;
        graph.lineColor = "#5e9cd9";
        graph.lineThickness = 3;
        graph.bullet = "round";
        graph.bulletOffset = 1;
        graph.bulletSize =5;
        graph.addListener('rollOverGraphItem', me.showTip);
        me.chart.addGraph(graph);
        
        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.markerType = "line";
        legend.position="top";
        legend.align="right";
        legend.markerBorderThickness=3;
        me.chart.addLegend(legend);
        
        me.$(".result .data").html(Mustache.to_html(me.TPL_CHART));
        var today=new Date().getTime();
        if(Util.date.CONSUME_REALTIME_WEEK_CONTRAST_OPEN.getTime()>=today){
        	$("#comparedWithLastWeek").attr('disabled',true);
        }

        me.$(".result .data").children().width($(document).width()-240);
        me.chart.write(me.$(".result .data").children()[0]);

        me.$(".result").show();
        $('#comparedWithYesterday').attr("checked",true);
        $('#comparedWithYesterday').click(function(){
        	me.chart.graphs[0].hidden=false;
        	me.chart.graphs[1].hidden=true;
        	me.chart.validateData();
        });
        $('#comparedWithLastWeek').click(function(){
        	me.chart.graphs[0].hidden=true;
        	me.chart.graphs[1].hidden=false;
        	me.chart.validateData();
        });
        this.chart.removeListener(this.chart.legend,'hideItem',this.chart.handleLegendEvent);
        this.chart.removeListener(this.chart.legend,'showItem',this.chart.handleLegendEvent);
        
        this.$(".query").after(Mustache.to_html(this.TPL_CHART_TITLE));
    },
    
    showTip: function(event){
    	$(".consumeRealtimeStatCompanyTip").remove();
    	
    	var data=event.chart.dataProvider[event.index];
    	
    	if(data.todayCost==null) return;
    	
    	var endTime=event.index;
    	var startTime=(event.index+23)%24;
    	
    	var arrow='<span style="font-family:华文琥珀;font-size:14px;font-weight:normal;font-style:normal;text-decoration:none;color:green;">↑</span>';
    	
    	if($("#comparedWithYesterday").attr('checked')){
    		if(data.todayCost<data.yesterdayCost){
    			arrow='<span style="font-family:华文琥珀;font-size:14px;font-weight:normal;font-style:normal;text-decoration:none;color:red;">↓</span>';
    		}
    	}
    	if($("#comparedWithLastWeek").attr('checked')){
    		if(data.todayCost<data.lastWeekDayCost){
    			arrow='<span style="font-family:华文琥珀;font-size:14px;font-weight:normal;font-style:normal;text-decoration:none;color:red;">↓</span>';
    		}
    	}
    	
    	
    	var div='<div class="consumeRealtimeStatCompanyTip" '+
    		'style="background-color:#f8f8f8;border:1px #ccc solid;position:absolute;min-width:150px;min-height:100px;text-align:left;">'
    	+'<p style="margin-left:10px;"><strong>消耗：'+startTime+':00 -- '+endTime+':00</strong></p>'
    	+'<p style="margin-left:10px;">'+Util.date.toString(new Date())+'：'+data.todayCost+'&nbsp;&nbsp;&nbsp;&nbsp;'+arrow+'</p>'
    	+($("#comparedWithYesterday").attr('checked')?('<p style="margin-left:10px;">'+Util.date.yesterdayString()+'：'+data.yesterdayCost+'</p>'):('<p style="margin-left:10px;">'+Util.date.lastWeekString()+'：'+data.lastWeekDayCost+'</p>'))
    	+((data.acctStatus==0||event.chart.dataProvider.lastArgs!=null&&event.chart.dataProvider.lastArgs.product==3)?"":('<p style="margin-left:10px;margin-right:10px;"><strong>账户状态：</strong>'+data.acctStatus+'</p>'))
    	+'</div>';
    	$(div).appendTo(this.$(".result"));
    	
    	$(".consumeRealtimeStatCompanyTip").css('left',(190+event.item.x)+'px');
    	$(".consumeRealtimeStatCompanyTip").css('top',(202+event.item.y)+'px');
    	$(".consumeRealtimeStatCompanyTip").mouseleave(function(){
    		$(".consumeRealtimeStatCompanyTip").remove();
    	});
    },
    
    initEsui: function(query) {
        var json = T.url.queryToJson(decodeURIComponent(query));
        this.custId = !json.query ? null : json.query;
        this.queryType = !json.queryType ? null : json.queryType;
        this.verifyCust = !json.verifyCust ? null : json.verifyCust;
        
    	var custDataSource=[
            {name:'客户ID', value: 1},
            {name:'客户账号', value: 5},
            {name:'关联客服', value: 3}
        ];
    	
        esui.init(this.el, {
            Product: {
                datasource: [
                             {name:'竞价服务(旭日+晨星)', value: 1},
                             {name:'旭日 ', value: 2},
                             {name:'晨星 ', value: 3}
                         ],
                value: 1
            },
            Cust: {
                datasource: custDataSource,
                value: this.custId ? 1 : 5
            }
        });
        
        //隐藏双日历快捷键
        $(".ui-mmcal").hide();
    },
    
    bindEsui: function() {
        var view = this;
    },
    
    getArgs: function() {
        this.lastArgs.queryType = esui.get("Cust").value;
        this.lastArgs.product = esui.get("Product").getValue();
        this.lastArgs.query = encodeURIComponent($.trim(esui.get("CustKw").getValue()));
    	if(this.custId!=null){
    		this.lastArgs.query = this.custId;
    		esui.get("CustKw").setValue(this.custId);
    		this.custId=null;
    	}
    	if(this.queryType!=null){
    		this.lastArgs.queryType = parseInt(this.queryType, 10);
    		this.queryType=null;
    	}
    	if(this.verifyCust!=null){
    		this.lastArgs.verifyCust = this.verifyCust;
    		this.verifyCust=null;
    	}
        return this.lastArgs;
    },
    
    queryAll: function() {
        if(esui.get("Cust").value==1){
	        var custId = T.string.trim(esui.get("CustKw").getValue());
	        if (custId != "" && !/^[1-9][0-9]*$/.test(custId)) {
	            this.showError("客户ID应为正整数");
	            return false;
	        }
	        this.lastArgs.query = custId;
        }
        this.getArgs();
        this.lastArgs.pageNo = 1;
        this.pageRendered = false;
        this.query(this.lastArgs);
        $('#comparedWithYesterday').attr("checked",true);
    },
    
    query: function(args) {
        this.model.getData(args);
    },
    
    renderChart: function(model, data) {
    	this.lastAction = model.lastAction;
    	if (data.data.length == 0) { //无数据
            this.$(".result .info").show();
            this.$(".result .data").hide();
            this.$("#ChartTitle").hide();
        } else {
        	this.$(".result .info").hide();
            this.$(".result .data").show();
            this.$("#ChartTitle").show();
            var args = this.lastAction.args;
            
            this.chart.dataProvider=data.data;
            data.data.lastArgs=this.lastArgs;
            if($('#comparedWithYesterday').attr("checked")){
            	this.chart.graphs[0].hidden=false;
               	this.chart.graphs[1].hidden=true;
               	this.chart.validateData();
            }
            
            $('#consumeRealtimeStatCompanyName').html(Mustache.to_html(this.TPL_CUST_NAME, {
                custId: data.data[0].cust_id,
                custName: data.data[0].cust_name
            }));
            
            (data!=null && data.data[0]!=null && data.data[0].cust_name!=null && $.trim(data.data[0].cust_name)!="")?$("#ChartTitle").show():$("#ChartTitle").hide();
        }
    	//this.$(".query").after(Mustache.to_html(this.TPL_CHART_TITLE));
        this.$(".result").find("g[cursor='pointer']").each(function(){
        	$(this).attr('cursor','default');
        });
        this.$(".result").show();
        
        $("#amchartsorglogo").remove();
        $(".result .data").append('<span id="amchartsorglogo" style="font-size:10px;float:right;margin-right:100px;">chart&nbsp;by&nbsp;<a style="text-decoration:none;" href="http://amcharts.com/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemoamcharts">amcharts.com</a></span>');
    },
    
    TPL_CUST_NAME: '<a class="custLog" href="../../delegate?agentUserId=' + $("#UserId").val() + '&accountId={{custId}}&toInfo=accountInfo" target="_blank" title="{{custName}}">{{custName}}</a>',
    
    TPL_TITLE: '<div class="block"><h3>客户影响消耗操作提醒<span class="help" title="仅提醒客户登录进行的操作"></span></h3></div>',
    
    TPL_CUST: [
        '<div class="block">',
        '<strong>选择客户：</strong>',
        '<div ui="type:Select;id:Cust;width:75"></div>',
        '<input ui="type:TextInput;id:CustKw;width:100" type="text" />',
        '</div>'
    ].join(""),
    
    TPL_PRODUCT : ['<div class="block">',
                   '<strong>选择产品：</strong>',
                   '<div ui="type:Select;id:Product;width:200"></div>',
                   '</div>'].join(""),
                   
    TPL_CHART_TITLE : ['<p id="ChartTitle" style="display:none;" style="text-align:left;">',
                   '<span style="font-family:Arial;font-size:14px;font-weight:bold;font-style:normal;text-decoration:none;color:#000000;margin-left:20px;">',
                   '今日实时消耗</span>',
                   '&nbsp;&nbsp;&nbsp;',
                   '（<span id="consumeRealtimeStatCompanyName"></span>）',
                   '</span></p>'].join(""),
    
    TPL_TIP_DEPLOY: '<div class="alert">实时消耗上周数据从11月16日（周五）开始提供</div>',
    
    TPL_CHART: [
        '<div style="width: 100%; height: 350px; margin-left:10px;"></div>',
        '<div style="text-align:center;">',
        '<span style="font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;">对比：',
        '<input id="comparedWithYesterday" name="comparedWith" type="radio" value="radio" checked=true>',
        '<label for="comparedWithYesterday">昨日&nbsp;&nbsp;</label>',
        '<input id="comparedWithLastWeek" name="comparedWith" type="radio" value="radio">',
        '<label for="comparedWithLastWeek">上周同期</label>',
        '</span>',
        '</div>'
    ].join(""),
    
    showError: function(msg) {
        clearTimeout(this.timer);
        
        Agent.Widgets.MessageBox.show(msg);
        
        this.timer = setTimeout(function() {
            Agent.Widgets.MessageBox.hide();
        }, 5000);
    }
});
