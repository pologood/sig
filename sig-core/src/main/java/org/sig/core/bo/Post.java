package org.sig.core.bo;

import java.io.Serializable;
import java.util.Date;

import org.sig.common.Const;

import lombok.Getter;
import lombok.Setter;

/**
 *  @Copyright :    All right reserved @ Sogou, Inc.
 *  @CreateTime :  2013-3-13  下午3:40:14 
 *  @Author :          Deng Hongshuai
 *  @Description:   Post BO ev4Ey7tf3ZX9
 *
 **/
public class Post implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 13758923752973298L;
	
	/**
	 * Post id
	 */
	@Getter @Setter private long postId; 
	
	/**
	 * Post  title
	 */
	@Getter @Setter private String title;
	
	/**
	 * 帖子类型: 论坛娱乐  学习  购物  美食  旅行
	 */
	@Getter @Setter private int postClass;
	
	/**
	 * Type of the post
	 */
	@Getter @Setter private int type = Const.SRC_POST; // 1. 索引贴  2.转帖  3. 原创
	
	/**
	 * Creator of the post
	 */
	@Getter @Setter private long userId = 1L;
	
	/**
	 * Cteate time of the post
	 */
    @Getter @Setter private String createTime;
   
	/**
	 * Lime of last modification
	 */
	@Getter @Setter private String lastModifyTime;
	
	@Getter @Setter private long click; // 注册用户点击数
	
	@Getter @Setter private long exhibit;
	
	@Getter @Setter private long replayNum;
	
	@Getter @Setter private long approvalNum;
	
	@Getter @Setter private long defeatNum;
	
	@Getter @Setter private String brief; // 帖子概括
	

	
	@Getter @Setter private Integer srcWebsiteId;

	
	@Getter @Setter private String srcAuthor;
	
	@Getter @Setter private String srcCreateTime;
	
	@Getter @Setter private long srcClick;
	
	@Getter @Setter private long srcReplay;

}
