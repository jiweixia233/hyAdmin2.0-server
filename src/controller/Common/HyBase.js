const _ = require('lodash');
module.exports = class HyBase extends think.Controller {
    // 前置操作
    async __before(){

        const publicController = this.config('publicController');
        const publicAction = this.config('publicAction');
        // 如果为非公开，则验证用户是否登录
        const controllerAction = this.ctx.controller + '/' + this.ctx.action;
        if (!publicController.includes(this.ctx.controller) && !publicAction.includes(controllerAction)) {
            if (think.userId <= 0) {
                return this.fail(401, '请先登录');
            }
        }

        this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
        this.header('Access-Control-Allow-Headers', 'Content-Type,x-requested-with');
        this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
        this.header('Access-Control-Allow-Credentials', 'true');
    }

    getSid() {
        return this.cookie('@hy');
    }

    /**
     * 获取当前登录用户的id
     * @returns {*}
     */
    async getUserId() {
        return await this.session('userId');
    }

    async getRouterFields(fields) {
        const modules = await this.session('modules');
        const {path} = this.post();
        const [, nav, module] = path.split('/');
        const totalFields = modules.find(item => item.frame_nav.value === nav && item['module_name'] === module);
        if (_.isString(fields)) {
            return totalFields[fields]
        }

        if (_.isArray(fields)) {
            return _.pick(totalFields, fields);
        }
    }
};
