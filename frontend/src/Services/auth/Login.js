import axios from "axios";

import * as Config from "../../Utils/config";

export async function LoginApi(data) {
  try {
    const response = await axios.post(`${Config.base_url}login`, data);

    return response.data;
  } catch (error) {
    console.log("Error fetching login:", error.message || error);
    throw error;
  }
}

// export async function UserLoginApi(data) {
//   try {
//     const response = await axios.post(
//       `${Config.base_url}api/client/login`,
//       data
//     );

//     return response.data;
//   } catch (error) {
//     console.log("Error fetching login:", error.message || error);
//     throw error;
//   }
// }

// export async function UserSignupApi(data) {
//   try {
//     const response = await axios.post(`${Config.base_url}api/client/add`, data);

//     return response?.data;
//   } catch (error) {
//     // console.log("Error fetching login:", error.response.data.message || error);
//     throw error;
//   }
// }

// export async function UserOtpSubmit(data) {
//   try {
//     const response = await axios.post(`${Config.base_url}api/client/otp_submit`, data);

//     return response.data;
//   } catch (error) {
//     console.log("Error fetching login:", error.message || error);
//     throw error;
//   }
// }

export async function VendorRegister(data) {
  try {
    const response = await axios.post(`${Config.base_url}addUser`, data);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

export async function Forgotpassword(data) {
  try {
    const response = await axios.post(`${Config.base_url}forgotPassword`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function Resetpassword(token, data) {
  try {
    const response = await axios.post(`${Config.base_url}resetPassword`, data, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function ChangePasswords(token, data) {
  try {
    const response = await axios.post(
      `${Config.base_url}change_password`,
      data,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error;
  }
}
