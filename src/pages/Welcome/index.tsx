import Taro from '@tarojs/taro'
import React, { useState, useEffect } from 'react'
import { View, Swiper, SwiperItem, Image, Button } from '@tarojs/components'
import LoginModal from '../../Components/loginModal'
import Fetch from '../../Service/fetch'
import './index.less'
import { getUserInfo } from '../../Service/login'
import { IsTokenInvalid } from '../../utils/IsTokenInvalid'

const Welcome: React.FC = () => {
  const [modalShow, setModalshow] = useState<boolean>(false)

  /* 获取身份权限，选择跳转页面*/
  useEffect(() => {
    IsTokenInvalid()
      ? Fetch('/user/info', {}, 'POST').then((res)=>{
        getUserInfo
        console.log('userinfo',res);
        Taro.reLaunch({ url: '/moduleA/pages/Form/index' })
      })
      : Taro.clearStorageSync()
  }, [])

  // useEffect(()=>{
  //   Taro.setStorageSync('token',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjMyOTQ2ODYsImlhdCI6MTcyMjY4OTg4NiwidXNlcklkIjozfQ.SeXvqB1DD8c-q8h1h0XpGWOmIwUq7T_fzLr3OEy6fdA")
  //   Taro.reLaunch({ url: '/moduleA/pages/Form/index' })
  // },[]);

  function handleChangeModalShow() {
    setModalshow(!modalShow)
  }
  function handleLogin() {
    handleChangeModalShow()
  }


  return (
    <View className="welcome">
      <Swiper
        className="test-h"
        indicatorColor="#999"
        indicatorActiveColor="#333"
        circular
        indicatorDots
        full
      >
        <SwiperItem className="Swiper-Item">
          <View className="demo-image">
            <Image src="https://s2.loli.net/2023/04/28/kR3CIwfdNnHBtG5.jpg" />
          </View>
          <View className="Join-us">
            <Button className="button" onClick={handleLogin}>
              加入我们
            </Button>
          </View>
        </SwiperItem>
      </Swiper>

      {/* 弹窗 */}
      <LoginModal modalShow={modalShow} changeShow={handleChangeModalShow} />
    </View>
  )
}
export default Welcome
