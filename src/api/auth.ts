import { axiosFetch, axiosAuthFetch } from './index'
export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`

type UserAuthType = {
  email: string
  password: string
}

export type UserProfileType = UserAuthType & {
  name: string
}

export const register = async (payload: UserProfileType) => {
  try {
    const response = await axiosFetch('POST', `/register`, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const login = async (payload: UserAuthType) => {
  try {
    const response = await axiosFetch('POST', `/login`, payload)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

export const checkedAuthentication = async () => {
  try {
    const response = await axiosAuthFetch('GET', `/user/checked-authentication`)
    return response?.data
  } catch (error) {
    console.log(error)
  }
}
