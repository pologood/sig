package org.atlantis.web.Servlet;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.sig.core.bo.User;
import org.sig.core.service.impl.UserManageService;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class RegisterServlet extends HttpServlet {
	
	private WebApplicationContext ctx = null;
	
	private SimpleDateFormat  format = new SimpleDateFormat ("yyyy-MM-dd hh:mm:ss");
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException{
		doGet(request, response);
	}
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException{
		
		String userName = request.getParameter("userName");
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		
		User user = new User();
		user.setEmail(email);
		user.setPassword(password);
		user.setUserName(userName);
		user.setCreateTime(format.format(new Date()));
		
		UserManageService service = (UserManageService) ctx.getBean("userManageService");
		service.addNewUser(user);
		
		response.setContentType("text/html; charset=utf-8"); 
        response.sendRedirect("/sig-web/index.jsp"); 
	}
	
	/**
	 * 初始化Spring Context
	 */
	public void init() throws ServletException {
		ctx = WebApplicationContextUtils
				.getRequiredWebApplicationContext(getServletContext());
	}


}
