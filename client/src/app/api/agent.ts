import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../ruoter/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";


axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;                      // allows to send cookies

/*
const sleep = (delay:number) => new Promise(
    resolve => setTimeout(resolve, delay)
);
*/

axios.interceptors.request.use( config => {
    const token = store.getState().account.user?.token;
    if(token){
        config.headers.Authorization = `Bearer ${token}` ;
    }
    return config;
})


axios.interceptors.response.use( response => {
     const pagination = response.headers['pagination'];
     if(pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
     }
     return response;
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse;
    switch(status){
        case 400:
            if(data.errors){
                const modelStateErrors: string[] = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data?.title);
            break;
        case 404:
            router.navigate('/not-found')
            break;
        case 500:
            router.navigate('/server-error',{ state: {error:data} })
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
};

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),
    filters: () => requests.get('products/filters')
};

const Accont = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/current-user')
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Accont
};

export default agent;