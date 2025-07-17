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


export async function GetApproveVendor(vendorId ,token) {
   try {
    const res = await axios.post(
      `${Config.base_url}admin/vendors/approve`,
      { vendor_id: vendorId }, 
      {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

        return res?.data;
    } catch (err) {
        return err;
    }
}

export async function GetApproveVendoreList(token) {
    try {
        const res = await axios.get(`${Config.base_url}admin/active_vendors`, {
            headers: {
                'Authorization': `${token}`
            },
        });

        return res?.data;
    } catch (err) {
        return err;
    }
}

export async function GetProfileUpdateRequests(token, status = "all", page = 1, limit = 100) {
  try {
    const endpoint =
      status === "all"
        ? `${Config.base_url}admin/profile-update-requests`
        : `${Config.base_url}admin/profile-update-requests/${status}`;

    const res = await axios.get(endpoint, {
      params: { page, limit },
      headers: {
        Authorization: token,
      },
    });

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetGalleryUpdateRequests(token,status="all",page=1,limit=100){
    try {
        const endpoint=status==="all"
        ?`${Config.base_url}admin/gallery-requests`
        :`${Config.base_url}admin/gallery-requests/${status}`;
    
    const res=await axios.get(endpoint,{
        params:{page,limit},
        headers:{
            Authorization:token,
        },
    });
    return res?.data;
    
    }catch(err){
        return err;
    }
}
