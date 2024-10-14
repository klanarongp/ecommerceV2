import axios from 'axios';

axios.interceptors.request.use(
    config => {
        console.log('test axios !!!!')
    }
);

export default axios;