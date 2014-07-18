/*
 * 修改功能权限
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Views.Panel.Auth = Atlantis.Views.Panel.Base.extend({
    events: {
        "click .save": "save",
        "click .cancel": "hidePanel",
        "click .close": "hidePanel"
    },
    
    init: function(args) {
        this.userId = args.userId;
        
        //将滑动面板插入DOM
        this.$el.appendTo("body");
        this.$el.mustache("tpl-slide-panel", {
            id: "Auth",
            title: "修改功能权限",
            submit: "save"
        });
        this.$('.content').html('<div class="dept"><div class="tree-wrap"></div></div>');
        this.$(".hide").hide();
        this.mask = this.$("#AuthMask");
        this.panel = this.$("#AuthPanel");
        
        //获取菜单
        this.getMenu();
    },
    
    getMenu: function() {
        var view = this;
        dwr.request.run({
            context: "panel",
            method: "AtlantisRoleManageAction.getAtlantisFunctionAuthTree",
            args: [{userId: view.userId}],
            success: function(response) {
                $.each(response.data, function(index, val) {
                    val.state = "open";
                });
                view.menu = {data: response.data};
                
                //获取权限id
                view.getAuthIds();
            },
            fail: function(response) {
                view.showError(response.errorMsg);
            }
        });
    },
    
    getAuthIds: function() {
        var view = this;
        dwr.request.run({
            context: "panel",
            method: "AtlantisRoleManageAction.getSelectedAtlantisFunctionAuth",
            args: [{userId: view.userId}],
            success: function(response) {
                view.renderMenuTree(response.data.authIds);
            },
            fail: function(response) {
                view.showError(response.errorMsg);
            }
        });
    },
    
    renderMenuTree: function(authIds) {
        var menuTree = this.$(".tree-wrap");
        
        var view = this;
        menuTree.bind("loaded.jstree", function(event, data) {
            //选中菜单
            $.each(authIds, function(index, val) {
                var node = view.$(".tree-wrap #" + val);
                data.inst.check_node(node);
            });
        });
        
        menuTree.jstree({
            core: {animation: 150},
            plugins : ["themes", "json_data", "ui", "checkbox"],
            themes : {
                dots: false,
                icons: false,
                url: "assets/common/jstree/department/style.css"
            },
            json_data: this.menu,
            checkbox: {
                override_ui: true
            }
        });
    },
    
    save: function() {
        var menu = this.$(".tree-wrap").jstree("get_checked", -1, true);
        
        var authIds = [];
        $.each(menu, function(index, val) {
            authIds.push(parseInt($(val).children("a").attr("id"), 10));
        });
        
        var view = this;
        dwr.request.run({
            context: "panel",
            method: "AtlantisRoleManageAction.updateAtlantisFunctionAuth",
            args: [{
                userId: this.userId,
                authIds: authIds
            }],
            success: function(response) {
                view.hidePanel();
            },
            fail: function(response) {
                view.showError(response.errorMsg);
            }
        });
    }
});
