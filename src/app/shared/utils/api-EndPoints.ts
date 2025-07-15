export const BASE_URL = 'https://localhost:7055/api';

export const ENDPOINTS_CONSTANTS = {

    newUserInfo: {
      getAll: `${BASE_URL}/NewUserInfo/GetAllNewUserInfos`,
      getById: `${BASE_URL}/NewUserInfo/GetNewUserInfoById`,
      update: `${BASE_URL}/NewUserInfo/UpdateNewUserInfo`,
      create: `${BASE_URL}/NewUserInfo/CreateNewUserInfo`,
      delete: `${BASE_URL}/NewUserInfo/DeleteNewUserInfo`,
      category:{
         getAll: `${BASE_URL}/NewUserInfo/GetAllNewUserInfoCategories`,
         getById: `${BASE_URL}/NewUserInfo/GetNewUserInfoCategoryById`,
         update: `${BASE_URL}/NewUserInfo/UpdateNewUserInfoCategory`,
         create: `${BASE_URL}/NewUserInfo/CreateNewUserInfoCategory`,
         delete: `${BASE_URL}/NewUserInfo/DeleteNewUserInfoCategory`,
      }
    },
}
