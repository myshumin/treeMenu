/**
 * tree缓存动作
 */

import {throwError, setCache, getCache} from '../common/common';

export class TreeListAction {

	// 设置缓存
	setCache(treeCacheName, data = {}, fn) {
		let treeList;
		if (!(data instanceof Object)) {
			throwError('TreeListAction.setCache', 'data not Object');
		}

		// 获得本地缓存
		treeList = this.getCache(treeCacheName) || [];

		if (data.type === 'folder') {
			data.subMenu = [];
		}

		// 如果所属目录不是顶级目录则把当前文件添加到所属父目录
		if(data.directory !== 'top') {
			treeList = this._recursionTree(treeList, data, 'set');
		} else {
			treeList.push(data);
		}

		setCache(treeCacheName, JSON.stringify(treeList));
		fn();
	}

	// 获得缓存
	getCache(treeCacheName) {
		let data = getCache(treeCacheName);
		return JSON.parse(data);
	}

	// 删除缓存数据
	delMenu(treeCacheName, treeList, id, fn) {
		if (!(treeList instanceof Array) && !id) {
			return;
		}
		treeList = this._recursionTree(treeList, id, 'del');

		// 更新本地缓存
		setCache(treeCacheName, JSON.stringify(treeList));
		fn(treeList);
	}

	// 递归属性对象
	_recursionTree(treeList, data, type){
		for (let key in treeList) {
			if (treeList.hasOwnProperty(key)) {
				let subMenu = treeList[key].subMenu;
				if(type == 'del') {
					if(data == treeList[key].id) {
						treeList.splice(treeList.length - 1, 1);
						return treeList;
					}
				}
				if(type == 'set') {
					if(data.directory == treeList[key].id) {
						subMenu.push(data);
						return treeList;
					}
				}

				// 如果下面还有子菜单
				if(subMenu instanceof Array && subMenu.length) {
					if (subMenu.length) {
						this._recursionTree(subMenu, data, type);
					}
				}
			}
		}
		return treeList;
	}
}