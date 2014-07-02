package org.sig.common;

import lombok.Getter;
import lombok.Setter;

/**
 * Dwr统一返回结果
 * @author Administrator
 *
 */
public class DwrResult {
	
	/**
	 * 操作是否成功
	 */
	@Getter @Setter private boolean success;
	
	/**
	 * 消息提示
	 */
	@Getter @Setter private String message;
	
	
	/**
	 * 执行返回的结果数据
	 */
	@Getter @Setter Object data;
	

}
