/*
 * Atlantis View - TreeNav
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.TreeNav = Backbone.View.extend({
    el: $("#Left"),
    
    events: {
        "click .tab a": "onTabClick",
        "click .leaf": "onLeafClick",
        "click .external": "sendClickLog",
        "click .node": "toggle",
        "click #Slider": "slide"
    },
    
    initialize: function() {
        this.$el.html(this.createHTML(Atlantis.TreeNav.Stat));
        this.setMenu(arguments[0], arguments[1], arguments[2]);
        this.$el.removeClass("left-hide");
        $("#Right").removeClass("right-expand");
    },
    
    destroy: function() {
        this.$el.unbind();
        this.$el.html("");
    },
    
    nodeTpl: '<a href="javascript:void(0)" hidefocus="true" class="node" index="{{index}}" tid="{{tid}}">{{name}}</a>',
    leafTpl: '<a href="javascript:void(0)" hidefocus="true" class="leaf" index="{{index}}" tid="{{tid}}">{{name}}</a>',
    externalTpl: '<a href="{{url}}" target="{{target}}" hidefocus="true" class="external" index="{{index}}" tid="{{tid}}" logid="{{logid}}">{{name}}</a>',
    tabTpl: '<div class="tab"><a href="javascript:void(0)" hidefocus="true" index="{{index}}" tid="{{tid}}" class="{{className}}">{{name}}</a></div>',
    
    createHTML: function(config) {
        var html = [],
            me = this;
        //title
        html.push('<div class="tab"><span></span></div>');
        //tree
        html.push('<div id="TreeNav">');
        $.each(config, function(index, tab) {
            if (tab.name != undefined) {
                html.push(me.createTree(tab.sub, tab.className));
            }
        });
        html.push('</div>');
        //hr
        html.push('<div class="hr"></div>');
        //tab
        $.each(config, function(index, tab) {
            if (tab.name != undefined) {
                html.push(Mustache.to_html(me.tabTpl, {
                    className: tab.className,
                    index: tab.index,
                    name: tab.name,
                    tid: tab.tid
                }));
            }
        });
        //slider
        html.push('<div id="Slider" class="slide-left"></div>');
        
        return html.join("");
    },
    
    createTree: function(tree, className) {
        var html = [],
            me = this;
        html.push('<div class="' + className + '">');
        $.each(tree, function(nodeIndex, nodeValue) {
            if (nodeValue.name != undefined) { //有一级菜单权限
                html.push(Mustache.to_html(me.nodeTpl, {
                    index: nodeValue.index,
                    name: nodeValue.name,
                    tid: nodeValue.tid
                }));
                html.push('<div>');
                $.each(nodeValue.sub, function(leafIndex, leafValue) {
                    if (leafValue.name != undefined) { //有二级菜单权限
                        if (leafValue.url && !/^#/.test(leafValue.url)) { //外部链接
                            html.push(Mustache.to_html(me.externalTpl, {
                                url: leafValue.url,
                                target: leafValue.target,
                                index: leafValue.index,
                                name: leafValue.name,
                                tid: leafValue.tid,
                                logid: leafValue.logid
                            }));
                        } else { //内部链接
                            html.push(Mustache.to_html(me.leafTpl, {
                                index: leafValue.index,
                                name: leafValue.name,
                                tid: leafValue.tid
                            }));
                        }
                    }
                });
                html.push('</div>');
            }
        });
        html.push('</div>');
        
        return html.join("");
    },
    
    /*
     * 设置菜单状态
     * @param {Number} tabIndex  tab序号
     * @param {Number} nodeIndex 展开结点序号
     * @param {Number} leafIndex 叶结点序号
     */
    setMenu: function(tabIndex, nodeIndex, leafIndex) {
        var tab = $('#Left .tab a[index="' + tabIndex + '"]');
            className = tab.attr("class");
        //tab
        tab.parent().addClass("active");
        //title
        $("#Left .tab span").html(tab.html()).attr({"class": className});
        //tree
        $("#TreeNav").children().hide();
        if (window.location.hash.indexOf("target=tab") != -1) {
            //由tab触发，使用滑动效果
            $("#TreeNav ." + className).effect("slide", {direction: "right"}, 160);
        } else {
            $("#TreeNav ." + className).show();
        }
        //leaf
        $("#TreeNav ." + className + " .leaf").removeClass("active");
        var node = $('#TreeNav .' + className + ' .node[index="' + nodeIndex + '"]');
            leaf = node.next().children('a[index="' + leafIndex + '"]');
        leaf.addClass("active");
    },
    
    /*
     * tab点击
     */
    onTabClick: function(e) {
        var me = $(e.target),
            className = me.attr("class"),
            tabIndex = me.attr("index"),
            parent = me.parent();
        
        if (parent.hasClass("active")) {
            return;
        }
        
        var firstNode = $("#TreeNav ." + className).children("div")[0],
            leaf = $(firstNode).children("a:first-child"),
            nodeIndex = leaf.parent().prev().attr("index"),
            leafIndex = leaf.attr("index");
        
        this.jump(tabIndex, nodeIndex, leafIndex, true);
    },
    
    sendClickLog: function(e) {
        var logid = $(e.target).attr("logid");
        Util.sendClickLog(logid);
    },
    
    /*
     * 叶结点点击
     */
    onLeafClick: function(e) {
        var me = $(e.target),
            tabIndex = $("#Left div.active a").attr("index"),
            nodeIndex = me.parent().prev().attr("index"),
            leafIndex = me.attr("index");
        this.jump(tabIndex, nodeIndex, leafIndex, false);
    },
    
    /*
     * 跳转
     */
    jump: function(tabIndex, nodeIndex, leafIndex, tab) {
        var config = Atlantis.TreeNav.Stat[tabIndex]["sub"][nodeIndex]["sub"][leafIndex],
            url;
        if (!config.sub) {
            url = config.url;
        } else {
            var urlList = config.sub;
            for (var i = 0, n = urlList.length; i < n; i++) {
                if (urlList[i].name != undefined) {
                    url = urlList[i].url;
                    break;
                }
            }
        }
        
        //改变hash
        var hash = url.split("#")[1],
            param = tab ? "target=tab" : "";
        Atlantis.router.navigate(hash + param, {trigger: true});
    },
    
    /*
     * 展开结点点击
     */
    toggle: function(e) {
        var me = $(e.target);
        me.toggleClass("fold");
        if (me.hasClass("fold")) {
            me.next().slideUp(160);
        } else {
            me.next().slideDown(160);
        }
    },
    
    /*
     * 菜单滑动
     */
    slide: function(e) {
        $(e.target).toggleClass("slide-right");
        
        $("#Left .tab").toggle();
        $("#Left .hr").toggle();
        $("#TreeNav").toggle();
        
        $("#Left").toggleClass("left-hide", 200);
        $("#Right").toggleClass("right-expand", 200);
    }
});
