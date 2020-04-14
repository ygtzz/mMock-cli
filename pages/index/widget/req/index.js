import axios from 'axios';

const instance = axios.create();

// Add a request interceptor
instance.interceptors.request.use(function (req) {
    return req;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (res) {
    console.log(res);
    let data = res.data;
    if(data.code != 200){
        console.log('err: ',data.code,data.msg);
        return;
    }
    return data.body;
}, function (err) {
    return Promise.reject(err);
});


export default instance;