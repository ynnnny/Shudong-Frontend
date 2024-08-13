import Taro, { useDidShow } from '@tarojs/taro'
import { View, Picker, Text, Image, Button, CommonEvent, Textarea } from '@tarojs/components'
import { useEffect, useState } from 'react'
import {
  AtInput,
  AtList,
  AtListItem,
  AtButton,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui'
import Fetch from '../../../Service/fetch'
import AddressPicker from '../../components/address'
import './index.less'
import './index.scss'

import { Provider, useDispatch, useSelector } from 'react-redux'
import store, {
  setFormField,
  setHistoryField,
  setCardField,
  addCard,
  setFrontFile,
  setBackFile,
  setProveFiles,
  RootState,
  setQuestionField
} from '../../../slices/formStore';

const App = () => (
  <Provider store={store}>
    <Form />
  </Provider>
);

const Form = () => {
  const dispatch = useDispatch()
  const formState = useSelector((state:RootState) => state.form)
  const initialPath = 'https://s2.loli.net/2024/07/31/pYh4fxzQ8Rneua7.png'
  const [address, setAddress] = useState('-')
  const [showPicker, setShowPicker] = useState<boolean>(false) //显示地址picker
  const {name, tel, dateSel, email, politicalOutlook, nation, number, degree, speciality, native, work, otherWork,
        history, card, status, sex, sexSelected, frontFile, backFile, proveFiles, questions} = formState;

  const addFile = async (type) => {
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var path= tempFilePaths[0]
        Taro.uploadFile({
          url: 'https://shudong814.com/api/v1/user/uploadavatar',
          filePath: path,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            "Authorization": Taro.getStorageSync('token'),
          },
          success(ress){
            console.log("ress",ress)
            if(ress.statusCode==200){
            const resData = JSON.parse(ress.data)
            console.log(resData)
            switch (type) {
              case "front":
                dispatch(setFrontFile(path));
                break;
              case "back":
                dispatch(setBackFile(path));
                break;
              case "prove":
                dispatch(setProveFiles([path]));
                break;
              default:
                break;
            }
            }
            else if(ress.statusCode==502)
              Taro.showToast({
                title:'图片大小超过限制',
                icon:'error'
              })
          }
        , fail: err => {
          Taro.showToast({
            title:'图片大小超过限制',
            icon:'error'
          })
          // handle error
        }})
      }

    })
  };

  function onPickerChange(e) {
    console.log('address',e);
    setAddress(e)
  }

  function chooseAddress() {
    /* console.log('choose') */
    console.log('setshowpicker');
    
    setShowPicker(true)
  }

  function onAConfirm() {
    setShowPicker(false)
  }

  const Query = (Res) => {
    console.log("query",Res);
    // setSexselected(Res?.sex)
    // setAddress(Res?.address)
    // setEmail(Res?.email)
    // setDateSel(Res?.birthday)
    // setName(Res?.username)
    // setTel(Res?.mobile)
    // dispatch(setFormField({ field: 'status', value: Res?.status}));
    // Res?.status && Taro.setStorageSync('status', Res?.status)
    if (Taro.getStorageSync('submit')) setIfopen(false)
      Taro.reLaunch({
        url: '/pages/Main/index',
      })
    // if (Res?.status >= 2) {
    //   console.log('success')
    //   Taro.reLaunch({
    //     url: '/pages/Main/index',
    //   })
    // } else
    //   Taro.reLaunch({
    //     url: `/moduleC/pages/Auditform/index?status=${Res.status}`,
    //   })
  }

  function fetchData() {
    Fetch('/application/form', {}, 'POST').then((res) => {
      console.log('form',res?.data)
      const Res = res?.data?.application_form
      Query(Res)
    })
  }

  useDidShow(() => {
    //console.log(Taro.getStorageSync('submit'))
    console.log('usedidshow');
    
    if (status < 2 && Taro.getStorageSync('submit')) {
      console.log('success didshow');
      
      fetchData()
      /*  setInterval(() => {
          fetchDataActions()
        }, 5000); */
    }
  })

  function onDateChange(e) {
    dispatch(setFormField({ field: 'dateSel', value: e.detail.value }));
    console.log(e.detail.value)
  }

  const handleInputChange = (field) => (value) => {
    dispatch(setFormField({ field, value }))
    return value
  }


  const handleHistoryChange = (field) => (value) => {
    dispatch(setHistoryField({ field, value }))
    return value
  }

  function onSexChange(e) {
    const selectedSex = e.detail.value;
    dispatch(setFormField({ field: 'sexSelected', value: parseInt(selectedSex, 10) }));
  }

  function generateText() {
    switch (status) {
      case 0:
        return '区域负责人审批中，请耐心等待'
      case 1:
        return '组织管理委员会审批中，请耐心等待'
      case 2:
        return '申请已通过'
      case 3:
        return '申请未通过,请修改申请后重新提交'
      default:
        return '网络状况不佳'
    }
  }

  //改简历
  const handleCardChange = (index, field, value) => {
    dispatch(setCardField({ index, field, value }))
  }

  const addResume = () => {
    dispatch(addCard())
  }

  function register() {
    const data = {
      mobile: tel,
      username: name,
      sex: sexSelected,
      email,
      address,
      birthday: dateSel,
      policialOutlook: politicalOutlook,
      nation,
      identificationNumber: number,
      degree,
      speciality,
      native,
      work,
      outWork: otherWork,
      resumes: card.map(({ time, place, duty }) => ({ time, place, duty })),
      medicalHistory: {
        outpatientHistory: history.medicine,
        medicineHistory: history.therapy,
        medicine: history.drug,
      },
      identity:{
        frontIdCard: frontFile,
        backIdCard: backFile,
        files: proveFiles
      },
      answers: questions.map(({ answer }, index) => ({ index, answer }))

    };
    // console.log(data);

    if (name && tel && address != '-' && dateSel && email && native && politicalOutlook && number && degree && speciality && work 
      && otherWork && history && card && frontFile != initialPath && backFile != initialPath && proveFiles[0] != initialPath) {
    // if(name){
    //const add=address.pro+'-'+address.city;

      Fetch('/application/edit', data, 'POST').then((res) => {
        console.log(res)
        //更新个人信息
        Fetch('/user/edit', data, 'POST').then(console.log(res))
        Taro.setStorageSync('submit', true)
        dispatch(setFormField({ field: 'status', value: 0 }));
        //订阅消息
      Taro.requestSubscribeMessage({
        tmplIds: ['_xbtX5gtyvi8uhpHsAmt-XhcdfTpXd7HLWh-ahuUptU'],
        success: function (ress) {
          console.log(ress)
        },
        fail: function (err) {
          console.log(err)
        },
        entityIds: []
      })
    })
      Taro.reLaunch({
        url: `/moduleC/pages/Auditform/index?status=${0}`,
      })
    }
    if (!name || !tel || address == '-' || !dateSel || !email || !native || !politicalOutlook|| !number || !degree || !speciality || !work 
      || !otherWork || !history || !card || frontFile == initialPath || backFile == initialPath || proveFiles[0] == initialPath) {
    // if(!name){
      Taro.showToast({
        icon: 'none',
        title: '还没有填完哦',
      })
    }
  }

  const [page,setPage] = useState([true,false])

  function nextForm() {
    setPage([false,true])
  }

  function lastForm() {
    setPage([true,false])
  }

  const handleAnswerChange = (index: number, evt ) => {
    dispatch(setQuestionField({ index, field: 'answer', value: evt.target.value }));
  };

  const [ifopen, setIfopen] = useState(true)

  function handleConfirm() {
    console.log('confirm')
    setIfopen(false)
  }

  function handleCancle() {
    Taro.navigateTo({
      url: '/pages/Welcome/index',
    })
  }

  return (
    <>
      <AtModal isOpened={ifopen}>
        <AtModalHeader>用户服务协议及隐私政策</AtModalHeader>
        <AtModalContent>
          &nbsp;&nbsp;本平台保护所有用户的个人隐私权。我们将按照本隐私权政策的规定收集、使用或披露您的个人信息。同时，我们会通过本政策向您说明，我们如何为您提供访问、
          更新、控制和保护您信息的服务。您使用或继续使用我们的服务，即意味着同意我们按照本《用户协议和隐私政策》收集、使用、储存和分享您的相关信息。如对本政策或相关事宜有任何问题，请通过微信或邮箱与我们联系。
        </AtModalContent>
        <AtModalContent>
          &nbsp;&nbsp;树洞救援团, 以帮助抑郁症患者缓解自杀情绪为责任,
          以拯救生命为最高伦理原则. 如果您愿意成为救援团的志愿者,
          本页面收集的您的姓名、手机号、邮箱等个人信息皆只用于您的身份审核,
          确保不会泄漏您的个人信息.{' '}
        </AtModalContent>
        <AtModalAction>
          {' '}
          <Button onClick={handleCancle}>不同意</Button>{' '}
          <Button onClick={handleConfirm}>我已了解且同意该政策</Button>{' '}
        </AtModalAction>
      </AtModal>
      {/*  {Taro.getStorageSync('submit') && status!=3 && Taro.getStorageSync('submit') && <View className='hover' onClick={()=>{
          Taro.showToast({
            icon: 'none',
            title: '申请审核中,无法更改申请表'
          });
        }}
        ></View>} */}
      <View className="Form">
        <Text
          style={{
            fontSize: 25,
            fontFamily: 'sans-serif',
            marginBottom: 30,
            marginLeft: 20,
            color: 'white',
          }}
        >
          申请表
        </Text>
        <View className={page[0] ? "f_box" : "next"}>
          <View className="Form_i">
            <AtInput
              name="value"
              title="姓名"
              type="text"
              placeholder="输入姓名"
              value={name}
              onChange={handleInputChange('name').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="证件号"
              type="text"
              placeholder="输入身份证或护照号码"
              value={number}
              onChange={handleInputChange('number').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="手机号"
              type="number"
              placeholder="请输入手机号"
              value={tel}
              onChange={handleInputChange('tel').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="民族"
              type="text"
              placeholder="输入民族"
              value={nation}
              onChange={handleInputChange('nation').bind(this)}
            />
          </View>
          <View className="Form_i">
            <Picker mode="date" onChange={(e) => onDateChange(e)}>
              <AtList>
                <AtListItem title="请选择出生日期" extraText={dateSel} />
              </AtList>
            </Picker>
          </View>
          {/*地址选择器 */}
          <View className="Form_i" onClick={chooseAddress}>
            <AtList>
              <AtListItem title="省市" extraText={address} />
            </AtList>
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="籍贯"
              type="text"
              placeholder="输入籍贯"
              value={native}
              onChange={handleInputChange('native').bind(this)}
            />
          </View>
          <View className="Form_i">
            <Picker
              mode="selector"
              range={sex}
              onChange={(e) => onSexChange(e)}
            >
              <AtList>
                <AtListItem title="性别" extraText={sex[sexSelected]} />
              </AtList>
            </Picker>
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="邮箱"
              type="text"
              placeholder="输入邮箱"
              value={email}
              onChange={handleInputChange('email').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="政治面貌"
              type="text"
              placeholder="输入政治面貌"
              value={politicalOutlook}
              onChange={handleInputChange('politicalOutlook').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="文化程度"
              type="text"
              placeholder="输入文化程度"
              value={degree}
              onChange={handleInputChange('degree').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="专业"
              type="text"
              placeholder="输入专业"
              value={speciality}
              onChange={handleInputChange('speciality').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="所在部门及职务、职称"
              type="text"
              placeholder="所在部门及职务、职称"
              value={work}
              onChange={handleInputChange('work').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="其他社会职务"
              type="text"
              placeholder="其他社会职务"
              value={otherWork}
              onChange={handleInputChange('otherWork').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="既往精神科或心理门诊病史"
              type="text"
              placeholder="既往精神科或心理门诊病史"
              value={history.medicine}
              onChange={handleHistoryChange('medicine').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="治疗史"
              type="text"
              placeholder="治疗史"
              value={history.therapy}
              onChange={handleHistoryChange('therapy').bind(this)}
            />
          </View>
          <View className="Form_i">
            <AtInput
              name="value"
              title="现用药物"
              type="text"
              placeholder="现用药物"
              value={history.drug}
              onChange={handleHistoryChange('drug').bind(this)}
            />
          </View>
          <View className='resume'>
            <View className='title'>本人主要简历</View>
            {
              card && card.map((item, index) =>
                <Card key={index} {...item} onCardChange={(field, value) => handleCardChange(index, field, value)} />
              )
            }
            <View onClick={addResume} className='add'>添加</View>
          </View>
          <View className='file_display'>
            <Text className='photo'>身份证照片</Text>
            <View className='display'>
              <View onClick={()=>addFile("front")}>
                <Image src={frontFile}></Image>
              </View>
              <Text>正面（国徽面）</Text>
            </View>
            <View className='display'>
              <View onClick={()=>addFile("back")}>
                <Image src={backFile}></Image>
              </View>
              <Text>反面（人像面）</Text>
            </View>
          </View>
          <View className='file_display'>
            <Text className='photo'>资质证明</Text>
            <View className='display'>
              <View onClick={()=>addFile("prove")}>
                <Image src={proveFiles[0]}></Image>
              </View>
            </View>
          </View>
        </View>
        <View  className={page[1] ? "f_box" : "next"}>
            {
              questions.map((item,index)=>
                <View key={index} className='Form_i'>
                  <Text>{item.question}</Text>
                  <Textarea
                  value={item.answer}
                  onInput={(evt) => handleAnswerChange(index, evt)}
                  />
                </View>
              )
            }
        </View>
        {/* {Taro.getStorageSync('submit')?'': */}
        <View className="Form_i">
          {
            page[1] &&
            <AtButton type="primary" onClick={lastForm} size="normal">
              上一页
            </AtButton>
          }
          <AtButton type="primary" onClick={page[0] ? nextForm : register} size="normal">
            {page[0] && "下一页"}
            {page[1] && "提交"}
          </AtButton>
        </View>
        {/* 地址选择器 */}
        {showPicker && (
          <AddressPicker
            withCity={true}
            address={address}
            onPick={onPickerChange}
            onAConfirm={onAConfirm}
          />
          )}
        {/* } */}
      </View>

      {/*  {Taro.getStorageSync('submit')&&(
            <View className='status'>
              {status <= 2
              ?<Image src='https://s2.loli.net/2023/07/13/guH2r1Ls8a9MXAP.png' className='statusImage'></Image>
              :<Image src='https://s2.loli.net/2023/07/12/MQxoNHPhKUGTlXZ.png' className='statusImage'></Image>}
              <View className='status-text' style={{color: status<=2?'#f4bb2a':'#e16531'}}>{generateText()}</View>
            </View>
          )} */}
    </>
  )
}

const Card = (props) => {
  const { time = '', place = '', duty = '', onCardChange } = props;
  
  return(
    <>
      <View className='card'>
        <View className='time'>
          <AtInput
            name="time"
            title="时间"
            type="text"
            placeholder="时间"
            value={time}
            onChange={(value) => onCardChange('time', value as string)}
          />
        </View>
        <View className='place'>
          <AtInput
            name="place"
            title="地点"
            type="text"
            placeholder="地点"
            value={place}
            onChange={(value) => onCardChange('place', value as string)}
          />
        </View>
        <View className='duty'>
          <AtInput
            name="duty"
            title="职务"
            type="text"
            placeholder="职务"
            value={duty}
            onChange={(value) => onCardChange('duty', value as string)}
          />
        </View>
      </View>
    </>
  )
}


export default App