import axios from 'axios'
import {Modal} from 'view-design'
import store from '@/store'
import {getToken} from '@/utils/auth'

var qs = require('qs')

export function request(config) {
    //创建axios实例
    const service = axios.create({
        // axios中请求配置有baseURL选项，表示请求URL公共部分

        baseURL: 'https://huoyi.pblog.top',
        withCredentials: true, // 开启跨域
        timeout: 10000, // 请求超时时间
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },

    })

// request拦截器
    service.interceptors.request.use(config => {
        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false
        if (getToken() && !isToken) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        if (config.type && config.type === 'form') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            //data是接收的数据，接收的数据需要通过qs编码才可以直接使用
            if (config.data) {
                config.data = qs.stringify(config.data)
            }
        }
        return config
    }, error => {
        Promise.reject(error)
    })

// 响应拦截器
    service.interceptors.response.use(res => {
            // http 请求的响应码
            const status = res.status
            if (status != 200) {
                Modal.error({
                    title: '提示',
                    content: res.message
                });
                return Promise.reject('error')
            } else {
                // 服务器定义的响应码
                const code = res.data.code;
                if (code == 10604 || code == 10605 || code == 10606) {
                    Modal.error({
                        title: '登入提示',
                        content: '登入失效请重新登入'
                    });
                    return Promise.reject('error')
                }else if(code==20000){
                    Modal.error({
                        title: '错误提示',
                        content: '服务器出现错误'
                    });
                    return Promise.reject('error')
                } else {
                    return res.data
                }
            }
        },
        error => {
            let {message} = error;
            if (message == "Network Error") {
                message = "后端接口连接异常";
            } else if (message.includes("timeout")) {
                message = "系统接口请求超时";
            } else if (message.includes("Request failed with status code")) {
                message = "系统接口" + message.substr(message.length - 3) + "异常";
            }
            Modal.error({
                title: '提示',
                content: '超时或请求失败'
            });
            return Promise.reject(error)

        }
    )
    return service(config)
}


