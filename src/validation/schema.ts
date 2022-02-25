import Joi from 'joi';

export const schemas = {
  idSchema: Joi.object().keys({
    id: Joi.string().required(),
  }),
  searchByTag: Joi.object().keys({
    tag: Joi.string().required(),
  }),
  search: Joi.object().keys({
    q: Joi.string().required(),
    categoryId: Joi.number().required(),
  }),
  searchPublicPost: Joi.object().keys({
    q: Joi.string().required(),
  }),
  typeDateSchema: Joi.object().keys({
    type: Joi.string().required(),
    timeStart: Joi.date().required(),
    timeEnd: Joi.date().required(),
  }),
  typeSchema: Joi.object().keys({
    type: Joi.string().required(),
  }),
  idArrSchema: Joi.object().keys({
    id: Joi.array().items(Joi.number()).required(),
  }),
  addUserRegisterSchema: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string(),
    phoneNumber: Joi.string().required(),
    interestedService: Joi.string(),
    representer: Joi.string(),
    content: Joi.string(),
    type: Joi.string(),
    dateOfBirth: Joi.string(),
    address: Joi.string(),
  }),
  filterUserRegisterSchema: Joi.object().keys({
    interestedService: Joi.string(),
    type: Joi.string(),
    })
  ,
  filterUserCollaboratorSchema: Joi.object().keys({
    namePresenter: Joi.string(),
    addressWork: Joi.string(),
  })
  ,
  addUserCollaboratorSchema: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string()
      .regex(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
    phoneNumber: Joi.string()
      .regex(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)
      .required(),
    address: Joi.string().required(),
    addressWork: Joi.string().required(),
    namePresenter: Joi.string().required(),
    phonePresenter: Joi.string()
      .regex(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)
      .required(),
    idBranchWork: Joi.string().required(),
  }),
  addPreQualificationUserSchema: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    height: Joi.string().required(),
    weight: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    address: Joi.string().required(),
    gender: Joi.string().valid('Nam', 'Nữ', 'Khác').required(),
    healthCare: Joi.string().valid("Tốt", "Mắc bệnh truyền nhiễm: Viên gan B/C, HIV,…", "Khác").required(),
    tattoo: Joi.string().valid("Không có", "Nhỏ, ở vị trí kín", "Lớn, ở vị trí dễ nhận biết").required(),
    academicLevel: Joi.string().valid("THPT", "Cao đẳng", "Đại học").required(),
    levelEnglish: Joi.string().valid(
      "Chưa có chứng chỉ",
      "Tương đương Toeic 300",
      "Tương đương Toeic 450 trở lên",
    ).required(),
    presenter: Joi.string().required(),
    status: Joi.string()
      .valid('Đang xét duyệt', 'Trúng tuyển', 'Không trúng tuyển')
      .required(),
    learningStatus: Joi.string().required(),
  }),
  uploadImage: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    data: Joi.string(),
  }),
  getConfigsByType: Joi.object().keys({
    type: Joi.string().required(),
  }),
  getConfigsBySection: Joi.object().keys({
    section: Joi.string().required(),
  }),
  getConfigsBySectionType: Joi.object().keys({
    section: Joi.string().required(),
    type: Joi.string().required(),
  }),
  filterConfigs: Joi.object().keys({
    section: Joi.string(),
    type: Joi.string(),
    page: Joi.string(),
    key: Joi.string(),
  }),
  addConfig: Joi.object().keys({
    type: Joi.string().required(),
    section: Joi.string().required(),
    page: Joi.string().required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
    active: Joi.boolean(),
    description: Joi.string(),
    images: Joi.array().items(Joi.string()),
  }),
  editConfig: Joi.object().keys({
    page: Joi.string(),
    type: Joi.string(),
    key: Joi.string(),
    value: Joi.string(),
    section: Joi.string(),
    active: Joi.boolean(),
    description: Joi.string(),
    images: Joi.array().items(Joi.string()),
  }),
  editImage: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    data: Joi.string(),
  }),
};
