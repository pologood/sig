/*
 * Atlantis Namespace
 */

Atlantis = {};
Atlantis.Views = {};         //View构造函数
Atlantis.Views.Panel = {};   //抽屉View构造函数
Atlantis.Models = {};        //Model构造函数
Atlantis.Models.Panel = {};  //抽屉Model构造函数
Atlantis.Collections = {};   //Collection构造函数
Atlantis.Router = null;      //Router构造函数
Atlantis.router = null;      //Router实例
Atlantis.Cache = {};         //Model实例缓存
Atlantis.Page = {};          //主区域View实例
Atlantis.Widgets = {};       //小部件View实例
Atlantis.Widgets.Panel = {}; //抽屉实例

Atlantis.init = function() {
    //加载模版
    $.Mustache.load('assets/tpl/main.html').done(function() {
        //实例化Router
        Atlantis.router = new Atlantis.Router();
        //开始监听hash
        Backbone.history.start({
            root: '/pages/atlantis/'
        });
        //维持心跳
        Util.live();
    });
};
