import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { View, Button,Image,Input,Text,Picker} from '@tarojs/components'
import { useEffect, useState } from 'react'
import add from '../../images/add-folder.png'
import Fetch from '../../Service/fetch'
import pic from '../../images/video-bk.png'
import folderimg from '../../images/folder.png'
import del from '../../images/delete.png';
import charge from '../../images/charge.png'
import './index.less'



const ModalInput = (props) => {
  const dictionary = [
    '未在册队员',
    '申请队员',
    '岗前培训',
    '见习队员',
    '正式队员',
    '督导老师',
    '树洞之友',
  ]
  dictionary[40] = '普通队员'
  dictionary[41] = '核心队员'
  dictionary[42] = '区域负责人'
  dictionary[43] = '组委会成员'
  dictionary[44] = '组委会主任'

  const role = [
    '岗前培训',
    '见习队员',
    '督导老师',
    '树洞之友',
    '普通队员',
    '核心队员',
    '区域负责人',
    '组委会成员',
    '组委会主任',
  ]
  const show = props.modalShow2
  const [folder,setFolder] = useState({
    foldername: props.folder ? props.folder.folder_name : '',
    roleNow: props.folder && props.folder.role ? role.indexOf(dictionary[props.folder.role]) : 0,
  })

  useEffect(() => {
    if (props.folder) {
      setFolder({
        foldername: props.folder.folder_name,
        roleNow: role.indexOf(dictionary[props.folder.role])
      })
    }
  }, [props.folder, props.role]);


  const handleShow = () => {
    props.changeShow2()
    setFolder({
      foldername:'',
      roleNow: 0
    })
  }

  const onSaveFolder = () => {
    if (folder.foldername) {
      const apiPath = props.folder ? '/file/editfolder' : '/file/addfolder'
      const requestData = {
        folder_name: folder.foldername,
        role: dictionary.indexOf(role[folder.roleNow]),
      }

      if (props.folder) {
        requestData.folder_id = props.folder.id // 如果是更新操作，传递文件夹ID
      }

      Fetch(apiPath, requestData, 'POST').then((res) => {
        if (res.code == 200) {
          props.changeShow2()
          props.getFolder(true)
          setFolder({
            foldername:'',
            roleNow: 0
          })
        }
      })
    } else {
      Taro.showToast({
        title: '请填写文件夹名称!',
        icon: 'error',
        duration: 2000,
      })
    }
  }

  const handleInput = (e) => {
    setFolder((prevFolder) => ({
      ...prevFolder,
      foldername: e.detail.value,
    }));
  }

  const onChange = (e) => {
    setFolder((prevFolder) => ({
      ...prevFolder,
      roleNow: e.detail.value,
    }));
  }

  return (
    <View className='Modal' style={{ display: show ? 'block' : 'none' }} id='modal'>
      <View className='Modal_bg'></View>
      <View className='show'>
        <View className='top'>
          <Input
            placeholder='输入文件夹名称'
            value={folder.foldername}
            onInput={(e) => handleInput(e)}
          />
          <View className='v_role'>
            <View className='role_now' style={{ marginRight: 20 }}>
              {dictionary[dictionary.indexOf(role[folder.roleNow])]}
            </View>
            <Picker
              className='picker'
              mode='selector'
              range={role}
              onChange={(e) => onChange(e)}
            >
              <View className='change'>选择可见身份</View>
            </Picker>
          </View>
        </View>
        <View className='flex row'>
          <Button className='button noborder' onClick={onSaveFolder}>
            确定
          </Button>
          <Button className='button' onClick={handleShow}>
            取消
          </Button>
        </View>
      </View>
    </View>
  )
}


const Modal = (props)=>{

    const show= props.modalShow1
    const id = props.folderid

    function handleShow ()
    {
        props.changeShow1()
    }

    function ondeleteFolder(){
        Fetch(
            '/file/deletefolder',
            {
                "folder_id": id
            },
            'POST'
        ).then(
            res=>{
                console.log(res)
                if(res.code==200)
                { Taro.showToast({
                        title:'删除成功!',
                        icon:'success'
                    })
                    props.changeShow1()
                    props.getFolder(true)
                }
                else if(res.code==400)
                {
                    Taro.showToast({
                        title:res.msg,
                        icon:'none'
                    })
                    props.changeShow1()
                }
                else{
                    Taro.showToast({
                        title:'删除失败,请稍后再试',
                        icon:'error'
                    })
                    props.changeShow1()
                }
            }
        )
    }

    return(

        <>
        <View className='Modal' style={{display:show?'block':'none'}} id='modal'>
            <View className='Modal_bg'></View>
            <View className='show'>
                <View className='top'>
                    <Text>确定删除吗?</Text>
                </View>
                <View className='flex row'>
                    {/* <Button onClick={getInfo}>获取个人信息</Button> */}
                    <Button className='button' onClick={ondeleteFolder}>确定</Button>
                    <Button className='button' onClick={handleShow}>取消</Button>
                </View>
            </View>
        </View>

        </>
    )
}

const Video = ()=>{
    
    const [folder,setFolder] = useState([])
    const [modalShow1,setModalshow1] = useState(false)
    const [modalShow2,setModalshow2] = useState(false)
    const [page,setPage] = useState(0)
    const [folderid,setFolderid] = useState()
    const [selectedFolder, setSelectedFolder] = useState(null)

    useEffect(()=>{
        getFolder(false);//page初始为0 n应为false
        Fetch(
            '/role/checkManagerRole',
            {},
            'POST'
        ).then(res=>{
            console.log('vedio charge',res);
            if (res.data.managerRoles[1].status) {
                console.log('viewing status',res.data.managerRoles[1].status);
                Taro.setStorageSync('system',res.data.managerRoles[0].status)
                Taro.setStorageSync('viewing',res.data.managerRoles[1].status)
            }
        })
    },[])

    const getFolder = (n)=>{
        console.log('n',n);
        
        Fetch(
            '/file/getfolder',
            {
                "page": n?1:page+1,
                "page_size":10
            },
            'POST'
        ).then(
            res=>{
                console.log('get folder',res.data)
                if(!n&&res.data.folder)
                {  
                    setFolder(folder.concat(res.data.folder))
                    setPage(page+1)
                }
                else if(n)
                {
                    setFolder(res.data.folder)
                    setPage(1)
                }
                else
                    Taro.showToast({
                        title:'到底了!',
                        icon:'none'
                    })
            }
        )
    }

   usePullDownRefresh(()=>{
    getFolder(true);
    setTimeout(()=>{
        Taro.stopPullDownRefresh()
    },1000)
    
    })

    useReachBottom(()=>{
        getFolder(false);
    })

    const toVideoInfor = (id)=>{
        Taro.navigateTo({
            url:  `/moduleC/pages/VideoList/index?id=${id}`
        })

    }
    
    const tocreate = () => {
        setSelectedFolder(null) // 新建时清空选中的文件夹信息
        changeShow2()
      }

    function changeShow1()
    {
        setModalshow1(!modalShow1)
        //console.log('change' + modalShow)
    }

    function changeShow2()
    {
        setModalshow2(!modalShow2)
        //console.log('change' + modalShow)
    }

    function handeldelete(id){//删除文件夹
        setFolderid(id);
        changeShow1();
    }

    const handleCharge = async (id) => {
        const selected = folder.find((item) => item.id === id)
        console.log('selected',selected);
        
        setFolderid(id)
        setSelectedFolder(selected) // 设置选中的文件夹信息
        changeShow2()
      }

    return (
        <>
            <Modal modalShow1={modalShow1} folderid={folderid} changeShow1={changeShow1} handeldelete={handeldelete} getFolder={getFolder} />
            <ModalInput modalShow2={modalShow2} changeShow2={changeShow2} getFolder={getFolder} folder={selectedFolder} role={folder}/>
            <View className='video'>
                <View className='v-top'>
                    <View className='pic'>
                        <Image src={pic} />
                    </View>
                {(Taro.getStorageSync('role')>=44 || Taro.getStorageSync('viewing') || Taro.getStorageSync('system')) ?
                    <View className='create'onClick={tocreate}>
                        <Image src={add} />
                        <View className='text'>新建文件夹</View>
                    </View>:''
                }
                </View>
                <View className='v-list'>
                    {folder && folder.map((item)=>{
                        const userRole = Taro.getStorageSync('role');
                        const userStatus = Taro.getStorageSync('viewing');
                        const isVisible = (item.role == userRole) || userStatus;
                        return (
                            isVisible ?//判断文件夹是否可见
                            <View className='v-item' key={item.id} >
                                <View className='icon' onClick={()=>toVideoInfor(item.id)}><Image src={folderimg} /></View>
                                <View className='theme' onClick={()=>toVideoInfor(item.id)}>{item.folder_name}</View>
                                <View className='f-del' onClick={()=>handeldelete(item.id)}>
                                    <Image src={del} />
                                </View>
                                <View style={{display:Taro.getStorageSync('viewing')?'':'none'}} className='charge' onClick={()=>handleCharge(item.id)}>
                                    <Image src={charge}></Image>
                                </View>
                            </View>:''
                        )
                    })}
                    
                </View>
            </View>
            
        </>
    )
}
export default Video;