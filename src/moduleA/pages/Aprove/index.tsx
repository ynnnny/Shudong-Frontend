import { useEffect, useState } from 'react'
import { View,Button, Text, Image} from '@tarojs/components'
import Taro,{useReady, getCurrentInstance} from '@tarojs/taro'
import './index.less'
import Fetch from '../../../Service/fetch'

const Aprove=()=>{
    const [role,setRole] = useState()

    useEffect(()=>{
        getForm()
    },[])

    const getForm = () =>{
        Fetch(
            '/application/form',
            {},
            'POST',
            apitoken
        ).then(res =>{
            console.log('getform',res.data.application_form);
            if(res.data.application_form){
                
                setData(res.data.application_form);
                setQuestions(prev => {
                    return prev.map((item, index) => {
                        if (index === res.data.application_form.answers.index) {
                            return {
                                ...item,
                                answer: res.data.application_form.answers.answer
                            };
                        }
                        return item;
                    });
                });
                
            }
        })
    }

    useReady(()=>{
        Fetch(
            '/user/info',
            {},
            'POST'
          ).then(res => {
            console.log('info',res)
            setRole(res.data.user_info.role)
            if(res.data.user_info.role>=42)
                Fetch('/user/accesstoken',{},'post').then(ress=>{
                    setapitoken('aapitoken',ress.data.access_token)
                }).then(getForm)
          })
        const params = getCurrentInstance()
        const {id} =params.router.params
        setid(parseInt(id))
        console.log('id',id);
        
    })

    const [apitoken, setapitoken] = useState()
    const [id, setid] = useState()
    const [data, setData] = useState({
        name: '',
        sex: '',
        mobile: '',
        address: '',
        native: '',
        birthday: '',
        email: '',
        policialOutlook: '',
        nation: '',
        identificationNumber: '',
        degree: '',
        speciality: '',
        work: '',
        outWork: '',
        medicalHistory: {
            outpatientHistory: '',
            medicineHistory: '',
            medicine: '',
        },
        resumes: [{
            time:'',
            duty:'',
            place:''
        }],
        identity: {
            frontIdCard: '',
            backIdCard: '',
            files: []
        }
    });
    const [questions,setQuestions] = useState( [{
            question: "您为什么想要加入树洞救援团？",
            answer: ''
          }, {
            question: "您有心理学、危机干预或者医学的受训背景吗？",
            answer: ''
          }, {
            question: "您加入救援团的意愿度有多高，您的意愿度有多少分（0-10分）？",
            answer: ''
          }, {
            question: "您愿意参与救援方面的培训、学习、考试吗？",
            answer: ''
          }, {
            question: "您如何处理好家庭、工作、救援的关系？",
            answer: ''
          }, {
            question: "您会使用什么方法去劝阻别人自杀或者自残？",
            answer: ''
          }, {
            question: "您是如何理解“拯救生命是最高的伦理”这句话？",
            answer: ''
          }, {
            question: "如果和您对话的人自杀成功，您的想法是什么？志愿者如何面对救援的失败？",
            answer: ''
          }, {
            question: "您既往有抑郁症史等精神科类疾病吗？",
            answer: ''
          }])

    const confirm = (choice) => {
        if(role>42)//组委会
            Fetch('/application/processwithsubscribe',{
                "application_form_id": id,
                "result": choice,
                "access_token": apitoken
            },'post').then(res=>{
                if(res.code==200)
                {Taro.showToast({
                    title:'提交成功'
                })
                setTimeout(() => {
                    Taro.navigateBack()
                }, 1000);}
                else
                Taro.showToast({
                    title:'失败,稍后再试'
                })
            })
        else
            Fetch(
                '/application/process',
                {
                    "application_form_id": id,
                    "result": choice,
                },
                'POST'
            ).then(
                res=>{
                    if(res.code==200)
                    {Taro.showToast({
                        title:'提交成功'
                    })
                    setTimeout(() => {
                        Taro.navigateBack()
                    }, 1000);}
                    else
                    Taro.showToast({
                        title:'失败,稍后再试'
                    })}
            )
    }
    return (

        <>
        <View className='aprove'>
            <View className='title' style={{textAlign:'center'}}>申请队员报名表</View>
            <View className='form'>
              <View className='form-item'>
              <View className='f_item' >
                <View className='border_l'></View><View style={{width:90}}>姓名:</View>
                    <View className='data'>{data.name}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>性别:</View>
                    <View className='data'>{data.sex}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>手机号:</View>
                    <View className='data'>{data.mobile}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>地址:</View>
                    <View className='data'>{data.address}</View>
                </View>
                <View className='f_item' style={{height:'100px'}}>
                <View className='border_l'></View><View  style={{width:90,'lineHeight':'80px'}}>籍贯:</View>
                    <View className='data' style={{height: '80px'}}>{data.native}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>出生日期:</View>
                    <View className='data'>{data.birthday}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>邮箱:</View>
                    <View className='data'>{data.email}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>政治面貌:</View>
                    <View className='data'>{data.policialOutlook}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>民族:</View>
                    <View className='data'>{data.nation}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>证件号:</View>
                    <View className='data'>{data.identificationNumber}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>文化程度:</View>
                    <View className='data'>{data.degree}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>专业:</View>
                    <View className='data'>{data.speciality}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>部门职务:</View>
                    <View className='data'>{data.work}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:95}}>职务、职称:</View>
                    <View className='data'>{data.outWork}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:95}}>精神科病史:</View>
                    <View className='data'>{data.medicalHistory.outpatientHistory}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>治疗史:</View>
                    <View className='data'>{data.medicalHistory.medicineHistory}</View>
                </View>
                <View className='f_item'>
                <View className='border_l'></View><View  style={{width:90}}>现用药物:</View>
                    <View className='data'>{data.medicalHistory.medicine}</View>
                </View>
                <View className='resume'>
                    <View className='f_item'>
                        <View className='border_l'></View>
                    <View>本人主要简历：</View>
                    </View>
                    <View className='data'>
                        <View className='card'>
                            <View className='time'>时间</View>
                            <View className='place'>地点</View>
                            <View className='duty'>职务</View>
                        </View>

                        {data.resumes && data.resumes.map((item, index) => (
                        <View key={index} className='card'>
                            <View className='time'>{item.time}</View>
                            <View className='place'>{item.place}</View>
                            <View className='duty'>{item.duty}</View>
                        </View>
                        ))}
                    </View>
                </View>

            <View className='identity'>
                <View className='f_item'>
                    <View className='border_l'/><View>身份证照片</View>
                </View>
                <View className='display-container'>
                    <View className='display'>
                      <Image src={data.identity.frontIdCard}></Image>
                      <Text>正面（国徽面）</Text>
                    </View>
                    <View className='display'>
                      <Image src={data.identity.backIdCard}></Image>
                      <Text>反面（人像面）</Text>
                    </View>
                </View>
              </View>
              <View className='identity'>
                <View className='f_item'>
                    <View className='border_l'/><View>资质证明</View>
                </View>
                <View className='display'>
                    <Image src={data.identity.files[0]}></Image>
                </View>
              </View>
              <View className='question'>
                {questions.map((item, index) => (
                    <View key={index}>
                        <View className='Form_i'>
                            <View className='border_l'/>
                            <View>{item.question}</View>
                        </View>
                    <View className='data'>
                        {item.answer || '无'}
                    </View>
                </View>
                ))}
              </View>

              </View>
              <Button className='form_pass'style={{bottom:50}} onClick={()=>confirm(1)}>通过</Button>
              <Button className='form_pass' style={{backgroundColor:'rgb(255, 116, 116)',bottom:10}} onClick={()=>confirm(0)}>不通过</Button>
            </View>
        </View>
        </>
    )
}

export default Aprove;