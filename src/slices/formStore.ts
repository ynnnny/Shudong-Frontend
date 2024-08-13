import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';

const formSlice = createSlice({
  name: 'form',
  initialState:{
    name: '',
    tel: Taro.getStorageSync('tel') || '',
    dateSel: '1990-1-1',
    email: '',
    sex: ['男', '女'], // 0:男 1:女
    sexSelected: 0,
    address: '-',
    showPicker: false,
    status: 0,
    politicalOutlook: '',
    nation: '',
    number: '',
    degree: '',
    speciality: '',
    native: '',
    work: '',
    otherWork: '',
    history: {
      medicine: '',
      therapy: '',
      drug: '',
    },
    card: [{ time: '', place: '', duty: '' }],
    frontFile: 'https://s2.loli.net/2024/07/31/pYh4fxzQ8Rneua7.png',
    backFile: 'https://s2.loli.net/2024/07/31/pYh4fxzQ8Rneua7.png',
    proveFiles: ['https://s2.loli.net/2024/07/31/pYh4fxzQ8Rneua7.png'], // 初始化为空数组,
    questions: [{
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
    }]
  },
  reducers: {
    setFormField<K extends keyof FormState>(state, action: PayloadAction<{ field: K; value: FormState[K] }>) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setHistoryField(state, action: PayloadAction<{ field: keyof FormState['history']; value: string }>) {
      const { field, value } = action.payload;
      state.history[field] = value;
    },
    setCardField(state, action: PayloadAction<{ index: number; field: keyof FormState['card'][number]; value: string }>) {
      const { index, field, value } = action.payload;
      state.card[index][field] = value;
    },
    addCard(state) {
      state.card.push({ time: '', place: '', duty: '' });
    },
    setFrontFile(state, action: PayloadAction<string | undefined>) {
      state.frontFile = action.payload || '';
    },
    setBackFile(state, action: PayloadAction<string | undefined>) {
      state.backFile = action.payload || '';
    },
    setProveFiles(state, action: PayloadAction<string[]>) {
      state.proveFiles = action.payload;
    },
    addProveFile(state, action: PayloadAction<string>) {
      state.proveFiles.push(action.payload);
    },
    setQuestionField(state, action: PayloadAction<{ index: number; field: keyof FormState['questions'][number]; value: string }>) {
      const { index, field, value } = action.payload;
      state.questions[index][field] = value;
    },
  },
});

export const { setFormField, setHistoryField, setCardField, addCard, setFrontFile, setBackFile, setProveFiles, addProveFile, setQuestionField } = formSlice.actions;

const store = configureStore({
  reducer: {
    form: formSlice.reducer,
  },
});

export interface RootState {
  form: FormState;
}

export default store;
