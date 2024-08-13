import {
  RescueProcess,
  RescueTargetInfoType,
  SingleRescueInfo,
  User,
} from '../Service/fetchTypes'

export type rescueInfoSliceType = {
  eventID: number
  targetID: number
  rescueInfo: SingleRescueInfo
  targetInfo: RescueTargetInfoType
  process: RescueProcess[]
  signUrls: string[]
}

export type rescueInfoByIDSliceType = {
  page: number
  data: SingleRescueInfo[]
  ID: number
  targetInfo: RescueTargetInfoType
}

export type myInfoSliceType = {
  myRescueTarget: RescueTargetInfoType[]
  myInfo: User
  unclaimedRescueInfo: SingleRescueInfo[]
  claimedRescueInfo: SingleRescueInfo[]
  claimedPage: number
  unclaimedPage: number
}

export type FormType = {
  name: string;
  tel: string;
  dateSel: string;
  email: string;
  sex: Array<string>;
  sexSelected: number;
  address: string;
  showPicker: boolean;
  status: number;
  politicalOutlook: string;
  nation: string;
  number: string;
  degree: string;
  speciality: string;
  native: string;
  work: string;
  otherWork: string;
  history: {
    medicine: string;
    therapy: string;
    drug: string;
  };
  card: Array<{
    time: string;
    place: string;
    duty: string;
  }>;
  frontFile: string; // 身份证正面文件
  backFile: string;  // 身份证反面文件
  proveFiles: Array<string>; // 证明文件
  questions: Array<{
    question: string,
    answer: string
  }>;
}