import axios from "axios";
import * as Config from "../../Utils/config";

export async function getcategory(token) {
    try {
        const res = await axios.get(`${Config.base_url}vendor/categories`, {
            headers: {
                'Authorization': `${token}`
            },
        });
        return res?.data;
    } catch (err) {
        return err;
    }
}