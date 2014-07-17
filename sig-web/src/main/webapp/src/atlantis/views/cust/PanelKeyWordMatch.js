/*
 * 修改匹配方式
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.Panel.KeyWordMatch = Atlantis.Views.Panel.Base.extend({
    events: {
        "click .hide": "hidePanel",
        "click .close": "hidePanel",
        "click .plan-list a": "onPlanClick",
        "click .grid th input:checkbox": "checkAll",
        "click .grid td input:checkbox": "checkOne"
    },
    
    init: function(args) {
        this.parentView = args.parentView;
        this.custId = args.custId;
        
        //将滑动面板插入DOM
        this.$el.appendTo("body");
        this.$el.mustache("tpl-slide-panel", {
            id: "KeyWordMatch",
            title: "修改匹配方式",
            submit: "save"
        });
        this.$('.content').mustache("tpl-kwmatch");
        this.$('h1 .error').before('<span class="name">（' + args.custName + '）</span>');
        this.$(".save").hide();
        this.$(".cancel").hide();
        this.mask = this.$("#KeyWordMatchMask");
        this.panel = this.$("#KeyWordMatchPanel");
        this.panel.addClass("match");
        
        //初始化控件
        this.initCtrl();
        
        //获取计划列表
        this.getPlans();
    },
    
    initCtrl: function() {
        esui.init(this.el, {
            "MatchType": {
                datasource: [
                    {name:'广泛匹配', value: 1}
                ],
                value: 1
            },
            "PageSize": {
                datasource: [
                    {name:'20', value: 20},
                    {name:'50', value: 50},
                    {name:'100', value: 100}
                ],
                value: 50
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
        esui.get("EditMatch").onclick = view.editMatch;
    },
    
    getPlans: function() {
        var view = this;
        dwr.request.run({
            context: "panel",
            method: "AccountFullyMatchOptimizationAction.getAccountFullyMatchOptimizeItem",
            args: [{custId: this.custId}],
            success: function(response) {
                view.renderPlans(response);
            },
            fail: function(response) {
                view.showError(response.errorMsg);
            }
        });
        /*this.renderPlans({
            data: {
                //fullyMatchPlans: [],
                fullyMatchPlans: [
                    {planId: 1, planName: "plan1", fullyMatchKeyNum: 100},
                    {planId: 2, planName: "plan2", fullyMatchKeyNum: 200},
                    {planId: 3, planName: "plan3", fullyMatchKeyNum: 300}
                ]
            }
        });*/
    },
    
    renderPlans: function(response) {
        $(".plan-list .load-tip").hide();
        
        var plans = response.data.fullyMatchPlans;
        if (plans.length == 0) {
            this.noPlan();
            return;
        } else {
            //标题
            this.$(".plan-title span").html('推广账户(' + plans.length + ')');
            //菜单
            this.$(".plan-list").append($.Mustache.render("tpl-kwmatch-plan", {
                plans: plans
            }));
            
            //默认查询第一个计划
            this.lastArgs = {
                custId: this.custId,
                planId: parseInt(this.$(".plan-list a")[0].id, 10),
                pageSize: 50
            };
            this.queryFirstPage();
        }
    },
    
    noPlan: function() {
        this.$(".plan-list").hide();
        this.$(".kw-list").hide();
        this.$(".content").css({border: 0});
        this.showError("无包含精确匹配的推广计划");
    },
    
    onPlanClick: function(e) {
        this.lastArgs.planId = parseInt(e.target.id, 10);
        this.queryFirstPage();
    },
    
    queryFirstPage: function() {
        this.lastArgs.pageNo = 1;
        this.pageRendered = false;
        this.query(this.lastArgs);
    },
    
    query: function(args) {
        $(".kw-list .load-tip").show();
        $(".kw-list .bread").hide();
        $(".kw-list .data").hide();
        
        var view = this;
        dwr.request.run({
            context: "panel",
            method: "AccountFullyMatchOptimizationAction.getPlanFullyMatchKeys",
            args: [args],
            success: function(response) {
                view.render(view.format(response));
            },
            fail: function(response) {
                view.showError(response.errorMsg);
            }
        });
        /*this.render(view.format({
            rowCount: 500,
            data: {
                planId: args.planId,
                //fullyMatchKeys: [],
                fullyMatchKeys: [
                    {keyId: 1, keyName: "鲜花1", cpcGrpName: "鲜花速递1", status: 31, price: 2.005},
                    {keyId: 2, keyName: "鲜花2", cpcGrpName: "鲜花速递2", status: 32, price: 2.005},
                    {keyId: 3, keyName: "鲜花3", cpcGrpName: "鲜花速递3", status: 33, price: 2.005},
                    {keyId: 4, keyName: "鲜花4", cpcGrpName: "鲜花速递4", status: 34, price: 2.005},
                    {keyId: 5, keyName: "鲜花5", cpcGrpName: "鲜花速递5", status: 35, price: 2.005}
                ]
            }
        }));*/
    },
    
    status: {
        "31": "审核未通过",
        "32": "暂停",
        "33": "审核中",
        "34": "搜索无效",
        "35": "正常"
    },
    
    format: function(response) {
        var view = this;
        $.each(response.data.fullyMatchKeys, function(index, val) {
            val.price = Util.format.money(val.price);
            val.status = view.status[val.status + ""];
        });
        
        return response;
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
    
    render: function(response) {
        var planId = response.data.planId,
            curPlan = this.$('.plan-list a[id="' + planId + '"]');
        
        if (response.data.fullyMatchKeys.length == 0) { //无关键词
            //删除该计划
            curPlan.remove();
            
            var planNum = this.$(".plan-list a").length;
            if (planNum == 0) { //无计划
                this.noPlan();
                return;
            }
            
            //默认查询第一个计划
            this.$(".plan-title span").html('推广账户(' + planNum + ')');
            this.lastArgs.planId = parseInt(this.$(".plan-list a")[0].id, 10);
            this.queryFirstPage();
        } else {
            $(".kw-list .load-tip").hide();
            $(".kw-list .bread").show();
            $(".kw-list .data").show();
            
            this.lastArgs.planId = planId;
            //选中菜单
            this.$('.plan-list a').removeClass("active");
            curPlan.addClass("active");
            //更新关键词数
            curPlan.html(curPlan.html().replace(/\(\d+\)/, "(" + response.rowCount + ")"));
            //面包屑
            var planName = this.$('.plan-list a.active').html();
            this.$('.bread span').html(planName.replace(/\(\d+\)/, ""));
            //页码
            this.renderPage(response.rowCount);
            //表格
            this.$(".grid").html($.Mustache.render("tpl-kwmatch-table", {
                keywords: response.data.fullyMatchKeys
            }));
        }
    },
    
    checkAll: function(e) {
        this.$(".grid td input").attr({
            checked: e.target.checked ? true : false
        });
    },
    
    checkOne: function(e) {
        var rowCount = this.$(".grid td input").length,
            checkedCount = this.$(".grid td input:checked").length;
        this.$(".grid th input:checkbox").attr({
            checked: checkedCount == rowCount ? true : false
        });
    },
    
    editMatch: function() {
        var view = Atlantis.Widgets.Panel.KeyWordMatch,
            ids = [];
        view.$(".grid td input:checked").each(function(index, elem) {
            ids.push(parseInt(elem.id, 10));
        });
        
        if (ids.length == 0) {
            view.showError("请选择关键词");
            return;
        }
        
        esui.Dialog.confirm({
            title: "修改匹配方式",
            content: "确定将选中的关键词批量修改匹配方式？",
            onok: function() {
                var args = {
                    custId: view.custId,
                    keyIds: ids.join(","),
                    matchType: esui.get("MatchType").value
                };
                dwr.request.run({
                    context: "panel",
                    method: "AccountFullyMatchOptimizationAction.updateAccountFullyMatchOptimizeItem",
                    args: [args],
                    success: function(response) {
                        view.queryFirstPage();
                        view.showError("信息修改成功");
                    },
                    fail: function(response) {
                        view.showError(response.errorMsg);
                    }
                });
            },
            oncancel: function() {
                view.$(".grid input:checkbox").attr({
                    checked: false
                });
            }
        });
    },
    
    destroyCtrl: function() {
        esui.dispose("MatchType");
        esui.dispose("EditMatch");
        esui.dispose("PageSize");
        esui.dispose("PageNo");
    }
});
