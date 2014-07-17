/*
 * Atlantis View - 基本信息
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Views.AccountInfo = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        "click .edit-psw": "togglePsw",
        "click .psw .cancel" : "hidePsw",
        "click .psw .ok" : "savePsw",
        "click #EditPay": "editPay",
        "click #EditAccount": "editAccount"
    },
    
    initialize: function() {
        this.model.bind("change:company", this.renderCompany, this);
        this.model.bind("change:account", this.renderAccount, this);
        this.model.bind("change:pay", this.renderPay, this);
        
        this.delegateAndReadonly = $("#AdminRoleID").val() == "1007" ? true : false;
    },
    
    destroy: function() {
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.html("");
        Atlantis.Widgets.TreeNavSimple.destroy();
    },
    
    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(7);
    },
    
    renderTreeNav: function() {
        Atlantis.Widgets.TreeNavSimple = new Atlantis.Views.TreeNavSimple(Atlantis.TreeNav.Admin, 1, 0);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //加载模版
        $.Mustache.load('../../asset/agent/tpl/slide-panel.html');
        $.Mustache.load('../../asset/agent/tpl/slide-panel-account.html');
        $.Mustache.load('../../asset/agent/tpl/slide-panel-pay.html');
        var view = this;
        $.Mustache.load('../../asset/agent/tpl/account-info.html').done(function() {
            view.$el.html($.Mustache.render("tpl-account-wrap"));
            
            view.userId = parseInt($("#UserId").val(), 10);
            
            var roleId = parseInt($("#RoleId").val(), 10);
            if (roleId == 101 || roleId == 108) { //公司信息
                view.model.getCompany();
            } else { //账号信息
                view.model.getAccount({userId: view.userId});
            }
        });
    },
    
    renderCompany: function(model, company) {
        this.$(".company-wrap").html($.Mustache.render("tpl-account-company", {
            company: company,
            op: this.delegateAndReadonly ? [] : [1]
        }));
        var roleId = parseInt($("#RoleId").val(), 10);
        if (roleId == 101) { //一代
            this.$("#Level1Tip").show();
        } else { //二代
            this.$("#Level2Tip").show();
        }
        this.$(".company-wrap").show();
        esui.init();
    },
    
    renderAccount: function(model, account) {
        this.$(".account-wrap").html($.Mustache.render("tpl-account-info", {
            account: account,
            op: this.delegateAndReadonly ? [] : [1]
        }));
        this.$(".account-wrap").show();
        esui.init();
        
        //更新登录信息
        $("#Head span.account-name").html(account.userName);
        $("#UserName").val(account.userName);
    },
    
    renderPay: function(model, pay) {
        this.$(".pay-wrap").html($.Mustache.render("tpl-account-pay", {
            pay: pay,
            op: this.delegateAndReadonly ? [] : [1]
        }));
        if (pay.openToCust) {
            $("#UnOpenTip").hide();
            $("#OpenTip").show();
        } else {
            $("#UnOpenTip").show();
            $("#OpenTip").hide();
        }
        if (pay.gatherUnit == null) $("#GatherUnit").remove();
        if (pay.gatherAddr == null) $("#GatherAddr").remove();
        if (pay.zipp == null) $("#Zipp").remove();
        this.$(".pay-wrap").show();
    },
    
    togglePsw: function() {
        $(".psw").toggle(200);
    },
    
    hidePsw: function() {
        $(".psw").hide(200);
        esui.get("Psw1").setValue("");
        esui.get("Psw2").setValue("");
        esui.get("Psw3").setValue("");
    },
    
    savePsw: function() {
        var oldPsw = esui.get("Psw1").getValue(),
            newPsw = esui.get("Psw2").getValue(),
            repeatPsw = esui.get("Psw3").getValue();
        
        if (oldPsw.length == 0) {
            this.showPswError("error1", "请填写原密码");
            esui.get("Psw1").select();
            return;
        }
        
        if (newPsw.length < 8) {
            this.showPswError("error2", "密码长度不能小于8位");
            esui.get("Psw2").select();
            return;
        }
        
        if (newPsw.length > 16) {
            this.showPswError("error2", "密码长度不能超过16位");
            esui.get("Psw2").select();
            return;
        }
        
        if (!Util.isPassword(newPsw)) {
            this.showPswError("error2", "密码必须且只能包含数字、小写字母、大写字母、英文半角符号中的任意三种");
            esui.get("Psw2").select();
            return;
        }
        
        if (repeatPsw != newPsw) {
            this.showPswError("error3", "密码不一致");
            esui.get("Psw3").select();
            return;
        }
        
        var view = this;
        dwr.request.run({
            method: "AtlantisUserManageAction.motifyPassword",
            args: [{
                userId: this.userId,
                userPassword: md5(oldPsw),
                newUserPassword: md5(newPsw)
            }],
            success: function(response) {
                view.hidePsw();
            }
        });
    },
    
    editAccount: function() {
        Atlantis.Widgets.Panel.Account = new Atlantis.Views.Panel.Account({
            parentView: this,
            edit: true,
            editSelf: true
        });
    },
    
    editPay: function() {
        Atlantis.Widgets.Panel.Pay = new Atlantis.Views.Panel.Pay({
            parentView: this
        });
    },
    
    showPswError: function(className, msg) {
        clearTimeout(this.pswTimer);
        
        this.$(".error").empty();
        this.$(".error").hide();
        
        this.$("." + className).html(msg);
        this.$("." + className).show();
        
        this.pswTimer = setTimeout(function() {
            this.$(".error").empty();
            this.$(".error").hide();
        }, 5000);
    }
});
