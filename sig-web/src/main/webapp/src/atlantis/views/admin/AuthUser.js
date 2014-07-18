/*
 * Atlantis View - 用户管理
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Views.AuthUser = Backbone.View.extend({
    el: $("#Right"),
    
    events: {
        //公司
        "click #IntroTab": "showIntro",
        "click #ClientTab": "showClient",
        "click a.query": "onQuery",
        "click .grid th input:checkbox": "checkAll",
        "click .grid td input:checkbox": "checkOne",
        "click .batch": "toggleBatch",
        "click #BatchPanel .ok": "batch",
        "click #BatchPanel .cancel": "hideBatch",
        //账号
        "click .add": "addAccount",
        "click .del": "toggleDel",
        "click #DelRolePanel .ok": "delAccount",
        "click #DelRolePanel .cancel": "hideDel",
        "click .edit-psw": "togglePsw",
        "click .psw .cancel" : "hidePsw",
        "click .psw .ok" : "savePsw",
        "click #EditAccount": "editAccount",
        "click #EditAuth": "editAuth"
    },
    
    initialize: function() {
        this.model.bind("change:company", this.renderCompany, this);
        this.model.bind("change:client", this.renderTable, this);
        this.model.bind("change:account", this.renderAccount, this);
        this.model.bind("change:role", this.renderRole, this);
        
        this.delegateAndReadonly = $("#AdminRoleID").val() == "1007" ? true : false;
    },
    
    destroy: function() {
        $(".company-tree").jstree("destroy");
        esui.dispose();
        this.model.unbind();
        this.$el.unbind();
        this.$el.html("");
        this.$el.css({'padding-bottom': 20});
        Atlantis.Widgets.TreeNavSimple.destroy();
    },
    
    renderTopNav: function() {
        Atlantis.Widgets.TopNav.render(7);
    },
    
    renderTreeNav: function() {
        Atlantis.Widgets.TreeNavSimple = new Atlantis.Views.TreeNavSimple(Atlantis.TreeNav.Admin, 0, 0);
    },
    
    render: function(query) {
        //渲染导航
        this.renderTopNav();
        this.renderTreeNav();
        
        //加载模版
        $.Mustache.load('assets/tpl/slide-panel.html');
        $.Mustache.load('assets/tpl/slide-panel-account.html');
        var view = this;
        $.Mustache.load('assets/tpl/auth-user.html').done(function() {
            view.$el.mustache("tpl-auth-user", {
                op: view.delegateAndReadonly ? [] : [1]
            });
            view.$el.css({'padding-bottom': 0});
            
            //初始化控件
            view.initComponent();
            
            //获取公司信息, 只在此时查询客户列表, 修改或添加账号后不查询
            view.model.getCompany({queryClient: true});
            
            if (!view.delegateAndReadonly) {
                //获取关联客服
                view.getCs();
                //获取关联销售
                view.getOp();
            }
        });
    },
    
    getCs: function() {
        dwr.request.run({
            context: "noLoading",
            method: "AccountManageAction.getCSList",
            args: [],
            success: function(response) {
                var cs;
                if (response.data.length == 0) {
                    cs = [{value: 0, name: "无账号"}];
                } else {
                    cs = [{value: 0, name: "请选择"}];
                    $.each(response.data, function(index, val) {
                        cs.push({value: val.userid, name: val.username});
                    });
                }
                var csCtrl = esui.get("AssociationCS");
                csCtrl.datasource = cs;
                csCtrl.render();
                csCtrl.setValue(0);
            }
        });
    },
    
    getOp: function() {
        dwr.request.run({
            context: "noLoading",
            method: "AccountManageAction.getOPList",
            args: [],
            success: function(response) {
                var op;
                if (response.data.length == 0) {
                    op = [{value: 0, name: "无账号"}];
                } else {
                    op = [{value: 0, name: "请选择"}];
                    $.each(response.data, function(index, val) {
                        op.push({value: val.userid, name: val.username});
                    });
                }
                var opCtrl = esui.get("AssociationOP");
                opCtrl.datasource = op;
                opCtrl.render();
                opCtrl.setValue(0);
            }
        });
    },
    
    renderRole: function(model, role) {
        var data = [];
        $.each(role, function(index, val) {
            data.push({value: val.roleId, name: val.roleName});
        });
        if (esui.get("RoleList")) {
            var roleCtrl = esui.get("RoleList");
            roleCtrl.datasource = data;
            roleCtrl.render();
            roleCtrl.setValue(data[0].value);
            
            this.updateUsers();
        }
    },
    
    updateUsers: function() {
        //增删改账号后, 刷新用户列表
        this.getUserByRole(esui.get("RoleList").value);
    },
    
    getUserByRole: function(roleId) {
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisUserManageAction.queryUsersByRoleId",
            args: [{roleId: roleId}],
            success: function(response) {
                var user;
                if (response.data.length == 0) {
                    user = [{value: 0, name: "无账号"}];
                } else {
                    user = [{value: 0, name: "请选择"}];
                    $.each(response.data, function(index, val) {
                        user.push({value: val.userId, name: val.userName});
                    });
                }
                var userCtrl = esui.get("UserList");
                userCtrl.datasource = user;
                userCtrl.render();
                userCtrl.setValue(0);
            }
        });
    },
    
    defaultTreeHeight: 484,
    
    showIntro: function(e) {
        if ($(e.target).hasClass("active")) {
            return;
        }
        this.$("#IntroTab").addClass("active");
        this.$("#ClientTab").removeClass("active");
        this.$(".company-client").hide();
        this.$(".company-intro").show();
        this.setDefaultTreeHeight();
    },
    
    showClient: function(e) {
        if ($(e.target).hasClass("active")) {
            return;
        }
        this.$("#IntroTab").removeClass("active");
        this.$("#ClientTab").addClass("active");
        this.$(".company-intro").hide();
        this.$(".company-client").show();
        Util.fixTable(this.$(".grid"));
        this.setTreeHeight();
    },
    
    setDefaultTreeHeight: function() {
        this.$(".company-tree").css({
            height: this.defaultTreeHeight
        });
    },
    
    setTreeHeight: function() {
        this.$(".company-tree").css({
            height: Math.max(this.$(".company-client")[0].offsetHeight, this.defaultTreeHeight)
        });
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
    
    initComponent: function() {
        esui.init(this.el, {
            "QueryType": {
                datasource: [
                    {name:'客户ID', value: 1},
                    {name:'客户名称', value: 2},
                    {name:'客户账号', value: 3},
                    {name:'关联客服', value: 4},
                    {name:'关联销售', value: 5}
                ],
                value: 2
            },
            "AssociationType": {
                datasource: [
                    {name:'关联客服', value: 1},
                    {name:'关联销售', value: 2}
                ],
                value: 1
            },
            "AssociationCS": {
                datasource: [{name:'请选择', value: 0}],
                value: 0
            },
            "AssociationOP": {
                datasource: [{name:'请选择', value: 0}],
                value: 0
            },
            "PageSize": {
                datasource: [
                    {name:'20', value: 20},
                    {name:'50', value: 50},
                    {name:'100', value: 100}
                ],
                value: 20
            }
        });
        
        if (!this.delegateAndReadonly) {
            esui.get("AssociationType").onchange = function(value, item) {
                if (value == 1) {
                    $(esui.get("AssociationCS").main).show();
                    $(esui.get("AssociationOP").main).hide();
                } else {
                    $(esui.get("AssociationCS").main).hide();
                    $(esui.get("AssociationOP").main).show();
                }
            };
            
            var view = this;
            esui.get("RoleList").onchange = function(value, item) {
                view.getUserByRole(value);
            };
        }
        
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
    },
    
    getArgs: function() {
        this.lastArgs.queryType = esui.get("QueryType").value;
        this.lastArgs.query = $.trim(esui.get("Query").getValue());
    },
    
    onQuery: function() {
        this.getArgs();
        this.queryFirstPage();
    },
    
    queryFirstPage: function() {
        this.lastArgs.pageNo = 1;
        this.pageRendered = false;
        this.query(this.lastArgs);
    },
    
    query: function(args) {
        this.model.getClient(args);
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
    
    renderTable: function(model, client) {
        var args = this.lastArgs;
        
        if (client.rowCount == 0) {
            this.$(".info").show();
            this.$(".data").hide();
        } else {
            this.$(".info").hide();
            this.$(".data").show();
            
            //页码
            this.renderPage(client.rowCount);
            
            //表格
            this.$(".grid").html($.Mustache.render("tpl-auth-client-table", {
                data: client.data,
                op: this.delegateAndReadonly ? [1] : []
            }));
            Util.fixTable(this.$(".grid"));
        }
        
        //调整树的高度
        this.setTreeHeight();
    },
    
    renderCompany: function(model, company) {
        var companyTree = this.$(".company-tree"),
            view = this;
        
        //加载完毕
        companyTree.bind("loaded.jstree", function(event, data) {
            //标记可查看账号信息的结点
            var accountNode = companyTree.find('a[nodeType="2"]');
            $.each(accountNode, function(index, node) {
                $(node).addClass("account-node");
            });
            //全部展开
            companyTree.jstree("open_all", -1);
            //选中
            var selectedUser;
            if (view.selectedUserId) {
                selectedUser = view.$(".company-tree #" + view.selectedUserId)[0];
            } else {
                selectedUser = view.$(".company-tree ul li a")[0];
            }
            data.inst.select_node(selectedUser);
        });
        
        //选中
        companyTree.bind("select_node.jstree", function(event, data) {
            var elem = $(data.rslt.obj.context);
            
            if (!elem.attr("id")) { //jstree bug, 删除结点后自动选中的elem为<li>
                elem = elem.children("a");
            }
            
            var nodeType = parseInt(elem.attr("nodeType"), 10);
                userId = parseInt(elem.attr("id"), 10);
            
            //保存用户id
            view.userId = userId;
            
            if (nodeType == 1) { //显示公司信息
                view.$(".account-info").hide();
                view.$(".company-info").show();
                view.setTreeHeight();
                //刷新客户列表
                //view.query(view.lastArgs);
            } else { //显示账号信息
                view.$(".company-info").hide();
                view.$(".account-info").show();
                view.setDefaultTreeHeight();
                //获取账号信息
                view.model.getAccount({userId: userId});
            }
        });
        
        //创建
        companyTree.jstree({
            core: {animation: 150},
            plugins : ["themes", "json_data", "ui", "crrm"],
            themes : {
                dots: false,
                url: "../../asset/common/jstree/company/style.css"
            },
            json_data: company.companyArchObj,
            ui: {
                select_limit: 1,
                selected_parent_close: false
            }
        });
        
        this.$(".company-intro").html($.Mustache.render("tpl-auth-company-intro", {
            company: company
        }));
    },
    
    toggleBatch: function(e) {
        var elem = $(e.target);
        elem.toggleClass("batch-show");
        if (elem.hasClass("batch-show")) {
            this.$("#BatchPanel").slideDown(200);
        } else {
            this.$("#BatchPanel").slideUp(200);
        }
    },
    
    hideBatch: function() {
        this.$(".batch").removeClass("batch-show");
        this.$("#BatchPanel").slideUp(200);
    },
    
    batch: function() {
        var type = esui.get("AssociationType").value;
        var args = {
            newCsOpType: type,
            modifyCsOrOpList: []
        };
        if (type == 1) {
            args.newCsOpId = esui.get("AssociationCS").value;
        } else {
            args.newCsOpId = esui.get("AssociationOP").value;
        }
        var cust = this.$(".grid td input:checked");
        $.each(cust, function(index, elem) {
            var id = elem.id.split(",");
            args.modifyCsOrOpList.push({
                csId: id[0],
                opId: id[1],
                custId: id[2]
            });
        });
        if (args.modifyCsOrOpList.length == 0) {
            this.showError("请选择客户");
            return;
        }
        if (args.newCsOpId == 0) {
            this.showError("请选择" + (type == 1 ? "关联客服" : "关联销售"));
            return;
        }
        
        var view = this;
        dwr.request.run({
            method: "AccountManageAction.modifyCsOp",
            args: [args],
            success: function(response) {
                view.hideBatch();
                view.query(view.lastArgs);
            }
        });
    },
    
    renderAccount: function(model, account) {
        var isBBSUser = account.roleId == 112;
        var opAuth = true;
        if (this.delegateAndReadonly) {
            opAuth = false;
        } else if (!Atlantis.Auth.ViewAuthConfig || isBBSUser) {
            opAuth = false;
        }
        this.$(".account-info").html($.Mustache.render("tpl-auth-account-info", {
            account: account,
            op: this.delegateAndReadonly ? [] : [1],
            opAuth: opAuth ? [1] : []
        }));
        esui.init(); //密码输入框
    },
    
    togglePsw: function() {
        this.$(".psw").toggle(200);
    },
    
    hidePsw: function() {
        this.$(".psw").hide(200);
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
    
    toggleDel: function(e) {
        var elem = $(e.target);
        elem.toggleClass("del-show");
        if (elem.hasClass("del-show")) {
            this.$("#DelRolePanel").slideDown(200);
        } else {
            this.$("#DelRolePanel").slideUp(200);
        }
    },
    
    hideDel: function() {
        this.$(".del").removeClass("del-show");
        this.$("#DelRolePanel").slideUp(200);
    },
    
    delAccount: function() {
        var userId = esui.get("UserList").value;
        if (userId == 0) {
            this.showError("请选择账号");
            return;
        }
        var view = this;
        dwr.request.run({
            context: "noLoading",
            method: "AtlantisUserManageAction.checkHasChildren",
            args: [{userId: userId}],
            success: function(response) {
                if (response.data) {
                    view.showError("该账号存在挂靠的下级或客户账号，请转移后再删除");
                    return;
                } else {
                    esui.Dialog.confirm({
                        title: '删除用户',
                        content: "删除后无法恢复，请确认是否删除？",
                        onok: function() {
                            view.callDel(userId);
                        }
                    });
                }
            }
        });
    },
    
    callDel: function(userId) {
        var view = this;
        dwr.request.run({
            method: "AtlantisUserManageAction.deleteUser",
            args: [{userId: userId}],
            success: function(response) {
                view.hideDel();
                //刷新用户、关联客服、关联销售列表
                view.updateUsers();
                view.getCs();
                view.getOp();
                //删除结点，默认选中兄弟结点或父结点
                view.$(".company-tree").jstree("remove", view.$(".company-tree #" + userId)[0]);
            }
        });
    },
    
    addAccount: function() {
        Atlantis.Widgets.Panel.Account = new Atlantis.Views.Panel.Account({
            parentView: this,
            edit: false,
            editSelf: false
        });
    },
    
    editAccount: function() {
        Atlantis.Widgets.Panel.Account = new Atlantis.Views.Panel.Account({
            parentView: this,
            edit: true,
            editSelf: false
        });
    },
    
    editAuth: function() {
        Atlantis.Widgets.Panel.Auth = new Atlantis.Views.Panel.Auth({
            userId: this.userId
        });
    },
    
    showError: function(msg) {
        clearTimeout(this.timer);
        
        Atlantis.Widgets.MessageBox.show(msg);
        
        this.timer = setTimeout(function() {
            Atlantis.Widgets.MessageBox.hide();
        }, 5000);
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
