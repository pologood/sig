package org.sig.web.Servlet;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.sig.core.bo.User;
import org.sig.core.service.impl.UserManageService;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class LoginServlet extends HttpServlet {
	
	private WebApplicationContext ctx = null;

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException{
		doGet(request, response);
	}
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException{
        
		// 获取请求参数
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        
        // 验证密码是否正常
        UserManageService service = (UserManageService) ctx.getBean("userManageService");
        User user = service.getPassword(email);
        
        if(user.getPassword().equals(password)){
     //        request.getSession().setAttribute("user_in_session", user);
        	 ServletContext sc = getServletContext(); 
             RequestDispatcher rd = sc.getRequestDispatcher("/WEB-INF/jsp/index.jsp");       //定向的页面 
             rd.forward(request, response); 
        } else {
        	response.setContentType("text/html; charset=utf-8"); 
            response.sendRedirect("/sig-web/index.jsp"); 
        }
        

	}
	
	/**
	 * 初始化Spring Context
	 */
	public void init() throws ServletException {
		ctx = WebApplicationContextUtils
				.getRequiredWebApplicationContext(getServletContext());
	}
}
