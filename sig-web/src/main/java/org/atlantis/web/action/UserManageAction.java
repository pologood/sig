package org.atlantis.web.action;

import org.atlantis.common.po.User;
import org.atlantis.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *  @Copyright :    All right reserved @ Sogou, Inc.
 *  @CreateTime :  2013-3-11  下午8:02:14 
 *  @Author :          Deng Hongshuai
 *  @Description:   用户管理Action
 *
 **/
@Component("UserManageAction")
public class UserManageAction {
	
	@Autowired
	private UserService userService;

	public void addUser(User user){
		
	}
	
	public void delUser(String email){
		
	}
	
	public void modiUser(User user){
		
	}
	
	public User findUser(String email){
		return userService.findUser(email);
	}
}
