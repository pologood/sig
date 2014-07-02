package org.sig.core.bo;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

/**
 * @desp     帖子类型
 * @author  dhshuai@gmail.com
 * @version  2013-3-20
 * @since   
 */
public class PostClass  implements  Serializable{
	
	@Getter @Setter private Integer classID;
	
	@Getter @Setter private String className;

}
