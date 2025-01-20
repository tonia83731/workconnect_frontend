/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`

interface ResponseData {
  success: boolean
  message?: string
  data?: any
  popup?: boolean
  reason?: 'NO_LOGIN' | 'NO_PERMISSION' | 'NOT_ADMIN'
}

export const axiosFetch = async (
  ACTION: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  payload?: unknown,
): Promise<AxiosResponse<ResponseData> | null> => {
  try {
    switch (ACTION) {
      case 'GET':
        return axios.get(`${BASE_URL}${url}`)
      case 'POST':
        return axios.post(`${BASE_URL}${url}`, payload || {})
      case 'PUT':
        return axios.put(`${BASE_URL}${url}`, payload || {})
      case 'PATCH':
        return axios.patch(`${BASE_URL}${url}`, payload || {})
      case 'DELETE':
        return axios.delete(`${BASE_URL}${url}`)
      default:
        return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const axiosAuthFetch = async (
  ACTION: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  payload?: any,
): Promise<AxiosResponse<ResponseData> | null> => {
  const token = Cookies.get('memberToken')
  const authStore = useAuthStore()
  const router = useRouter()

  if (!token) {
    toast.error('權限不足: 請先登入!')
    router.push({ name: 'login ' })
    return null
  }

  const headers = { Authorization: `Bearer ${token}` }
  try {
    switch (ACTION) {
      case 'GET':
        return axios.get(`${BASE_URL}${url}`, { headers })
      case 'POST':
        return axios.post(`${BASE_URL}${url}`, payload || {}, { headers })
      case 'PUT':
        return axios.put(`${BASE_URL}${url}`, payload || {}, { headers })
      case 'PATCH':
        return axios.patch(`${BASE_URL}${url}`, payload || {}, { headers })
      case 'DELETE':
        return axios.delete(`${BASE_URL}${url}`, { headers })
      default:
        return null
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 401) {
        const { reason, message } = error.response.data as ResponseData

        switch (reason) {
          case 'NO_LOGIN':
            toast.error(message)
            router.push({ name: 'login' })
            break
          case 'NO_PERMISSION':
            toast.error(message)
            const userId = authStore.userId
            if (userId) router.push({ name: 'dashboard', params: { userId } })
            else router.push({ name: 'login' })
            break
          default:
            toast.error(message)
        }
      } else {
        toast.error(error.response?.data?.message || 'ERROR.')
      }
    } else {
      toast.error('NETWORK ERROR. TRY AGAIN LATER.')
    }

    console.error(error)

    return null
  }
}
