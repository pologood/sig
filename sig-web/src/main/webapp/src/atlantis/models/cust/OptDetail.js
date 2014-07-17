/*
 * Atlantis Model - 账户优化详情
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Models.OptDetail = Backbone.Model.extend({
    defaults: {
        data: null
    },
    
    getData: function(args) {
        var me = this;
        me.set({data : null}, {silent : true});
        
        dwr.request.run({
            method: "AccountOptimizationAction.getAccountOptimizeDetail",
            args: [args],
            success: function(response) {
                me.set({data: me.format(response)});
            }
        });
    },
    
    title: ["关键词", "预算", "排名", "质量度", "推广时段", "匹配方式", "计划/创意数/物料状态", "余额不足"],
    
    /*
     * 1. 增加优质关键词
     * 2. 优化预算设置（账户预算）
     * 3. 优化关键词排名
     * 4. 优化状态（低于起价）
     * 5. 优化质量度
     * 6. 优化推广时段
     * 7. 调整广泛匹配占比
     * 8. 添加计划
     * 9. 优化创意
     * 10.取消暂停
     * 11.查看被拒关键词或创意
     * 12.立即充值
     * 13.优化预算设置（计划预算）
     * 14.优化状态（冻结）
     * 15.添加创意
     */
    suggestion: [
        {text: "增加优质关键词", page: "addKeysOpt"},
        {text: "优化预算设置", page: "budgetOpt"},
        {text: "优化关键词排名", page: "keysRankOpt"},
        {text: "优化状态", page: "belowPrice"},
        {text: "优化质量度", page: "qualityOpt"},
        {text: "优化推广时段",page: "showTimeOpt"},
        {text: "调整广泛匹配占比", page: null},
        {text: "添加计划", page: "addPlanOpt"},
        {text: "优化创意", page: "ideaOpt"},
        {text: "取消暂停", page: "cancelSuspendOpt"},
        {text: "查看被拒关键词或创意", page: "refusedMaterialOpt"},
        {text: "立即充值", page: "investForAccount"},
        {text: "优化预算设置", page: "planBudget"},
        {text: "优化状态", page: "accountSuspend"},
        {text: "添加创意", page: "addIdea"}
    ],
    
    xuriLink: '<a href="../../delegate?agentUserId={{agentUserId}}&accountId={{custId}}&toInfo={{page}}" target="_blank">{{suggestion}}</a>',
    agentLink: '<a href="../../jump?agentUserId={{agentUserId}}&accountId={{custId}}&toInfo=investForAccount" target="_blank">{{suggestion}}</a>',
    
    format: function(response) {
        response.data.realTimeCost = Util.format.money(response.data.realTimeCost);
        
        var me = this,
            agentUserId = $("#UserId").val(),
            custId = response.data.custId;
        
        $.each(response.data.optimizeDetail, function(index, val) {
            var len = val.problem.length,
                title = '<span class="opt opt-type' + val.optType + '"></span>' + me.title[val.optType - 1];
            val.content = [];
            $.each(val.problem, function(index2, problem) {
                var firstCol = "";
                if (index2 == 0) {
                    firstCol = len == 1
                    ? '<td class="c">' + title + '</td>'
                    : '<td class="c" rowspan="' + len + '">' + title + '</td>';
                }
                var type = val.type[index2],
                    page = me.suggestion[type - 1]["page"],
                    suggestion = me.suggestion[type - 1]["text"],
                    link;
                
                if (type == 7) { //调整广泛匹配占比
                    link = '<a href="javascript:void(0)" class="edit-match">' + suggestion + '</a>';
                } else if (type == 12) { //立即充值
                    link = Mustache.to_html(me.agentLink, {
                        agentUserId: agentUserId,
                        custId: custId,
                        suggestion: suggestion
                    });
                } else if (type == 21) { //添加计划   & 添加创意
                    link = Mustache.to_html(me.xuriLink, {
                        agentUserId: agentUserId,
                        custId: custId,
                        page: me.page[7],
                        suggestion: me.suggestion[7]
                    }) + '&nbsp;&nbsp;&nbsp;&nbsp;' + Mustache.to_html(me.xuriLink, {
                        agentUserId: agentUserId,
                        custId: custId,
                        page: me.page[14],
                        suggestion: me.suggestion[14]
                    });
                } else {
                    link = Mustache.to_html(me.xuriLink, {
                        agentUserId: agentUserId,
                        custId: custId,
                        page: page,
                        suggestion: suggestion
                    });
                }
                
                val.content.push({
                    firstCol: firstCol,
                    problem: problem,
                    link: link
                });
            });
        });
        
        return response;
    }
});
