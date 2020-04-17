import * as axios from 'axios';
import fs from "fs";

const publicKey = fs.readFileSync('../rsa/public.crt', 'utf8');

// env test to docker or local
const host = process.env.NODE_ENV === 'test' ? 'http://10.1.0.2:5000' : 'http://localhost:5000';

export const createRequest = (method: axios.Method, queryString: string): Promise<axios.AxiosResponse<any>> => {
    return axios.default.request({
        url: host + queryString,
        method,
        headers: {
            'Authorization': `Bearer ${publicKey.toString().replace(new RegExp("\n", "g"), "\\n")}`,
            'Content-Type': 'application/json'
        },
        transformResponse: (r: any): axios.AxiosTransformer => r ? r : {}
    });
};

export const createUser = async (user: any): Promise<number> => {
    const {
        name,
        email,
        description
    } = user;
    const user_add_response: axios.AxiosResponse = await createRequest(
        'post',
        '/user?query=mutation user{user_add(name:"' + name + '",email:"' + email + '",description:"' + description + '")}'
    );
    const { user_add } = ((JSON.parse(user_add_response.data)).data); // response.data  { <graphql>.data[user_add] }
    return user_add;
};

export const getUser = async (id: number) => {
    const user_get_response: axios.AxiosResponse = await createRequest(
        'get',
        '/user?query={user(id:' + id + '){id,name,email,description},connected}'
    );
    return ((JSON.parse(user_get_response.data)).data); // response.data  { <graphql>.data[user_add] }
};

export const allUsers = async () => {
    const users_all_response: axios.AxiosResponse = await createRequest(
        'get',
        '/user?query={all_users {id,name,email,description,isBlocked}}'
    );
    return ((JSON.parse(users_all_response.data)).data); // response.data  { <graphql>.data[user_add] }
};

export const setUser = async ({ id, name, email, description }: any) => {
    const user_set_response: axios.AxiosResponse = await createRequest(
        'post',
        '/user?query=mutation user{user_set(id:' + id + ',name:"' + name + '",email:"' + email + '",description:"' + description + '"){id,name,description,email,isBlocked}}'
    );
    return ((JSON.parse(user_set_response.data)).data); // response.data  { <graphql>.data[user_add] }
};

export const deleteUser = async (id: number) => {
    const user_del_response: axios.AxiosResponse = await createRequest(
        'post',
        '/user?query=mutation user{user_del(id:' + id + ')}'
    );
    return ((JSON.parse(user_del_response.data)).data); // response.data  { <graphql>.data[user_add] }
};
