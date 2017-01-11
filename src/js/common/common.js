/**
 * 元素选择器
 * @param elem    元素名
 * @return {NodeList|*}
 */
export function $(elem) {
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
export function addClass(elem, className) {
	if (!elem && !className) {
		throwError('common.addEvent', 'elem or className is undefined');
	}

	// 如果只有一个元素
	if (![...elem].length) {
		elem.className += ' ' + className;
		return;
	}
	for (let i = 0, el; el = elem[i++];) {
		el.className += ' ' + className;
	}
}

/**
 * 删除元素的某个class(支持多个元素)
 * @param elem    元素名
 * @param className    要添加的className
 * @return {*}
 */
export function removeClass(elem, className) {
	if (!elem && !className) {
		throwError('common.removeClass', 'elem or className is undefined');
	}

	// 如果只有一个元素
	if (![...elem].length) {
		let classList = elem.className.split(' ');
		for (let i = 0, v; v = classList[i++];) {

			if (v == className) {
				classList.splice(i - 1, 1);
				elem.className = classList.join(' ');
				break;
			}
		}
		return;
	}
	for (let i = 0, el; el = elem[i++];) {
		let classList = el.className.split(' ');

		for (let i = 0, v; v = classList[i++];) {
			if (v == className) {
				classList.splice(i - 1, 1);
				break;
			}
		}
		el.className = classList.join(' ');
	}
}

/**
 * 判断某个元素是否存在某个className
 * @param elem    元素名
 * @param className
 */
export function isClassName(elem, className) {
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
export function throwError(func, message) {
	throw new Error('出错位置：' + func + ' \n' + '出错信息：' + message);
}

/**
 * 事件绑定 (支持批量绑定多个元素)
 * @param elem    元素名
 * @param event    绑定事件名称
 * @param fn    回调函数
 */
export function addEvent(elem, event, fn) {
	if (!elem && !event) {
		throwError('common.addEvent', 'elem or event is undefined');
	}

	// 如果只有一个元素
	if (![...elem].length) {
		elem.addEventListener(event, fn, false);
		return;
	}
	for (let i = 0, el; el = elem[i++];) {
		el.addEventListener(event, fn, false);
	}
}

/**
 * 写入本地缓存
 * @param name    缓存key
 * @param value    缓存内容
 */
export function setCache(name, value) {
	localStorage.setItem(name, value);
}

/**
 * 读取本地缓存
 * @param name    缓存key
 */
export function getCache(name) {
	return localStorage.getItem(name);
}

/**
 * 获得radio选中的值
 * @param    {Object}    radios
 */
export function getRadioSelect(radios) {
	radios = [...radios];

	if (!(radios instanceof Array)) {
		throwError('common.getRadioSelect', 'radios not Array');
	}
	for (let i = 0, v; v = radios[i++];) {
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
export function getTime(date) {
	date = date || new Date();
	return date.getTime();
}