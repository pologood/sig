package org.atlantis.core.service.impl;

import org.atlantis.common.po.User;
import org.atlantis.core.dao.UserDao;
import org.atlantis.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-22   下午3:44:23
 * @version    
 *
 * @description 
 */
@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserDao userDao;

	@Override
	public void addUser(User user) {
		userDao.addUser(user);
	}

	@Override
	public void delUser(String email) {
		userDao.delUser(email);
	}

	@Override
	public void modiUser(User user) {
		userDao.modiUser(user);
	}

	@Override
	public User findUser(String email) {
		return userDao.findUser(email);
	}

}
