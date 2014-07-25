/*
 * Atlantis Router
 * @author : aris
 * @date   : 2014
 */

Atlantis.Router = Backbone.Router.extend({
    routes: {
        //首页
        '': 'index',
        'index/*query': 'index',

    },
    
    /*
     * 初始化
     */
    initialize: function() {
        //创建Head
        Atlantis.Widgets.Head = new Atlantis.Views.Head();
        //创建TopNav
        Atlantis.Widgets.TopNav = new Atlantis.Views.TopNav();
        //创建TabNav
        Atlantis.Widgets.TabNav = new Atlantis.Views.TabNav();
        //创建Foot
        Atlantis.Widgets.Foot = new Atlantis.Views.Foot();
        //创建MessageBox
        Atlantis.Widgets.MessageBox = new Atlantis.Views.MessageBox();
    },
    
    /*
     * 开始路由
     * @param {String} title 网页标题
     * @param {String} name  模块名称
     * @param {String} query 参数
     */
    startRout: function(title, name, query) {
        //销毁当前View
        var view = Atlantis.Page.cur;
        view && view.destroy && view.destroy();
        
        //隐藏提示
        Atlantis.Widgets.MessageBox.hide();
        Atlantis.Widgets.MessageBox.hideMask();
        
        //设置标题
        document.title = title;
        
        //创建新View和Model
        Atlantis.Page.cur = new Atlantis.Views[name]({
            model: Atlantis.Cache[name] || (Atlantis.Cache[name] = new Atlantis.Models[name]())
        });
        
        //渲染
        Atlantis.Page.cur.render(typeof query == 'undefined' ? '' : query);
    },
    
    /*
     * 跳转至外部链接
     * @param {String} url 外部链接
     */
    jumpTo: function(url) {
        window.location.href = url;
    },
    
    index: function(query) {
        this.startRout('首页', 'Index', query);
    },
    
    getFirstHash: function(tree) {
        var url, leaves;
        
        for (var i = 0, n = tree.length; i < n; i++) {
            if (tree[i]["name"] != undefined) {
                leaves = tree[i]["sub"];
                break;
            }
        }
        for (i = 0, n = leaves.length; i < n; i++) {
            if (leaves[i]["name"] != undefined) {
                url = leaves[i]["url"];
                break;
            }
        }
        
        return url.split("#")[1];
    }
});
