/*
 * Agent Model - 用户管理
 * @author : liangxiao
 * @date   : 2013
 */

Agent.Models.AuthUser = Backbone.Model.extend({
    defaults: {
        company: null,
        client: null,
        role: null,
        account: null
    },
    
    getCompany: function(args) {
        var me = this;
        me.set({company: null}, {silent : true});
        
        dwr.request.run({
            method: "AccountManageAction.getCompanyInfo",
            args: [],
            success: function(response) {
                me.formatTree(response.data.companyArchObj.data);
                me.set({company: response.data});
                
                if (args.queryClient) {
                    //获取角色
                    me.getRole();
                }
            }
        });
        
        /*var response = {
            data: {
                companyArchObj: {
                    data: [{
                        data: {
                            title: "上海如来信息科技有限公司淄博分公司", attr: {"class": "a-level-0", id: "1", nodeType: 1}
                        },
                        children: [
                            {
                                data: {title: "A（副总）", attr: {"class": "a-level-1", id: "2", nodeType: 1}}
                            },
                            {
                                data: {title: "B（财务）", attr: {"class": "a-level-1", id: "3", nodeType: 1}}
                            },
                            {
                                data: {title: "C（总监）", attr: {"class": "a-level-1", id: "4", nodeType: 1}},
                                children: [
                                    {
                                        data: {title: "C1（主管）", attr: {"class": "a-level-2", id: "5", nodeType: 2}},
                                        children: [
                                            {data: {title: "D1（销售）",attr: {"class": "a-level-3", id: "51", nodeType: 1}}},
                                            {data: {title: "D2（客服）",attr: {"class": "a-level-3", id: "52", nodeType: 1}}},
                                            {data: {title: "D3（BBS用户）",attr: {"class": "a-level-3", id: "53", nodeType: 1}}}
                                        ]
                                    },
                                    {
                                        data: {title: "C2（主管）", attr: {"class": "a-level-2", id: "6", nodeType: 1}}
                                    }
                                ]
                            }
                        ]
                    }]
                }
            }
        };*/
    },
    
    formatTree: function(data) {
        var root = data[0];
        //0级
        root.data.attr["class"] = "a-level-0";
        //1级
        if (root.children) {
            $.each(root.children, function(index1, val1) {
                val1.data.attr["class"] = "a-level-1";
                //2级
                if (val1.children) {
                    $.each(val1.children, function(index2, val2) {
                        val2.data.attr["class"] = "a-level-2";
                        //3级
                        if (val2.children) {
                            $.each(val2.children, function(index3, val3) {
                                val3.data.attr["class"] = "a-level-3";
                            });
                        }
                    });
                }
            });
        }
    },
    
    getRole: function() {
        var me = this;
        me.set({role: null}, {silent : true});
        
        dwr.request.run({
            context: "noLoading",
            method: "AgentUserManageAction.getOptRoles",
            args: [{currentUser: parseInt($("#UserId").val(), 10)}],
            success: function(response) {
                me.set({role: response.data});
                
                //获取客户列表第一页
                var view = Agent.Page.cur;
                view.lastArgs = {};
                view.getArgs();
                view.lastArgs.pageSize = 20;
                view.queryFirstPage();
            }
        });
    },
    
    getClient: function(args) {
        var me = this;
        me.set({client: null}, {silent : true});
        
        dwr.request.run({
            context: "noLoading",
            method: "AccountManageAction.getCusts",
            args: [args],
            success: function(response) {
                me.set({client: response});
            }
        });
    },
    
    getAccount: function(args) {
        var me = this;
        me.set({account: null}, {silent : true});
        
        dwr.request.run({
            method: "AgentUserManageAction.queryUserById",
            args: [args],
            success: function(response) {
                response.data.hasSuperior = response.data.superiorId == null ? [] : [1];
                me.set({account: response.data});
            }
        });
    }
});
