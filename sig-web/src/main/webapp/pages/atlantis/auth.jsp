<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="/WEB-INF/auth.tld" prefix="authcheck" %>
<%response.setContentType("application/javascript");%>
Atlantis.TreeNav = {};
Atlantis.TreeNav.Stat = [
    {<authcheck:auth authid="201000000">name: "任务完成情况", className: "task", index: 0, tid: 21, sub: [
        {<authcheck:auth authid="201000000">name: "任务完成情况", index: 0, tid: 2100, sub: [
            {<authcheck:auth authid="201010000">name: "消耗任务", index: 0, tid: 2110, url: "#stat/task/cost/"</authcheck:auth>},
            {<authcheck:auth authid="201020000">name: "开户任务", index: 1, tid: 2120, url: "#stat/task/new/"</authcheck:auth>},
            {<authcheck:auth authid="201030000">name: "标准账户任务", index: 2, tid: 2130, url: "#stat/task/account/"</authcheck:auth>}
        ]</authcheck:auth>}
    ]</authcheck:auth>},
    {name: "竞价服务", className: "pay", index: 1, tid: 22, sub: [
        {name: "消耗统计", index: 0, tid: 2200, sub: [
            {<authcheck:auth authid="202000002">name: "消耗总体统计", index: 0, tid: 2210, url: "#stat/consume/overview/"</authcheck:auth>},
            {<authcheck:auth authid="202000006">name: "客户消耗统计", index: 1, tid: 2220, url: "#stat/consume/client/"</authcheck:auth>},
            {<authcheck:auth authid="202000001">name: "实时消耗", index: 2, tid: 2230, url: "#stat/consume/realtime/"</authcheck:auth>}
        ]},
        {<authcheck:auth authid="206000000">name: "账户分析", index: 1, tid: 2300, sub: [
            {<authcheck:auth authid="206010000">name: "账户概况", index: 0, tid: 2310, sub: [
                {<authcheck:auth authid="206010001">name: "客服维度", tid: 2311, url: "#stat/account/cs/"</authcheck:auth>},
                {<authcheck:auth authid="206010002">name: "客户维度", tid: 2312, url: "#stat/account/client/"</authcheck:auth>}
            ]</authcheck:auth>}
        ]</authcheck:auth>},
        {name: "增量分析统计", index: 2, tid: 2400, sub: [
            {<authcheck:auth authid="202000008">name: "总体统计", index: 0, tid: 2410, url: "#stat/increment/overview/"</authcheck:auth>},
            {<authcheck:auth authid="203000003">name: "销售员维度统计", index: 1, tid: 2420, url: "#stat/increment/sales/"</authcheck:auth>},
            {<authcheck:auth authid="202000010">name: "客服维度统计", index: 2, tid: 2430, url: "#stat/increment/service/"</authcheck:auth>}
        ]},
        {name: "存量分析统计", index: 3, tid: 2500, sub: [
            {<authcheck:auth authid="202000012">name: "总体统计", index: 0, tid: 2510, url: "#stat/stock/overview/"</authcheck:auth>},
            {<authcheck:auth authid="202000014">name: "客服维度统计", index: 1, tid: 2520, url: "#stat/stock/service/"</authcheck:auth>},
            {name: "历史数据查询", index: 2, tid: 2530, logid:501, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=queryAllReport", target: "_blank"}
        ]}
    ]}
];

Atlantis.TreeNav.Cust = [
    {name: "客户概况", index: 0, tid: 1100, sub: [
        {<authcheck:auth authid="101010000">name: "客户实时消耗", index: 0, tid: 1120, url: "#cust/overview/consume/realtime/"</authcheck:auth>},
        {name: "客户中心", index: 1, tid: 1110, url: "#cust/overview/accountcenter/"},
        {<authcheck:auth authid="101020000">name: "客户组管理", index: 2, tid: 1130, logid:201, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=getAccountGroup", target: "_blank"</authcheck:auth>},
        {<authcheck:auth authid="101030000">name: "老转换客户", index: 3, tid: 1140, logid:202, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=getTransAccountList", target: "_blank"</authcheck:auth>},
        {<authcheck:auth authid="101040000">name: "批量管理客户", index: 4, tid: 1150, logid:203, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=batchManageAccount", target: "_blank"</authcheck:auth>},
        {name: "预算撞线客户列表", index: 5, tid: 1160, logid:204, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=suspendAccount", target: "_blank"}
    ]},
    
    {<authcheck:auth authid="102000000">name: "客户优化", index: 1, tid: 1200, sub: [
        {<authcheck:auth authid="102010100">name: "账户优化", index: 0, tid: 1210, url: "#cust/opt/account/"</authcheck:auth>},
        {<authcheck:auth authid="102010200">name: "账户优化", index: 1, tid: 1210, url: "#cust/opt/account/"</authcheck:auth>}
    ]</authcheck:auth>},
    
    {<authcheck:auth authid="103000000">name: "客户提醒", index: 2, tid: 1300, sub: [
        {<authcheck:auth authid="103010000">name: "影响消耗操作提醒", index: 0, tid: 1310, sub: [
            {<authcheck:auth authid="103010001">name: "客户概况", tid: 1311, url: "#cust/remind/cost/cust/"</authcheck:auth>},
            {<authcheck:auth authid="103010002">name: "操作概况", tid: 1312, url: "#cust/remind/cost/op/"</authcheck:auth>}
        ]</authcheck:auth>}
    ]</authcheck:auth>}
];

Atlantis.TreeNav.Admin = [
    {<authcheck:auth authid="301000000">name: "权限管理", index: 0, tid: 3100, sub: [
        {<authcheck:auth authid="301010000">name: "用户管理", index: 0, tid: 3110, url: "#admin/auth/user/"</authcheck:auth>}
    ]</authcheck:auth>},
    
    {name: "账号管理", index: 1, tid: 3200, sub: [
        {name: "基本信息", index: 0, tid: 3210, url: "#admin/account/info/"}
    ]}
];

Atlantis.TopNav = [
    {name: "管理首页", index: 0, tid: 4000, logid: 100, tree: null, url: "#index/"},
    {name: "客户管理", index: 1, tid: 1000, logid: 200, tree: null, url: "#cust/"},
    {<authcheck:auth authid="400000001">name: "添加新客户", index: 2, tid: 5000, logid: 300, tree: null, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=toAddAccount", target: "_self"</authcheck:auth>},
    {<authcheck:auth authid="400000002">name: "二代管理", index: 3, tid: 6000, logid: 400, tree: null, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=secondAtlantisManage", target: "_self"</authcheck:auth>},
    {name: "统计信息", index: 4, tid: 2000, logid: 500, tree: null, url: "#stat/consume/overview/"},
    {<authcheck:auth authid="400000004">name: "信息查询", index: 5, tid: 7000, logid: 600, tree: null, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=queryPriceByKey", target: "_self"</authcheck:auth>},
    {<authcheck:auth authid="400000003">name: "财务管理", index: 6, tid: 8000, logid: 700, tree: null, url: "../../jump?AtlantisUserId=${sessionScope['user_in_Atlantis_session'].userid}&toInfo=toInvest", target: "_self"</authcheck:auth>},
    {<authcheck:auth authid="300000000">name: "系统管理", index: 7, tid: 3000, logid: 800, tree: Atlantis.TreeNav.Admin</authcheck:auth>}
];

Atlantis.Auth = {};
//index
<authcheck:auth authid="201000000">Atlantis.Auth.ViewIndexTask = 1;</authcheck:auth>
<authcheck:auth authid="201010000">Atlantis.Auth.ViewIndexCostTask = 1;</authcheck:auth>
<authcheck:auth authid="201020000">Atlantis.Auth.ViewIndexNewCustTask = 1;</authcheck:auth>
<authcheck:auth authid="201030000">Atlantis.Auth.ViewIndexAccountTask = 1;</authcheck:auth>
<authcheck:auth authid="206010002">Atlantis.Auth.ViewAccountClient = 1;</authcheck:auth>
//rw authority
<authcheck:auth authid="102010100">Atlantis.Auth.ViewOptDetail = 1;</authcheck:auth>
<authcheck:auth authid="301010200">Atlantis.Auth.ViewAuthConfig = 1;</authcheck:auth>