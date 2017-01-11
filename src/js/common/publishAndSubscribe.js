/**
 * 发布订阅方法集合
 */
export const publishAndSubscribe = {

	// 储存订阅消息的对象数组
	clientList: [],

	/**
	 * 订阅消息
	 * @param   {string}    key     订阅的内容名称
	 * @param   {Function}  fn      发布消息时通知的回调函数
	 */
	listen: function (key, fn) {

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
	trigger: function (key, content) {
		let fns = this.clientList[key];

		// 如果没有任何人订阅当前内容名称的消息
		if (!fns) {
			return false;
		}

		// 将当前消息发布到所有订阅的用户那里
		for (let i = 0, fn; fn = fns[i++];) {
			fn.call(this, key, content);
		}
	},

	remove: function (key, fn) {
		let fns = this.clientList[key];

		// 如果这条消息没有被人订阅
		if (!fns) {
			return false;
		}

		// 如果没有传入具体的回调函数，那么意味着是要将key内所有订阅者取消
		if (!fn) {
			fns && (fns.length = 0);
		} else {
			for (let i = fns.length - 1; i >= 0; i--) {
				let _fn = fns[i];
				if (_fn === fn) {
					fns.splice(i, 1);
				}
			}
		}
	}
};