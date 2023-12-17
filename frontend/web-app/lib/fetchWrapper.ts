import { getTokenWorkaround } from "@/actions/authActions";

const baseUrl = 'http://localhost:6001/';

async function get(url: string){
    // console.log("[fetchWrapper] get: ", url, " baseUrl: ", baseUrl, " headers:", await getHeaders());
    try {
        const requestOptions = {
            method: 'GET',
            headers: {}
        };
        
        const response = await fetch(baseUrl + url, requestOptions);
        return await handleResponse(response);
    } catch (error: any) {
        throw new Error(`Error in GET request: ${error.message}`);
    }
}

async function post(url: string, body: {}) {
    // console.log("[fetchWrapper] get: ", url, " baseUrl: ", baseUrl, " headers:", await getHeaders());

    try {
        const requestOptions = {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(body)
        };
        const response = await fetch(baseUrl + url, requestOptions);
        return await handleResponse(response);
    } catch (error: any) {
        throw new Error(`Error in POST request: ${error.message}`);
    }
}


async function put(url: string, body: {}) {
    try {
        const requestOptions = {
            method: 'PUT',
            headers: await getHeaders(),
            body: JSON.stringify(body)
        };
        const response = await fetch(baseUrl + url, requestOptions);
        return await handleResponse(response);
    } catch (error: any) {
        throw new Error(`Error in PUT request: ${error.message}`);
    }
}


async function del(url: string) {
    try {
        const requestOptions = {
            method: 'DELETE',
            headers: await getHeaders(),
        };
        const response = await fetch(baseUrl + url, requestOptions);
        return await handleResponse(response);
    } catch (error: any) {
        throw new Error(`Error in DELETE request: ${error.message}`);
    }
}

async function getHeaders() {
    try {
        const token = await getTokenWorkaround();
        const headers = {
            "Content-Type": "application/json",
        } as any;
        if (token){
            headers.Authorization = `Bearer ${token.access_token}`;
        }
        return headers;
    } catch (error: any) {
        throw new Error(`Error in getting headers: ${error.message}`);
    }
}


async function handleResponse(response: Response){
    const text = await response.text();
    let data;
    
    try {
        data = JSON.parse(text);        
    } catch (err: any) {
        data = text;
    }
    
    if (!response.ok)
    {
        const error = {
            status: response.status,
            message: typeof data === 'string' ? data : response.statusText
        };
        
        return {error};
    }

    return data || response.statusText;

}

export const fetchWrapper = {
    get, 
    post,
    put,
    delete: del
};
