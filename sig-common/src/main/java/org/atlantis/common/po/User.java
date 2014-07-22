package org.atlantis.common.po;

import lombok.Getter;
import lombok.Setter;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-22   上午10:48:21
 * @version    
 *
 * @description 
 */
public class User {
	
	@Getter @Setter private String name;
	
	@Getter @Setter private int age;
	
	@Getter @Setter private String email;
	
	@Getter @Setter private String pwd;
	
	@Getter @Setter private int level;

}
