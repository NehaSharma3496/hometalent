import axios from 'axios';
// import * as Config from "../Utils/config";
import * as Config from "../../../Utils/config"
const qs = require('qs');




export async function GetClient(token) {
    try {
        const res = await axios.get(`${Config.base_url}client/listfive`, {
            headers: {
                'Authorization': `${token}`
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}



export async function AddStaffClient(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}user/add`, data, {
            headers: {
                data: {},
                'Authorization': `${token}`,
            },

        });

        return res?.data;
    } catch (err) {
        return err.response?.data || err.message;
    }
}


