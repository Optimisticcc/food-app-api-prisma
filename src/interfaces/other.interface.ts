import Joi from 'joi';

export interface UserRegister {
  name: string;
  email: string;
  phoneNumber: string;
  interestedService: string;
  representer?: string;
  content?: string;
  type: string;
}

export interface UserCollaborator {
  //   idCollaborator: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  addressWork: string;
  namePresenter: string;
  phonePresenter: string;
  idBranchWork: string;
  //   resetPasswordToken?: string;
  //   resetPasswordExpires?: string;
}

export interface PreQualificationUser {
  name: string;
  email: string;
  phoneNumber: string;
  height: string;
  weight: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  healthCare: string;
  tattoo: string;
  academicLevel: string;
  levelEnglish: string;
  presenter: string;
  status: string;
  learningStatus: string;
}
