import axios from 'axios';
import * as Config from "../../Utils/config";
const qs = require('qs');






export async function GetVendoreList(token) {
    try {
        const res = await axios.get(`${Config.base_url}admin/vendors`, {
            headers: {
                'Authorization': `${token}`
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

export async function GetSponsoredVendors(token) {
    try {
        const res = await axios.get(`${Config.base_url}admin/vendors/sponsored`, {
            headers: {
                'Authorization': `${token}`
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

export async function GetBlockedVendore(token) {
    try {
        const res = await axios.get(`${Config.base_url}admin/vendors/blocked`, {
            headers: {
                'Authorization': `${token}`
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}