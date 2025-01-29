import axios from 'axios';

let axiosInstance = {};
let tenant = null;

const ApiConnection = {};

ApiConnection.createInstance = (tenantURL, tenantID, securityToken) => {
    tenant = tenantID;
    axiosInstance = axios.create({
        baseURL: `https://${tenantURL}/reltio`,
        headers: {
            'Authorization': `Bearer ${securityToken}`,
            'Content-Type': 'application/json',
        }
    })
}

ApiConnection.getL3 = () => {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/api/${tenant}/configuration/_noInheritance`)
            .then((response) => {
                const result = response.data;
                resolve(result);
            })
            .catch((error) => {

                reject(error);
            })
    })
}

ApiConnection.getConfig = () => {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/permissions/${tenant}`)
            .catch((error) => {
                reject(error);
            })
            .then((response) => {
                const result = response.data;
                resolve(result);
            })
    })
}

ApiConnection.postConfig = (config) => {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post(`/permissions/${tenant}`, config)
            .catch((error) => {
                reject(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    resolve();
                } else {
                    reject();
                }
            })
    })
}

export default ApiConnection;