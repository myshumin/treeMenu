/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _tree = __webpack_require__(1);

	// 初始化表单
	new _tree.Tree().init(); /**
	                          * 树形菜单操作实例
	                          * @author Mr.sum <shumin.1989@qq.com>
	                          */

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Tree = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * tree核心封装
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _common = __webpack_require__(2);

	var _validator = __webpack_require__(3);

	var _publishAndSubscribe = __webpack_require__(4);

	var _lang_zh = __webpack_require__(5);

	var _formAction = __webpack_require__(6);

	var _menuAction = __webpack_require__(7);

	var _treeListAction = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tree = exports.Tree = function () {
		function Tree() {
			_classCallCheck(this, Tree);

			this.FORM = (0, _common.$)('#form'); // 表单
			this.FORM_TYPE = (0, _common.$)('input[name=type]'); // 添加的文件类型
			this.FORM_RADIO = (0, _common.$)('.radio'); // 文件类型单选按钮的容器
			this.FORM_DIRECTORY = (0, _common.$)('#directory'); // 所属目录
			this.FORM_NAME = (0, _common.$)('#name'); // 文件或文件夹名
			this.FORM_MENU = (0, _common.$)('#tree_menu'); // 菜单容器
			this.treeCacheName = 'treeList'; // tree缓存名称
			this.treeListAction = new _treeListAction.TreeListAction(); // 构造tree缓存动作类
			this.formAction = new _formAction.FormAction(); // 构造表单动作类
			this.menuAction = new _menuAction.MenuAction(); // 构造菜单动作类
			this.treeList = this.treeListAction.getCache(this.treeCacheName); // 本地缓存列表
		}

		_createClass(Tree, [{
			key: 'init',
			value: function init() {
				// 初始化表单
				this._formInit();

				// 发布事件初始化
				this._publish();

				// 菜单初始化
				this.menuInit();
			}

			// 表单初始化

		}, {
			key: '_formInit',
			value: function _formInit() {
				var _this = this;

				// 所属目录select初始化
				this.formAction.selectInit(this.treeList, this.FORM_DIRECTORY[0]);

				// 设置validator类验证
				_validator.validator.config = [{
					verifyName: 'name',
					verifyItems: [{
						type: 'isEmpty',
						message: _lang_zh.message.error.emptyName
					}]
				}];

				// 为表单绑定submit事件
				(0, _common.addEvent)(this.FORM, 'submit', function (event) {
					var name = _this.FORM_NAME[0].value,
					    type = (0, _common.getRadioSelect)(_this.FORM_TYPE),
					    directory = _this.FORM_DIRECTORY[0].value,
					    treeList = _this.treeList;

					// 阻止表单提交
					event.preventDefault();

					// 设置validator类验证的传递参数
					// 验证名称是否为空
					_validator.validator.config[0].verifyItems[0].args = {
						value: name
					};

					_validator.validator.validate(); // 开始验证
					var result = _validator.validator.result; // 获得验证结果

					// 打印验证结果
					_this.formAction.printResult(result);

					// 如果通过验证
					if (_validator.validator.status) {

						var obj = {
							name: name,
							type: type,
							id: (0, _common.getTime)(),
							directory: directory
						};

						// 写入缓存
						_this.treeListAction.setCache(_this.treeCacheName, obj, function () {

							// success提示
							alert(_lang_zh.message.success.addSuccess);

							// 更新缓存
							_this.treeList = _this.treeListAction.getCache(_this.treeCacheName);

							// 发布this.treeCacheName缓存更新事件
							_publishAndSubscribe.publishAndSubscribe.trigger(_this.treeCacheName, _this.treeList);
						});
					}
				});

				// 为radio绑定点击事件
				(0, _common.addEvent)(this.FORM_TYPE, 'click', function (event) {
					var target = event.target,
					    parent = void 0;

					// 获得父元素
					parent = target.parentNode;

					// 如果父元素没有on这个className
					if (!(0, _common.isClassName)(parent, 'on')) {

						// 先删除所有元素的on
						(0, _common.removeClass)(_this.FORM_RADIO, 'on');

						// 为当前点击的元素的父元素添加on
						(0, _common.addClass)(parent, 'on');
					}
				});
			}
		}, {
			key: 'menuInit',
			value: function menuInit() {
				var _this2 = this;

				// 菜单DOM树渲染
				this.menuAction.menuRender(this.treeList, function (list) {
					return _this2.FORM_MENU[0].innerHTML = list;
				});

				// 绑定删除菜单事件
				(0, _common.addEvent)(this.FORM_MENU[0], 'click', function (event) {
					var target = event.target.parentNode;

					if (target && target.nodeName == 'LI') {

						// 删除缓存里的菜单
						_this2.treeListAction.delMenu(_this2.treeCacheName, _this2.treeList, target.dataset.id, function (treeList) {

							// success提示
							alert(_lang_zh.message.success.delSuccess);

							// 更新缓存
							_this2.treeList = treeList;

							// 发布this.treeCacheName缓存更新事件
							_publishAndSubscribe.publishAndSubscribe.trigger(_this2.treeCacheName, _this2.treeList);
						});
					}
				});
			}

			// 订阅事件

		}, {
			key: '_publish',
			value: function _publish() {
				var _this3 = this;

				// 事件1： this.treeCacheName发生变化时更新select和menu
				_publishAndSubscribe.publishAndSubscribe.listen(this.treeCacheName, function (key, content) {
					_this3.formAction.selectInit(content, _this3.FORM_DIRECTORY[0]);
					_this3.menuAction.menuRender(content, function (list) {
						return _this3.FORM_MENU[0].innerHTML = list;
					});
				});
			}
		}]);

		return Tree;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.$ = $;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.isClassName = isClassName;
	exports.throwError = throwError;
	exports.addEvent = addEvent;
	exports.setCache = setCache;
	exports.getCache = getCache;
	exports.getRadioSelect = getRadioSelect;
	exports.getTime = getTime;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * 元素选择器
	 * @param elem    元素名
	 * @return {NodeList|*}
	 */
	function $(elem) {
		if (!elem) {
			throwError('common.$', 'elem is undefined');
		}
		return document.querySelectorAll(elem);
	}

	/**
	 * 添加class到元素(支持多个元素)
	 * @param elem    元素名
	 * @param className    要添加的className
	 * @return {*}
	 */
	function addClass(elem, className) {
		if (!elem && !className) {
			throwError('common.addEvent', 'elem or className is undefined');
		}

		// 如果只有一个元素
		if (![].concat(_toConsumableArray(elem)).length) {
			elem.className += ' ' + className;
			return;
		}
		for (var i = 0, el; el = elem[i++];) {
			el.className += ' ' + className;
		}
	}

	/**
	 * 删除元素的某个class(支持多个元素)
	 * @param elem    元素名
	 * @param className    要添加的className
	 * @return {*}
	 */
	function removeClass(elem, className) {
		if (!elem && !className) {
			throwError('common.removeClass', 'elem or className is undefined');
		}

		// 如果只有一个元素
		if (![].concat(_toConsumableArray(elem)).length) {
			var classList = elem.className.split(' ');
			for (var i = 0, v; v = classList[i++];) {

				if (v == className) {
					classList.splice(i - 1, 1);
					elem.className = classList.join(' ');
					break;
				}
			}
			return;
		}
		for (var _i = 0, el; el = elem[_i++];) {
			var _classList = el.className.split(' ');

			for (var _i2 = 0, _v; _v = _classList[_i2++];) {
				if (_v == className) {
					_classList.splice(_i2 - 1, 1);
					break;
				}
			}
			el.className = _classList.join(' ');
		}
	}

	/**
	 * 判断某个元素是否存在某个className
	 * @param elem    元素名
	 * @param className
	 */
	function isClassName(elem, className) {
		if (!elem && !className) {
			throwError('common.isClassName', 'elem or className is undefined');
		}
		return elem.className.split(' ').indexOf(className) !== -1;
	}
	/**
	 * 抛出错误
	 * @param    {string}    func    出错的函数名
	 * @param    {string}    message    出错信息
	 */
	function throwError(func, message) {
		throw new Error('出错位置：' + func + ' \n' + '出错信息：' + message);
	}

	/**
	 * 事件绑定 (支持批量绑定多个元素)
	 * @param elem    元素名
	 * @param event    绑定事件名称
	 * @param fn    回调函数
	 */
	function addEvent(elem, event, fn) {
		if (!elem && !event) {
			throwError('common.addEvent', 'elem or event is undefined');
		}

		// 如果只有一个元素
		if (![].concat(_toConsumableArray(elem)).length) {
			elem.addEventListener(event, fn, false);
			return;
		}
		for (var i = 0, el; el = elem[i++];) {
			el.addEventListener(event, fn, false);
		}
	}

	/**
	 * 写入本地缓存
	 * @param name    缓存key
	 * @param value    缓存内容
	 */
	function setCache(name, value) {
		localStorage.setItem(name, value);
	}

	/**
	 * 读取本地缓存
	 * @param name    缓存key
	 */
	function getCache(name) {
		return localStorage.getItem(name);
	}

	/**
	 * 获得radio选中的值
	 * @param    {Object}    radios
	 */
	function getRadioSelect(radios) {
		radios = [].concat(_toConsumableArray(radios));

		if (!(radios instanceof Array)) {
			throwError('common.getRadioSelect', 'radios not Array');
		}
		for (var i = 0, v; v = radios[i++];) {
			if (v.checked) {
				return v.value;
			}
		}

		return false;
	}

	/**
	 * 获得时间戳
	 * @param date
	 * @return {number}
	 */
	function getTime(date) {
		date = date || new Date();
		return date.getTime();
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.validator = undefined;

	var _common = __webpack_require__(2);

	var validator = exports.validator = {

		// 验证规则处理类
		types: {

			// 判断是否为空
			isEmpty: function isEmpty(args, message) {
				var state = true,
				    errorMsg = '';
				if (args.value === '') {
					state = false;
					errorMsg = message;
				}

				return {
					state: state,
					errorMsg: errorMsg
				};
			}
		},

		// 返回结果
		result: [],

		// 验证配置
		config: {},

		status: true,

		// 暴露公开的验证方法
		validate: function validate() {
			var i = void 0,
			    type = void 0,
			    verifyItems = void 0,
			    checker = void 0,
			    data = this.config;

			// 清空返回结果
			this.result = [];

			// 清空status
			this.status = true;

			for (i in data) {

				// 判断属性不是继承自原型链
				if (data.hasOwnProperty(i)) {
					var result_ok = {};
					result_ok.verifyName = data[i].verifyName;
					result_ok.verifyItems = [];
					verifyItems = data[i].verifyItems;

					for (var _i = 0, k; k = verifyItems[_i++];) {
						var result = void 0;

						// 查询配置的验证规则类
						type = k.type;

						// 如果验证规则不存在就跳过当前去处理下一条
						if (!type) {
							continue;
						}

						// 查询验证规则类
						checker = this.types[type];

						// 如果验证规则的处理类不存在就抛出异常
						if (!checker) {
							(0, _common.throwError)('validator.validate.checker', 'checker is undefined');
						}

						// 使用查询到的验证类进行验证
						result = checker(k.args, k.message);

						// 如果没通过
						if (!result.state) {
							this.status = false;
						}

						// 保存查询结果
						Array.prototype.push.call(result_ok.verifyItems, result);
					}

					this.result.push(result_ok);
				}
			}
		}
	}; /**
	    *  表单验证方法集合
	    */

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * 发布订阅方法集合
	 */
	var publishAndSubscribe = exports.publishAndSubscribe = {

		// 储存订阅消息的对象数组
		clientList: [],

		/**
	  * 订阅消息
	  * @param   {string}    key     订阅的内容名称
	  * @param   {Function}  fn      发布消息时通知的回调函数
	  */
		listen: function listen(key, fn) {

			// 如果这个对象没有订阅消息
			if (!this.clientList[key]) {

				// 为即将要订阅的对象设置一个数组，储存要订阅的内容
				this.clientList[key] = [];
			}

			// 将发布内容时要通知当前对象的回调函数储存到clientList
			this.clientList[key].push(fn);
		},

		/**
	  * 发布消息
	  * @param   {string}    key     订阅的内容名称
	  * @param   {string}    content 发布的消息内容
	  */
		trigger: function trigger(key, content) {
			var fns = this.clientList[key];

			// 如果没有任何人订阅当前内容名称的消息
			if (!fns) {
				return false;
			}

			// 将当前消息发布到所有订阅的用户那里
			for (var i = 0, fn; fn = fns[i++];) {
				fn.call(this, key, content);
			}
		},

		remove: function remove(key, fn) {
			var fns = this.clientList[key];

			// 如果这条消息没有被人订阅
			if (!fns) {
				return false;
			}

			// 如果没有传入具体的回调函数，那么意味着是要将key内所有订阅者取消
			if (!fn) {
				fns && (fns.length = 0);
			} else {
				for (var i = fns.length - 1; i >= 0; i--) {
					var _fn = fns[i];
					if (_fn === fn) {
						fns.splice(i, 1);
					}
				}
			}
		}
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * 提示信息
	 */
	var message = exports.message = {
		error: {
			emptyName: '请填写名称!',
			repeatName: '不能在同一个目录创建同类型的重名文件!'
		},
		success: {
			addSuccess: '添加成功!',
			delSuccess: '删除成功!'
		},
		msg: {
			delMenuTitle: '点击删除菜单'
		}
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.FormAction = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 表单动作类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _common = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FormAction = exports.FormAction = function () {
		function FormAction() {
			_classCallCheck(this, FormAction);
		}

		_createClass(FormAction, [{
			key: 'printResult',


			// 打印表单验证结果
			value: function printResult(result) {
				if (!(result instanceof Array)) {
					(0, _common.throwError)('FormAction.printResult', 'result not array');
				}

				if (!result.length) {
					return;
				}

				for (var i = 0, obj; obj = result[i++];) {
					var verifyItems = obj.verifyItems;

					for (var _i = 0, v; v = verifyItems[_i++];) {
						// 如果验证没通过
						if (!v.state) {
							alert(v.errorMsg);
							break;
						}
					}
				}
			}

			//初始化select

		}, {
			key: 'selectInit',
			value: function selectInit(treeList, elem) {
				var options = '<option value="top">顶级目录</option>';

				// 如果缓存为空或者不是{}
				if (!(treeList instanceof Array)) {
					elem.innerHTML = options;
					return false;
				}

				options += this._recursionTree(treeList);
				elem.innerHTML = options;
			}

			// 递归树结构

		}, {
			key: '_recursionTree',
			value: function _recursionTree(treeList) {
				var spaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '&nbsp;&nbsp;';

				var list = '';
				for (var key in treeList) {
					if (treeList.hasOwnProperty(key) && treeList[key].type == 'folder') {
						var subMenu = treeList[key].subMenu;
						list += '<option value="' + treeList[key].id + '">' + spaces + '\u2514' + treeList[key].name + '</option>';

						// 如果下面还有子菜单
						if (subMenu instanceof Array && subMenu.length) {
							if (subMenu.length) {
								list += this._recursionTree(subMenu, spaces += '&nbsp;&nbsp;');
								spaces = '&nbsp;&nbsp;';
							}
						}
					}
				}

				return list;
			}
		}]);

		return FormAction;
	}();

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MenuAction = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 菜单动作类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _lang_zh = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MenuAction = exports.MenuAction = function () {
		function MenuAction() {
			_classCallCheck(this, MenuAction);
		}

		_createClass(MenuAction, [{
			key: 'menuRender',


			// 渲染菜单DOM树
			value: function menuRender(treeList, fn) {
				if (!(treeList instanceof Array)) {
					return;
				}

				// 解析树形对象
				var list = this._recursionTree(treeList);

				fn(list);
			}

			// 递归树结构

		}, {
			key: '_recursionTree',
			value: function _recursionTree(treeList) {
				var list = '';
				for (var key in treeList) {
					if (treeList.hasOwnProperty(key)) {
						var subMenu = treeList[key].subMenu;
						list += '<li class="' + treeList[key].type + '" data-id=\'' + treeList[key].id + '\'><span title="' + _lang_zh.message.msg.delMenuTitle + '">' + treeList[key].name + '</span>';

						// 如果下面还有子菜单
						if (subMenu instanceof Array && subMenu.length) {
							if (subMenu.length) {
								list += this._recursionTree(subMenu);
							}
						}
						list += '</li>';
					}
				}

				return '<ul>' + list + '</ul>';
			}
		}]);

		return MenuAction;
	}();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TreeListAction = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * tree缓存动作
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _common = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TreeListAction = exports.TreeListAction = function () {
		function TreeListAction() {
			_classCallCheck(this, TreeListAction);
		}

		_createClass(TreeListAction, [{
			key: 'setCache',


			// 设置缓存
			value: function setCache(treeCacheName) {
				var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				var fn = arguments[2];

				var treeList = void 0;
				if (!(data instanceof Object)) {
					(0, _common.throwError)('TreeListAction.setCache', 'data not Object');
				}

				// 获得本地缓存
				treeList = this.getCache(treeCacheName) || [];

				if (data.type === 'folder') {
					data.subMenu = [];
				}

				// 如果所属目录不是顶级目录则把当前文件添加到所属父目录
				if (data.directory !== 'top') {
					treeList = this._recursionTree(treeList, data, 'set');
				} else {
					treeList.push(data);
				}

				(0, _common.setCache)(treeCacheName, JSON.stringify(treeList));
				fn();
			}

			// 获得缓存

		}, {
			key: 'getCache',
			value: function getCache(treeCacheName) {
				var data = (0, _common.getCache)(treeCacheName);
				return JSON.parse(data);
			}

			// 删除缓存数据

		}, {
			key: 'delMenu',
			value: function delMenu(treeCacheName, treeList, id, fn) {
				if (!(treeList instanceof Array) && !id) {
					return;
				}
				treeList = this._recursionTree(treeList, id, 'del');

				// 更新本地缓存
				(0, _common.setCache)(treeCacheName, JSON.stringify(treeList));
				fn(treeList);
			}

			// 递归属性对象

		}, {
			key: '_recursionTree',
			value: function _recursionTree(treeList, data, type) {
				for (var key in treeList) {
					if (treeList.hasOwnProperty(key)) {
						var subMenu = treeList[key].subMenu;
						if (type == 'del') {
							if (data == treeList[key].id) {
								treeList.splice(treeList.length - 1, 1);
								return treeList;
							}
						}
						if (type == 'set') {
							if (data.directory == treeList[key].id) {
								subMenu.push(data);
								return treeList;
							}
						}

						// 如果下面还有子菜单
						if (subMenu instanceof Array && subMenu.length) {
							if (subMenu.length) {
								this._recursionTree(subMenu, data, type);
							}
						}
					}
				}
				return treeList;
			}
		}]);

		return TreeListAction;
	}();

/***/ }
/******/ ]);