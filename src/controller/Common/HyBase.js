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
      const modules = await this.getModules();
      const {step, steps, mainModule} = this.post();

      const [, nav, module] = mainModule.split('/');
      const topLevelFields = modules.find(item => item.frame_nav.value === nav && item.module_name === module);

      let currentModule = module;
      let currentFields = topLevelFields;

      if (step && steps && steps.length) {
        const moduleUrl = steps[step].moduleUrl;
        const [, nav, module] = moduleUrl.split('/');
        currentModule = module;
      }


      while (step > 0 && currentFields.module_name !== currentModule) {
        currentFields = currentFields.child
      }

      if (_.isString(fields)) {
          return currentFields[fields]
      }

      if (_.isArray(fields)) {
          return _.pick(currentFields, fields);
      }
    }

    async getModules() {
      const moduleModel = this.model('Common/Base');
      const roleId = await this.session('roleId');

      const access = await this.model('frame_access').where({'role_id': roleId}).getField('module_id');

      return await moduleModel.getModules(access);
    }
};
