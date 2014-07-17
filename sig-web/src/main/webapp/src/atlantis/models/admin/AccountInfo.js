/*
 * Agent Model - 基本信息
 * @author : liangxiao
 * @date   : 2013
 */

Agent.Models.AccountInfo = Backbone.Model.extend({
    defaults: {
        company: null,
        account: null,
        pay: null
    },
    
    viewPay: function() {
        /*
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
        var roleId = parseInt($("#RoleId").val(), 10);
        if (roleId == 101 || roleId == 102 || roleId == 103 || roleId == 108 || roleId == 109) {
            return true;
        } else {
            return false;
        }
    },
    
    getCompany: function() {
        var me = this;
        me.set({company: null}, {silent : true});
        
        dwr.request.run({
            method: "AccountManageAction.getCompanyInfo",
            args: [],
            success: function(response) {
                me.set({company: response.data});
                
                if (me.viewPay()) {
                    me.getPay({agentId: parseInt($("#AgentId").val(), 10)});
                }
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
                
                if (me.viewPay()) {
                    me.getPay({agentId: parseInt($("#AgentId").val(), 10)});
                }
            }
        });
    },
    
    getPay: function(args) {
        var me = this;
        me.set({pay: null}, {silent : true});
        
        dwr.request.run({
            method: "PaymentAction.queryPayment",
            args: [args],
            success: function(response) {
                if (response.data != null) {
                    if (response.data.payBanks == null) {
                        response.data.payBanks = [];
                    }
                    $.each(response.data.payBanks, function(index, val) {
                        val.no = index;
                    });
                } else {
                    response.data = {
                        contactor: "",
                        tel: "",
                        gatherUnit: null,
                        gatherAddr: null,
                        zipp: null,
                        payBanks:　[],
                        openToCust: false
                    }
                }
                me.set({pay: response.data});
            }
        });
    }
});
