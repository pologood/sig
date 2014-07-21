package org.atlantis.web.Servlet;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
        
	}
	
	/**
	 * 初始化Spring Context
	 */
	public void init() throws ServletException {
		ctx = WebApplicationContextUtils
				.getRequiredWebApplicationContext(getServletContext());
	}
}
