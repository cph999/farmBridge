// api.js
import axios from 'axios';
import LocalStorageUtil from './LocalStorageUtil';

// 创建一个 axios 实例
export const instance = axios.create({
    baseURL: 'http://localhost:8809/api',  // 或者你可以切换到 https://app102.acapp.acwing.com.cn/api
    // baseURL: 'https://app102.acapp.acwing.com.cn/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// 请求拦截器：每次请求发送之前，检查并附带 token
instance.interceptors.request.use(
    (config) => {
        // 从 LocalStorage 中获取用户信息
        const userinfo = LocalStorageUtil.getItem('userinfo');

        // 如果用户信息存在并且 token 存在，将 token 添加到请求头
        if (userinfo && userinfo.token) {
            config.headers['Authorization'] = userinfo.token;
        }

        return config;
    },
    (error) => {
        // 请求错误处理
        return Promise.reject(error);
    }
);

// 响应拦截器：全局错误处理
instance.interceptors.response.use(
    (response) => {
        return response;  // 返回正常响应
    },
    (error) => {
        const userinfo = LocalStorageUtil.getItem('userinfo');

        // 如果状态码是 500 且用户已登录，清除 token 并跳转到登录页面
        console.log("error.response", error.response)
        if (error.response && error.response.status !== 200 && userinfo) {
            LocalStorageUtil.removeItem('userinfo');
            window.location.href = '/';  // 跳转到登录页
        }

        return Promise.reject(error);
    }
);

export default instance;
