export default class Tools {
  static isEmpty = (obj) =>
    [Object, Array].includes((obj || {}).constructor) &&
    !Object.entries(obj || {}).length;

  static getEnv = () => {
    return process.env.CURRENT_ENV || "production";
  };

  static autoMatch = (url) => {
    let baseUrl = "";
    if (getEnv() !== "production") {
      // 开发环境 通过proxy配置转发请求；
      baseUrl = `/${url || "testapi"}`;
    } else {
      // 生产环境 根据实际配置 根据 url 匹配url;
      // 配置来源 根据实际应用场景更改配置。(1.从全局读取；2.线上配置中心读取)
      // switch (url) {
      //   case 'baidu':
      //     baseUrl = window.LOCAL_CONFIG.baidu;
      //     break;
      //   case 'alipay':
      //     baseUrl = window.LOCAL_CONFIG.alipay;
      //     break;
      //   default:
      //     baseUrl = window.LOCAL_CONFIG.default;
      // }
    }
    return baseUrl;
  };
}
