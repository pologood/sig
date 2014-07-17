/*
 * Agent Router
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Router = Backbone.Router.extend({
    routes: {
        //管理首页
        '': 'index',
        'index/*query': 'index',
        
        //消息中心
        'mc/msg/': 'msg',
        'mc/noti/': 'noti',
        'mc/notidetail/*query': 'notiDetail',
        
        /*
         * 客户管理
         */
        'cust/': 'custAdmin', //外部入口, url不宜修改
        //客户概况
        "cust/overview/accountcenter/*query": "accountCenter",
        "cust/overview/consume/realtime/*query": "consumeRealtimeCust", //外部入口, url不宜修改
        //客户优化
        "cust/opt/account/*query": "optAccount",
        "cust/opt/detail/*query": "optDetail",
        //客户提醒
        "cust/remind/cost/cust/*query": "remindCostCust",
        "cust/remind/cost/custdetail/*query": "remindCostCustDetail",
        "cust/remind/cost/op/*query": "remindCostOp",
        "cust/remind/cost/opdetail/*query": "remindCostOpDetail",
        
        /*
         * 统计信息
         */
        //任务完成情况
        'stat/task/cost/*query': 'taskCost',
        'stat/task/new/*query': 'taskNew',
        'stat/task/account/*query': 'taskAccount',
        //竞价服务
        'stat/consume/overview/*query': 'consumeOverview',
        'stat/consume/client/*query'  : 'consumeClient',
        'stat/consume/realtime/*query'  : 'consumeRealtimeStat',
        'stat/account/cs/*query': 'accountCs',
        'stat/account/client/*query': 'accountClient',
        'stat/increment/overview/*query': 'incrementOverview',
        'stat/increment/sales/*query'   : 'incrementSales',
        'stat/increment/service/*query' : 'incrementService',
        'stat/stock/overview/*query': 'stockOverview',
        'stat/stock/service/*query' : 'stockService',
        
        /*
         * 弹窗
         */
        //客户情况列表
        'stat/cust/*query': 'cust',
        //客户每日消耗
        'stat/perday/*query': 'perday',
        
        /*
         * 系统管理
         */
        //权限管理
        'admin/auth/user/*query': 'authUser',
        //账号管理
        'admin/account/info/*query': 'accountInfo'
    },
    
    /*
     * 初始化
     */
    initialize: function() {
        //创建Head
        Agent.Widgets.Head = new Agent.Views.Head();
        //创建TopNav
        Agent.Widgets.TopNav = new Agent.Views.TopNav();
        //创建TabNav
        Agent.Widgets.TabNav = new Agent.Views.TabNav();
        //创建Foot
        Agent.Widgets.Foot = new Agent.Views.Foot();
        //创建MessageBox
        Agent.Widgets.MessageBox = new Agent.Views.MessageBox();
    },
    
    /*
     * 开始路由
     * @param {String} title 网页标题
     * @param {String} name  模块名称
     * @param {String} query 参数
     */
    startRout: function(title, name, query) {
        //销毁当前View
        var view = Agent.Page.cur;
        view && view.destroy && view.destroy();
        
        //隐藏提示
        Agent.Widgets.MessageBox.hide();
        Agent.Widgets.MessageBox.hideMask();
        
        //设置标题
        document.title = title;
        
        //创建新View
        Agent.Page.cur = new Agent.Views[name]({
            model: Agent.Cache[name] || (Agent.Cache[name] = new Agent.Models[name]())
        });
        
        //渲染
        Agent.Page.cur.render(typeof query == 'undefined' ? '' : query);
    },
    
    /*
     * 跳转至外部链接
     * @param {String} url 外部链接
     */
    jumpTo: function(url) {
        window.location.href = url;
    },
    
    index: function(query) {
        this.startRout('管理首页', 'Index', query);
    },
    
    msg: function(query) {
        this.startRout('系统消息', 'Msg', query);
    },
    
    noti: function(query) {
        this.startRout('通知', 'Noti', query);
    },
    
    notiDetail: function(query) {
        this.startRout('通知', 'NotiDetail', query);
    },
    
    custAdmin: function() {
        var hash = this.getFirstHash(Agent.TreeNav.Cust);
        Agent.router.navigate(hash, {trigger: true});
    },
    
    accountCenter: function(query) {
        this.startRout('客户中心', 'AccountCenter', query);
    },
    
    consumeRealtimeCust: function(query) {
        this.startRout('客户实时消耗', 'ConsumeRealtimeCust', query);
    },
    
    optAccount: function(query) {
        this.startRout('账户优化', 'OptAccount', query);
    },
    
    optDetail: function(query) {
        this.startRout('账户优化详情', 'OptDetail', query);
    },
    
    remindCostCust: function(query) {
        this.startRout('影响消耗操作提醒', 'RemindCostCust', query);
    },
    
    remindCostCustDetail: function(query) {
        this.startRout('影响消耗操作提醒', 'RemindCostCustDetail', query);
    },
    
    remindCostOp: function(query) {
        this.startRout('影响消耗操作提醒', 'RemindCostOp', query);
    },
    
    remindCostOpDetail: function(query) {
        this.startRout('影响消耗操作提醒', 'RemindCostOpDetail', query);
    },
    
    taskCost: function(query) {
        this.startRout('消耗任务', 'TaskCost', query);
    },
    
    taskNew: function(query) {
        this.startRout('开户任务', 'TaskNew', query);
    },
    
    taskAccount: function(query) {
        this.startRout('标准账户任务', 'TaskAccount', query);
    },
    
    consumeRealtimeStat: function(query) {
        this.startRout('实时消耗', 'ConsumeRealtimeStat', query);
    },
    
    consumeOverview: function(query) {
        this.startRout('总体消耗统计', 'ConsumeOverview', query);
    },
    
    consumeClient: function(query) {
        this.startRout('客户消耗统计', 'ConsumeClient', query);
    },
    
    accountCs: function(query) {
        this.startRout('账户概况', 'AccountCs', query);
    },
    
    accountClient: function(query) {
        this.startRout('账户概况', 'AccountClient', query);
    },
    
    incrementOverview: function(query) {
        this.startRout('总体统计', 'IncrementOverview', query);
    },
    
    incrementSales: function(query) {
        this.startRout('销售员维度统计', 'IncrementSales', query);
    },
    
    incrementService: function(query) {
        this.startRout('客服维度统计', 'IncrementService', query);
    },
    
    stockOverview: function(query) {
        this.startRout('总体统计', 'StockOverview', query);
    },
    
    stockService: function(query) {
        this.startRout('客服维度统计', 'StockService', query);
    },
    
    cust: function(query) {
        this.startRout('客户情况列表', 'Cust', query);
    },
    
    perday: function(query) {
        this.startRout('客户每日消耗统计', 'Perday', query);
    },
    
    authUser: function(query) {
        this.startRout('用户管理', 'AuthUser', query);
    },
    
    accountInfo: function(query) {
        this.startRout('基本信息', 'AccountInfo', query);
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
