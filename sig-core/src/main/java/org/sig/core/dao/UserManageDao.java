package org.sig.core.dao;

import org.sig.core.bo.User;

/**
 *  @Copyright :    All right reserved @ Sogou, Inc.
 *  @CreateTime :  2013-3-11  下午8:05:46 
 *  @Author :          Deng Hongshuai
 *  @Description: 
 *
 **/
public interface UserManageDao {
	
	/**
	 * 新增用户
	 * @param user
	 */
	public void addNewUser(User  user);
	
	/**
	 * 获取用户密码
	 * @param email
	 * @return
	 */
	public User getPassword(String email);

}
