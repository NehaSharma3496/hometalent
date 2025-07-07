import axios from "axios";
import * as Config from "../../Utils/config";

export async function GetCategories(token) {
  try {
    const res = await axios.get(`${Config.base_url}vendor/categories`, {
      headers: {
        'Authorization': `${token}`
      }
    });

    return res?.data;
  } catch (err) {
    return err;
  }
}


export async function GetStateCity(token){
    try{
        const res = await axios.get(`${Config.base_url}front/state_city_list`,{
            headers:{
                'Authorization':`${token}`
            }
        });
        return res?.data;
    }catch(err){
        return err;
    }
}
