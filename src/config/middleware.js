const path = require('path');
const isDev = think.env === 'development';


const catchErr = (options = {}) => {
  // 合并传递进来的配置
  return (ctx, next) => {
    return next().catch( e => {
      if (!e.status) {
        console.log(e.message);
        return ctx.json({status: false, message: e.message});
      }
    })
  }
};
module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: 'router',
    options: {
      defaultModule: '',
      defaultController: 'Common/HyAll',
      defaultAction: 'all',
      enableDefaultRouter: true,
    }
  },
  {
    handle: catchErr,
  },
  'logic',
  'controller'
];
