import Axios from 'axios';
import { message } from 'antd';
import {Device,Tools} from './utils';
 
class Remote {
     constructor() {
         this.axios = Axios.create();
         this.initInterceptors();
         this.sources = [];
         this.CancelToken = Axios.CancelToken;
     }
 
     /**
      * 初始化全局拦截器
      */
     initInterceptors = () => {
         this.axios.interceptors.response.use(
             (response) => {
                 return response;
             },
             (error) => {
                 try {
                     return Promise.reject(error.response.data);
                 } catch (e) {
                     // 处理超时
                     if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') >= 0) {
                         // 覆盖超时信息
                         error.message = '请求超时，请刷新页面';
                     }
                     // 处理取消请求等错误
                     return Promise.reject(error);
                 }
             },
         );
     };
 
     /**
      * 删去已经完成的promise对应的key
      */
     delCancelHandler = (key) => {
         this.sources = this.sources.filter((source) => {
             return source.key !== key;
         });
     };
 
     /**
      * 生成cancelToken或者超时设置
      */
     genCancelConf = (key) => {
         const config = {};
         const keyType = typeof key;
         // key为string类型并且重复了，则直接返回空对象
         // key为number类型是设置超时，所以重复了不影响请求
         if (keyType === 'string' && !this.checkKey(key)) {
             return config;
         }
 
         if (keyType === 'string' && key) {
             // 处理取消请求
             const token = new this.CancelToken((c) => {
                 this.sources.push({
                     key,
                     cancel: c,
                 });
             });
             config.cancelToken = token;
             config.key = key;
         } else if (keyType === 'number') {
             // 处理超时
             config.timeout = key;
         }
         return config;
     };
 
     /**
      * 通过key来找到token
      */
     findSource = (key) => {
         return this.sources.find((s) => {
             return s.key === key;
         });
     };
 
     /**
      * 检查key是否重复
      */
     checkKey = (key) => {
         return this.findSource(key) === undefined;
     };
 
     /**
      * 取消掉请求
      */
     cancel = (key, msg = '用户手动取消') => {
         const source = this.findSource(key);
 
         if (source) {
             source.cancel(msg);
             this.delCancelHandler(key);
         }
     };
 
     static METHOD = {
         GET: 'GET',
         POST: 'POST',
     };
 
     get = (
         url,
         data,
         option = {
             urlType: 'default',
             key: null,
             isShowPermissionPage: false,
         },
     ) => {
         return new Promise((resolve, reject) => {
             return this.http(
                 Remote.METHOD.GET,
                 Tools.autoMatch(url),
                 data,
                 'json',
                 option.key,
                 option.isShowPermissionPage,
             ).then(
                 (res) => {
                     resolve(res);
                 },
                 (error) => {
                     reject(error);
                     message.error(error.reason);
                 },
             );
         });
     };
 
     post = (
         url,
         data,
         option = {
             urlType: 'default',
             key: null,
             isShowPermissionPage: false,
             type: 'json',
         },
     ) => {
         return new Promise((resolve, reject) => {
             return this.http(
                 Remote.METHOD.POST,
                 Tools.autoMatch(url),
                 data,
                 option.type,
                 option.key,
             ).then(
                 (res) => {
                     resolve(res);
                 },
                 (error) => {
                     reject(error);
                     message.error(error.reason);
                 },
             );
         });
     };
 
     /**
      * HTTP 请求远端数据。
      * @return Promise
      */
     http = (method, url, data, type = 'json', key) => {
         if (!url) return null;
         const send = this.axios.request;
         const config = this.getHttpConfig(method, url, data, type, this.genCancelConf(key));
         return new Promise((resolve, reject) => {
             send(config)
                 .then((resp) => {
                     const respData = resp.data;
                     this.delCancelHandler(config.key);
                     let code = respData.error === undefined ? respData.code : respData.error;
                     if (respData.error === undefined && respData.code === undefined) {
                         code = respData.response && respData.response.code;
                     }
                     let msg = '';
                     switch (code) {
                         case '0':
                         case 0:
                             resolve(respData);
                             break;
                         default:
                             switch (code) {
                                 case -1:
                                     msg = '账号未登录';
                                     break;
                                 case -2:
                                     msg = '用户无权限操作';
                                     break;
                                 case 400:
                                     msg = '错误请求';
                                     break;
                                 case 401:
                                     msg = '未授权，请重新登录';
                                     break;
                                 case 403:
                                     msg = '拒绝访问';
                                     break;
                                 case 404:
                                     msg = '请求错误,未找到该资源';
                                     break;
                                 case 405:
                                     msg = '请求方法未允许';
                                     break;
                                 case 408:
                                     msg = '请求超时';
                                     break;
                                 case 500:
                                     msg = '服务器端出错';
                                     break;
                                 case 501:
                                     msg = '网络未实现';
                                     break;
                                 case 502:
                                     msg = '网络错误';
                                     break;
                                 case 503:
                                     msg = '服务不可用';
                                     break;
                                 case 504:
                                     msg = '网络超时';
                                     break;
                                 case 505:
                                     msg = 'http版本不支持该请求';
                                     break;
                                 default:
                                     msg = respData.msg || '异常错误';
                             }
                             reject({
                                 error: -100,
                                 code: respData.code,
                                 reason: msg,
                                 data: respData.data,
                             });
                     }
                 })
                 .catch((err) => {
                     reject({
                         error: -1,
                         reason: `网络异常或服务器错误: [${err.message}]`,
                     });
                 });
         });
     };
 
     /**
      * 获取http请求配置
      */
     getHttpConfig = (method, url, data, type, specificConf) => {
         let sendURL = url;
         const config = Object.assign(
             {},
             {
                 url: sendURL,
                 withCredentials: true,
                 method,
             },
             specificConf,
         );
         if (method === Remote.METHOD.GET) {
             sendURL += this.genQuery(data);
             config.url = sendURL;
         } else {
             let contentType = '';
             let cfgData = data;
             switch (type) {
                 case 'json':
                     contentType = 'application/json';
                     cfgData = JSON.stringify(data || {});
                     break;
                 case 'file':
                     contentType = 'multipart/form-data';
                     cfgData = new FormData();
                     _forEach(data, (val, key) => {
                         cfgData.append(key, val);
                     });
                     break;
                 case 'formData':
                     contentType = 'application/x-www-form-urlencoded';
                     config.transformRequest = [
                         (requestData) => {
                             let ret = '';
                             let index = 0;
                             _forEach(requestData, (v, k) => {
                                 ret += `${index === 0 ? '' : '&'}${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
                                 index += 1;
                             });
                             return ret;
                         },
                     ];
                     break;
                 default:
                     break;
             }
             config.headers = { 'Content-Type': contentType };
             config.data = cfgData;
         }
         return config;
     };
 
     /**
      * 定义生成http query string的方法
      * @param queryData Object query参数
      * @return string query字符串
      */
     genQuery = (queryData) => {
         if (Tools.isEmpty(queryData)) return '';
         let ret = '';
         // 防止IE接口缓存，加上时间戳
         if (Device.isIE()) queryData.timestamp = new Date().getTime();
         Object.entries(queryData).forEach(([val, key]) => {
             if (typeof val !== 'undefined') {
                 ret += `&${key}=${encodeURIComponent(val)}`;
             }
         });
         return ret.replace(/&/, '?');
     };
}
 
 const remote = new Remote();
 export default {
     get: remote.get,
     post: remote.post,
     cancel: remote.cancel,
 };
 