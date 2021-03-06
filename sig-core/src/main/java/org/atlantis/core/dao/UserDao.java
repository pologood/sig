package org.atlantis.core.dao;

import org.atlantis.common.po.User;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-22   上午10:50:43
 * @version    
 *
 * @description 
 */
public interface UserDao {
	
	public void addUser(User user);
	
	public void delUser(String email);
	
	public void modiUser(User user);
	
	public User findUser(String email);

}
