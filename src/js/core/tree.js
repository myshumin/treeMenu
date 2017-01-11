/**
 * tree核心封装
 */

import {
	addEvent,
	getRadioSelect,
	$,
	addClass,
	isClassName,
	removeClass,
	getTime
} from '../common/common';
import {validator} from '../common/validator';
import {publishAndSubscribe} from '../common/publishAndSubscribe';
import {message} from '../config/lang_zh';
import {FormAction} from '../actions/formAction';
import {MenuAction} from '../actions/menuAction';
import {TreeListAction} from '../actions/treeListAction';

export class Tree {

	constructor() {
		this.FORM = $('#form'); // 表单
		this.FORM_TYPE = $('input[name=type]'); // 添加的文件类型
		this.FORM_RADIO = $('.radio'); // 文件类型单选按钮的容器
		this.FORM_DIRECTORY = $('#directory'); // 所属目录
		this.FORM_NAME = $('#name'); // 文件或文件夹名
		this.FORM_MENU = $('#tree_menu'); // 菜单容器
		this.treeCacheName = 'treeList'; // tree缓存名称
		this.treeListAction = new TreeListAction(); // 构造tree缓存动作类
		this.formAction = new FormAction(); // 构造表单动作类
		this.menuAction = new MenuAction(); // 构造菜单动作类
		this.treeList = this.treeListAction.getCache(this.treeCacheName); // 本地缓存列表
	}

	init() {
		// 初始化表单
		this._formInit();

		// 发布事件初始化
		this._publish();

		// 菜单初始化
		this.menuInit();
	}

	// 表单初始化
	_formInit() {

		// 所属目录select初始化
		this.formAction.selectInit(this.treeList, this.FORM_DIRECTORY[0]);

		// 设置validator类验证
		validator.config = [{
			verifyName: 'name',
			verifyItems: [{
				type: 'isEmpty',
				message: message.error.emptyName
			}]
		}];

		// 为表单绑定submit事件
		addEvent(this.FORM, 'submit', (event) => {
			let name = this.FORM_NAME[0].value,
					type = getRadioSelect(this.FORM_TYPE),
					directory = this.FORM_DIRECTORY[0].value,
					treeList = this.treeList;

			// 阻止表单提交
			event.preventDefault();

			// 设置validator类验证的传递参数
			// 验证名称是否为空
			validator.config[0].verifyItems[0].args = {
				value: name,
			};

			validator.validate(); // 开始验证
			let result = validator.result; // 获得验证结果

			// 打印验证结果
			this.formAction.printResult(result);

			// 如果通过验证
			if (validator.status) {

				let obj = {
					name: name,
					type: type,
					id: getTime(),
					directory: directory
				};

				// 写入缓存
				this.treeListAction.setCache(this.treeCacheName, obj, () => {

					// success提示
					alert(message.success.addSuccess);

					// 更新缓存
					this.treeList = this.treeListAction.getCache(this.treeCacheName);

					// 发布this.treeCacheName缓存更新事件
					publishAndSubscribe.trigger(this.treeCacheName, this.treeList);
				})
			}
		});

		// 为radio绑定点击事件
		addEvent(this.FORM_TYPE, 'click', (event) => {
			let target = event.target, parent;

			// 获得父元素
			parent = target.parentNode;

			// 如果父元素没有on这个className
			if (!isClassName(parent, 'on')) {

				// 先删除所有元素的on
				removeClass(this.FORM_RADIO, 'on');

				// 为当前点击的元素的父元素添加on
				addClass(parent, 'on');
			}
		})
	}

	menuInit() {
		// 菜单DOM树渲染
		this.menuAction.menuRender(this.treeList, (list) => this.FORM_MENU[0].innerHTML = list);

		// 绑定删除菜单事件
		addEvent(this.FORM_MENU[0], 'click', (event) => {
			let target = event.target.parentNode;

			if(target && target.nodeName == 'LI') {

				// 删除缓存里的菜单
				this.treeListAction.delMenu(this.treeCacheName, this.treeList, target.dataset.id, (treeList) => {

					// success提示
					alert(message.success.delSuccess);

					// 更新缓存
					this.treeList = treeList;

					// 发布this.treeCacheName缓存更新事件
					publishAndSubscribe.trigger(this.treeCacheName, this.treeList);
				});
			}
		})
	}

	// 订阅事件
	_publish() {

		// 事件1： this.treeCacheName发生变化时更新select和menu
		publishAndSubscribe.listen(this.treeCacheName, (key, content) => {
			this.formAction.selectInit(content, this.FORM_DIRECTORY[0]);
			this.menuAction.menuRender(content, (list) => this.FORM_MENU[0].innerHTML = list);
		});
	}
}