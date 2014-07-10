package org.atlantis.common.po;

import java.util.List;

import org.atlantis.common.enums.GraphStatus;

import lombok.Getter;
import lombok.Setter;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-10   下午3:50:53
 * @version    
 *
 * @description 
 */
public class Graph {
	
	 // basic informations
	@Getter @Setter private String title;
	
	@Getter @Setter private long itemId;
	
	@Getter @Setter private long creatorId;
	
	@Getter @Setter private long createTime;
	
	@Getter @Setter private long lastUpdateTime;
	
	@Getter @Setter private GraphStatus status;

	@Getter @Setter private int industryId;
	
	@Getter @Setter private int categoryId;
	
	
	// conception attributes
	@Getter @Setter private List<ItemAttribute> conception;

	// deep understanding
	@Getter @Setter private List<ItemAttribute> deepGraph;
	
    // acquisition methods
	@Getter @Setter private List<ItemAttribute> obtainMethods;
	
	// top problems
	@Getter @Setter private List<ItemAttribute> problems;
	
}
