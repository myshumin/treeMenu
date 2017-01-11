/**
 * 菜单动作类
 */

import {message} from '../config/lang_zh';

export class MenuAction {

	// 渲染菜单DOM树
	menuRender(treeList, fn) {
		if (!(treeList instanceof Array)) {
			return;
		}

		// 解析树形对象
		let list = this._recursionTree(treeList);

		fn(list);
	}

	// 递归树结构
	_recursionTree (treeList) {
		let list = '';
		for (let key in treeList) {
			if (treeList.hasOwnProperty(key)) {
				let subMenu = treeList[key].subMenu;
				list += `<li class="${treeList[key].type}" data-id='${treeList[key].id}'><span title="${message.msg.delMenuTitle}">${treeList[key].name}</span>`;

				// 如果下面还有子菜单
				if(subMenu instanceof Array && subMenu.length) {
					if (subMenu.length) {
						list += this._recursionTree(subMenu);
					}
				}
				list += `</li>`
			}
		}

		return `<ul>${list}</ul>`;
	}
}