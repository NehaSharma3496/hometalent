import axios from "axios";
import * as Config from "../../Utils/config";
import { error } from "jquery";

export async function getcategoryplan(token) {
    try {
        const res = await axios.get(`${Config.base_url}vendor/categories`, {
            headers: {
                'Authorization': `${token}`
            },
        });
        return res?.data;
    } catch (err) {
        return { error: err.response?.data || err.message };
    }
}

export async function getcitiesplan(token) {
    try {
        const res = await axios.get(`${Config.base_url}vendor/cities`, {
            headers: {
                'Authorization': `${token}`
            },
        });
        return res?.data;
    } catch (error) {
        return { error: error.response?.data || error.message };
    }
}