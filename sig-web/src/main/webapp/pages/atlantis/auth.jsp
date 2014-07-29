<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="/WEB-INF/auth.tld" prefix="authcheck" %>
<%response.setContentType("application/javascript");%>
Atlantis.TreeNav = {};
Atlantis.TreeNav.Stat = [
    {name: "竞价服务", className: "pay", index: 1, tid: 22, sub: [
        {name: "消耗统计", index: 0, tid: 2200, sub: [
            {<authcheck:auth authid="202000002">name: "消耗总体统计", index: 0, tid: 2210, url: "#stat/consume/overview/"</authcheck:auth>},
            {<authcheck:auth authid="202000006">name: "客户消耗统计", index: 1, tid: 2220, url: "#stat/consume/client/"</authcheck:auth>},
            {<authcheck:auth authid="202000001">name: "实时消耗", index: 2, tid: 2230, url: "#stat/consume/realtime/"</authcheck:auth>}
        ]}
    ]}
];

Atlantis.TopNav = [
    {name: "首页", index: 1, tid: 5000, logid: 100, tree: null, url: "null", target: "_self"},
    {name: "教育", index: 2, tid: 5000, logid: 200, tree: null, url: "null", target: "_self"},
    {name: "生活", index: 3, tid: 6000, logid: 300, tree: null, url: "null", target: "_self"},
    {name: "工作", index: 4, tid: 7000, logid: 400, tree: null, url: "null", target: "_self"},
    {name: "人文", index: 5, tid: 3000, logid: 500, tree: null, url: "null", target: "_self"},
    {name: "世界", index: 6, tid: 3000, logid: 600, tree: null, url: "null", target: "_self"},
    {<authcheck:auth authid="400000001">name: "用户管理", index: 11, tid: 1000, logid: 2000, tree: null, url: "#cust/"</authcheck:auth>},
    {<authcheck:auth authid="400000002">name: "图谱管理", index: 12, tid: 1000, logid: 3000, tree: null, url: "#content/"</authcheck:auth>}
];

Atlantis.Auth = {};
