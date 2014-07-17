/*
 * 添加用户/修改账号信息
 * @author : liangxiao
 * @date   : 2013
 */

Agent.Views.Panel.Account = Agent.Views.Panel.Base.extend({
    events: {
        "click .save": "verify",
        "click .cancel": "hidePanel",
        "click .close": "hidePanel",
        "click :radio[name=role]": "toggle"
    },
    
    init: function(args) {
        this.parentView = args.parentView;
        this.edit = args.edit;
        this.editSelf = args.editSelf;
        
        //将滑动面板插入DOM
        this.$el.appendTo("body");
        this.$el.mustache("tpl-slide-panel", {
            id: "Account",
            title: this.edit ? "修改账号信息" : "添加用户",
            submit: "save"
        });
        this.$(".content").mustache(this.edit ? "tpl-edit-account" : "tpl-new-account");
        this.$(".content").append($.Mustache.render("tpl-account-common"));
        //系统角色
        if (!this.editSelf) {
            this.$("#Role").append($.Mustache.render("tpl-account-role", {
                role: this.parentView.model.get("role")
            }));
        }
        this.$(".hide").hide();
        this.mask = this.$("#AccountMask");
        this.panel = this.$("#AccountPanel");
        
        //初始化控件
        esui.init();
        
        //渲染
        if (this.edit) {
            this.renderEdit();
        } else {
            this.renderNew();
        }
    },
    
    renderEdit: function() {
        var account = this.parentView.model.get("account");
        esui.get("Name").setValue(account.userName);
        esui.get("Account").setValue(account.account);
        esui.get("Tel").setValue(account.phone);
        esui.get("Email").setValue(account.email);
        esui.get("Remark").setValue(account.mem);
        
        if (this.editSelf) { //修改自己
            this.$("#Role").remove();
        } else {
            //系统角色
            esui.get("R" +　account.roleId).setChecked(true);
            if (account.roleId == 104) { //总监
                this.$("#ChiefRow").show();
                if (account.sellManager) {
                    esui.get("Chief").setChecked(true);
                }
            }
            if (account.roleId == 105) { //主管
                this.$("#ManagerRow").show();
                if (account.sellManager) {
                    esui.get("Manager").setChecked(true);
                }
            }
            //获取直属上级
            this.getSuperior(account.roleId, this.renderSuperiorOnEdit);
            //获取下级账号
            this.hasSubAccount = false;
            var view = this;
            dwr.request.run({
                context: "panel",
                method: "AgentUserManageAction.checkHasChildren",
                args: [{userId: account.userId}],
                success: function(response) {
                    if (response.data) {
                        view.hasSubAccount = true;
                    }
                },
                fail: function(response) {
                    view.showError(response.errorMsg);
                }
            });
        }
    },
    
    renderNew: function() {
        //系统角色
        var roleId = this.parentView.model.get("role")[0].roleId;
        esui.get("R" + roleId).setChecked(true);
        if (roleId == 104) { //总监
            this.$("#ChiefRow").show();
        }
        if (roleId == 105) { //主管
            this.$("#ManagerRow").show();
        }
        //获取直属上级
        this.getSuperior(roleId, this.renderSuperiorOnNew);
    },
    
    toggle: function(e) {
        var roleId = parseInt($(e.target).attr("data-control").replace(/R/, ""), 10),
            chief = this.$("#ChiefRow"),
            manager = this.$("#ManagerRow");
        if (roleId == 104) { //总监
            chief.show();
            manager.hide();
        } else if (roleId == 105) { //主管
            chief.hide();
            manager.show();
        } else {
            chief.hide();
            manager.hide();
        }
        //获取直属上级
        this.getSuperior(roleId, this.renderSuperiorOnClick);
    },
    
    getSuperior: function(roleId, callback) {
        var view = this;
        dwr.request.run({
            context: "panel",
            method: "AgentUserManageAction.querySuperiorsByRoleId",
            args: [{roleId: roleId}],
            success: function(response) {
                callback.call(view, response);
            },
            fail: function(response) {
                view.showError(response.errorMsg);
            }
        });
    },
    
    renderSuperiorOnEdit: function(response) {
        if (response.data != null) {
            this.showSuperior(response, this.parentView.model.get("account").superiorId);
        } else {
            this.showNoSuperior();
        }
    },
    
    renderSuperiorOnNew: function(response) {
        if (response.data != null) {
            this.showSuperior(response, response.data[0].userId);
        } else {
            this.showNoSuperior();
        }
    },
    
    renderSuperiorOnClick: function(response) {
        if (response.data != null) {
            this.$("#Superior").html('<label><span>*</span>直属上级：</label>');
            this.showSuperior(response, response.data[0].userId);
        } else {
            this.showNoSuperior();
        }
    },
    
    showSuperior: function(response, userId) {
        this.$("#Superior").append($.Mustache.render("tpl-account-superior", {
            superior: response.data
        }));
        esui.init();
        esui.get("S" +　userId).setChecked(true);
        this.$("#Superior").show();
    },
    
    showNoSuperior: function(roleId) {
        var roleId = parseInt(this.$("#Role :checked").attr("data-control").replace(/R/, ""), 10);
        if (roleId == 105) {
            //一级主管必须有上级
            this.$("#Superior").html($.Mustache.render("tpl-account-novp"));
            this.$("#Superior").show();
        } else if (roleId == 106 || roleId == 107 || (roleId == 112 && $("#RoleId").val() != "108")) {
            //一级销售、一级客服、一级BBS用户必须有上级
            this.$("#Superior").html($.Mustache.render("tpl-account-nomanager"));
            this.$("#Superior").show();
        } else {
            this.$("#Superior").html('<label><span>*</span>直属上级：</label>');
            this.$("#Superior").hide();
        }
    },
    
    verify: function() {
        var oldInfo = this.parentView.model.get("account");
        
        if (this.edit) {
            var userId = oldInfo.userId;
        } else {
            //账号
            var account = $.trim(esui.get("Account").getValue());
            if (account == "") {
                esui.get("Account").setValue("");
                esui.get("Account").select();
                this.showError("请填写账号");
                return;
            }
            if (!Util.isEmail(account)) {
                esui.get("Account").select();
                this.showError("账号必须是Email格式");
                return;
            }
            
            //密码
            var psw = esui.get("Psw1").getValue(),
                repeatPsw = esui.get("Psw2").getValue();
            if (psw.length < 8) {
                this.showError("密码长度不能小于8位");
                esui.get("Psw1").select();
                return;
            }
            if (psw.length > 16) {
                this.showError("密码长度不能超过16位");
                esui.get("Psw1").select();
                return;
            }
            if (!Util.isPassword(psw)) {
                this.showError("密码必须且只能包含数字、小写字母、大写字母、英文半角符号中的任意三种");
                esui.get("Psw1").select();
                return;
            }
            if (repeatPsw != psw) {
                this.showError("密码不一致");
                esui.get("Psw2").select();
                return;
            }
        }
        
        //姓名
        var userName = $.trim(esui.get("Name").getValue());
        if (userName == "") {
            esui.get("Name").setValue("");
            esui.get("Name").select();
            this.showError("请填写姓名");
            return;
        }
        if (userName == "无对应客服" || userName == "无对应销售") {
            esui.get("Name").select();
            this.showError("该姓名已存在");
            return;
        }
        if (Util.getBytes(userName) > 12) {
            esui.get("Name").select();
            this.showError("姓名过长");
            return;
        }
        
        //电话
        var phone = $.trim(esui.get("Tel").getValue());
        if (phone == "") {
            esui.get("Tel").setValue("");
            esui.get("Tel").select();
            this.showError("请填写联系电话");
            return;
        }
        if (Util.getBytes(phone) > 32) {
            esui.get("Tel").select();
            this.showError("联系电话过长");
            return;
        }
        
        //邮箱
        var email = $.trim(esui.get("Email").getValue());
        if (email == "") {
            esui.get("Email").setValue("");
            esui.get("Email").select();
            this.showError("请填写常用邮箱");
            return;
        }
        if (!Util.isEmail(email)) {
            esui.get("Email").select();
            this.showError("常用邮箱必须是Email格式");
            return;
        }
        
        //备注
        var mem = esui.get("Remark").getValue();
        if (Util.getBytes(mem) > 100) {
            esui.get("Remark").select();
            this.showError("备注过长");
            return;
        }
        
        //系统角色
        var roleId;
        if (!this.editSelf) {
            roleId = parseInt(this.$("#Role :checked").attr("data-control").replace(/R/, ""), 10);
            if (this.edit && this.hasSubAccount && roleId != oldInfo.roleId) {
                this.showError("修改系统用户角色前请先转移该账号的下级账号");
                return;
            }
        } else {
            roleId = oldInfo.roleId;
        }
        
        //是否为销售总监或销售主管
        var sellManager;
        if (!this.editSelf) {
            sellManager = false;
            if (roleId == 104) { //总监
                sellManager = esui.get("Chief").isChecked();
            } else if (roleId == 105) { //主管
                sellManager = esui.get("Manager").isChecked();
            }
        } else {
            sellManager = oldInfo.sellManager;
        }
        
        //直属上级
        var superiorId;
        if (!this.editSelf) {
            superiorId = null;
            var superior = this.$("#Superior :checked");
            if (superior.length != 0) {
                superiorId = parseInt(superior.attr("data-control").replace(/S/, ""), 10);
                if (this.edit && superiorId != oldInfo.superiorId) {
                    var view = this;
                    esui.Dialog.confirm({
                        title: '修改直属上级',
                        content: "修改用户直属上级会将该用户名下所有账号移至新主管下，<br>是否确认修改？",
                        onok: function() {
                            view.save({
                                account: account,
                                userPassword: psw,
                                userName: userName,
                                userId: userId,
                                roleId: roleId,
                                sellManager: sellManager,
                                superiorId: superiorId,
                                phone: phone,
                                email: email,
                                mem: mem
                            });
                        }
                    });
                    return; //模拟confirm不会阻塞
                }
            } else if (roleId == 105) {
                //主管必须有上级
                this.$("#Superior").html($.Mustache.render("tpl-account-novp"));
                this.$("#Superior").show();
                return;
            } else if (roleId == 106 || roleId == 107 || (roleId == 112 && $("#RoleId").val() != "108")) {
                //销售、客服、BBS用户必须有上级
                this.$("#Superior").html($.Mustache.render("tpl-account-nomanager"));
                this.$("#Superior").show();
                return;
            }
        } else {
            superiorId = oldInfo.superiorId;
        }
        
        this.save({
            account: account,
            userPassword: psw,
            userName: userName,
            userId: userId,
            roleId: roleId,
            sellManager: sellManager,
            superiorId: superiorId,
            phone: phone,
            email: email,
            mem: mem
        });
    },
    
    save: function(param) {
        var args = {
            userName: param.userName,
            roleId: param.roleId,
            sellManager: param.sellManager,
            superiorId: param.superiorId,
            phone: param.phone,
            email: param.email,
            mem: param.mem
        };
        
        if (this.edit) {
            args.userId = param.userId;
        } else {
            args.account = param.account;
            args.userPassword = md5(param.userPassword);
        }
        
        var view = this,
            method;
        if (this.edit) {
            if (this.editSelf) {
                method = "AgentUserManageAction.modifyUserBaseInfo";
            } else {
                method = "AgentUserManageAction.modifyUser";
            }
        } else {
            method = "AgentUserManageAction.addUser"
        }
        
        dwr.request.run({
            context: "panel",
            method: method,
            args: [args],
            success: function(response) {
                view.hidePanel();
                if (view.editSelf) {
                    //刷新账号信息
                    view.parentView.model.getAccount({userId: args.userId});
                } else {
                    //刷新公司结构
                    view.parentView.selectedUserId = view.edit ? args.userId : response.data.userId;
                    view.parentView.$(".company-tree").jstree("destroy");
                    view.parentView.$(".company-tree").html("加载中...");
                    view.parentView.model.getCompany({queryClient: false});
                    //刷新用户、关联客服、关联销售列表
                    view.parentView.updateUsers();
                    view.parentView.getCs();
                    view.parentView.getOp();
                }
            },
            fail: function(response) {
                view.showError(response.errorMsg);
            }
        });
    }
});
