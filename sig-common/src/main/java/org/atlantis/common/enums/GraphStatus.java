package org.atlantis.common.enums;

import lombok.Getter;
import lombok.Setter;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-10   下午3:54:01
 * @version    
 *
 * @description 
 */
public enum GraphStatus {

	CREATE(1), AUDIT(2), NORMAL(3);
	
	@Getter @Setter private int status;
	
	private GraphStatus(int status) {
		this.status = status;
	}
	
	public GraphStatus findById(int status) {
		switch(status) {
		case 1: 
			return CREATE; 
		case 2:
			return AUDIT; 
		case 3:
			return NORMAL;
		default:
			return null;
		}
	}
}
