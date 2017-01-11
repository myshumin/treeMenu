/**
 * 表单动作类
 */

import {throwError} from '../common/common';

export class FormAction {

	// 打印表单验证结果
	printResult(result) {
		if (!(result instanceof Array)) {
			throwError('FormAction.printResult', 'result not array')
		}

		if (!result.length) {
			return;
		}

		for (let i = 0, obj; obj = result[i++];) {
			let verifyItems = obj.verifyItems;

			for (let i = 0, v; v = verifyItems[i++];) {
				// 如果验证没通过
				if (!v.state) {
					alert(v.errorMsg);
					break;
				}
			}
		}
	}

	//初始化select
	selectInit(treeList, elem) {
		let options = '<option value="top">顶级目录</option>';

		// 如果缓存为空或者不是{}
		if (!(treeList instanceof Array)) {
			elem.innerHTML = options;
			return false;
		}

		options += this._recursionTree(treeList);
		elem.innerHTML = options;
	}

	// 递归树结构
	_recursionTree (treeList, spaces = '&nbsp;&nbsp;') {
		let list = '';
		for (let key in treeList) {
			if (treeList.hasOwnProperty(key) && treeList[key].type == 'folder') {
				let subMenu = treeList[key].subMenu;
				list += `<option value="${treeList[key].id}">${spaces}└${treeList[key].name}</option>`;

				// 如果下面还有子菜单
				if(subMenu instanceof Array && subMenu.length) {
					if (subMenu.length) {
						list += this._recursionTree(subMenu, spaces += '&nbsp;&nbsp;');
						spaces = '&nbsp;&nbsp;';
					}
				}
			}

		}

		return list;
	}
}