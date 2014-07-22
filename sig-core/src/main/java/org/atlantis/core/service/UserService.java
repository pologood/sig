package org.atlantis.core.service;

import org.atlantis.common.po.User;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-22   下午3:43:57
 * @version    
 *
 * @description 
 */
public interface UserService {
	
	public void addUser(User user);
	
	public void delUser(String email);
	
	public void modiUser(User user);
	
	public User findUser(String email);

}
