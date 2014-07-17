package org.sig.core.service.impl;

import org.sig.core.bo.User;
import org.sig.core.dao.UserManageDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *  @Copyright :    All right reserved @ Sogou, Inc.
 *  @CreateTime :  2013-3-11  下午8:03:08 
 *  @Author :          Deng Hongshuai
 *  @Description:  用户管理Service
 *
 **/
@Service
public class UserManageService {
	
	@Autowired
	UserManageDao userManageDao;
	
	/**
	 * 添加新用户
	 * @param user
	 */
	public void addNewUser(User user){
		userManageDao.addNewUser(user);
	}
	
	public User getPassword(String email){
		return  userManageDao.getPassword(email);
	}

}
