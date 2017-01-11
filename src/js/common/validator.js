/**
 *  表单验证方法集合
 */

import {throwError} from '../common/common';

export const validator = {

	// 验证规则处理类
	types: {

		// 判断是否为空
		isEmpty: function (args, message) {
			let state = true, errorMsg = '';
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
	validate: function () {
		let i, type, verifyItems, checker, data = this.config;

		// 清空返回结果
		this.result = [];

		// 清空status
		this.status = true;

		for (i in data) {

			// 判断属性不是继承自原型链
			if (data.hasOwnProperty(i)) {
				let result_ok = {};
				result_ok.verifyName = data[i].verifyName;
				result_ok.verifyItems = [];
				verifyItems = data[i].verifyItems;

				for (let i = 0, k; k = verifyItems[i++];) {
					let result;

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
						throwError('validator.validate.checker', 'checker is undefined');
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
};