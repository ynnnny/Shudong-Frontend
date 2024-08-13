import Taro from '@tarojs/taro'
import { requestType } from './fetchTypes'

const root = 'https://shudong814.com/api/v1'

const Fetch = async <T>(
  url: string,
  data: object = {},
  method: requestType = 'GET',
  token: string = Taro.getStorageSync('token')
): Promise<T> => {
  const header = {
    'content-type': 'application/json',
    Authorization: token, // 使用传入的authToken
  }

  try {
    const response = await Taro.request({
      url: root + url,
      data,
      method,
      header,
    })

    console.log(`fetch ${url}`,response);
    return response.data
  } catch (e) {
    console.log(`fetch error ${url}`,e)
    throw e
  }
}

export default Fetch

