package org.sig.core.bo;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

/**
 *  @Copyright :    All right reserved @ Sogou, Inc.
 *  @CreateTime :  2013-3-11  下午8:08:20 
 *  @Author :          Deng Hongshuai
 *  @Description:   用户BO
 *
 **/
public class User implements Serializable {
	
	/**
	 * 用户ID
	 */
	@Getter @Setter private Long userId;
	
	/**
	 * 用户名称
	 */
	@Getter @Setter private String userName;
	
	/**
	 * 用户是否有效
	 */
	@Getter @Setter private boolean enabled = false;
	
	/**
	 * 用户邮箱
	 */
	@Getter @Setter private String email;
	
	/**
	 * 用户密码
	 */
	@Getter @Setter private String password;
	
	/**
	 * 用户创建时间
	 */
	@Getter @Setter private String createTime;

}
