package org.atlantis.common.enums;

import lombok.Getter;
import lombok.Setter;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-25   下午3:25:13
 * @version    
 *
 * @description 
 */
public enum Domain {
	
	EDUCATION(1), LIFE(2), WORK(3), SPIRIT(4), WORLD(5);
	
	private int i;
	
	private Domain(int i) {
		this.i = i;
	}
	
	public Domain findById(int status) {
		switch(status) {
		case 1: 
			return EDUCATION; 
		case 2:
			return LIFE; 
		case 3:
			return WORK;
		case 4:
			return SPIRIT;
		case 5:
			return WORLD;
		default:
			return null;
		}
	}
}
