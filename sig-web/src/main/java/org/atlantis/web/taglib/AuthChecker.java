package org.atlantis.web.taglib;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;


public class AuthChecker extends TagSupport {
	private static final long serialVersionUID = 339306968881056890L;

	private String authid;

	public AuthChecker() {
	}

	public int doStartTag() throws JspException {
		if (condition()) {
			return (EVAL_BODY_INCLUDE);
		} else {
			return (SKIP_BODY);
		}

	}

	/**
	 * condition
	 * 
	 * @return boolean
	 */
	private boolean condition() {
		
//		boolean ifAuthCheck = false;
//		User user = (User) pageContext.getSession().getAttribute(WebUtil.USER_IN_SESSION);
//		if(authid.indexOf("||") != -1) {
//			for(String id:StringUtils.split(authid, "||")) {
//				if(user.validateAuth(id.trim())) {
//					ifAuthCheck = true;
//					break;
//				}
//			}
//		}else {
//			ifAuthCheck = user.validateAuth(authid);
//		}
		return true;
	}

	public int doEndTag() throws JspException {
		return (EVAL_PAGE);
	}

	public String getAuthid() {
		return authid;
	}

	public void setAuthid(String authid) {
		this.authid = authid;
	}

}
