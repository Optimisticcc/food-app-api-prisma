import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/';
import { validate, schemas } from '../../validation';
import * as ExcelJS from "exceljs";
import {
  addPreQualificationUserSv,
  addUserCollaboratorSv,
  addUserRegisterSv,
  createImage,
  deletePreQualificationUserArr,
  deleteUserCollaboratorArr,
  deleteUserRegisterArr,
  filterUserRegister,
  getAllPreQualificationUserSv,
  getAllUserCollaboratorByBranchWork,
  getAllUserCollaboratorSv,
  getAllUserRegisterSv,
  getPreQualificationUserByID,
  getUserCollaboratorByID,
  getUserRegisterByID,
  updateImage,
  getOneCollaborator,
  getOnePreQualificationUser,
  findAllPosts,
  filterUserCollaborator,
  getAllUserRegisterToExportExcel,
  getAllUserCollaboratorToExportExcel,
  getAllUserPrequalificationToExportExcel, getUserCollaboratorByIdCollaborator, connectUserRegisterToUserCollaborator,
} from '../../services';
import {} from '../../interfaces/';
import ApiError from '../../utils/api-error';

// loc theo type user register
const filterUserRegistrationByType = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.typeSchema, req.body);
    const userRegister = await filterUserRegister({
      type: req.body.type,
    });
    return res.status(httpStatus.OK).json({
      data: {
        userRegister: userRegister,
        success: true,
        message: 'get all user register by type successfully',
      },
    });
  }
);

// loc theo type user register and date from to
const filterUserRegistrationByTypeAndDate = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.typeDateSchema, req.body);
    const userRegister = await filterUserRegister({
      type: req.body.type,
      createdAt: {
        gte: req.body.timeStart,
        lt: req.body.timeEnd,
      },
    });
    return res.status(httpStatus.OK).json({
      data: {
        userRegister: userRegister,
        success: true,
        message: 'get all user register by type successfully',
      },
    });
  }
);
// const getAll
const getAllUserRegister = catchAsync(async (req: Request, res: Response) => {
  const userRegisters = await getAllUserRegisterSv();
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  return res.status(httpStatus.OK).json({
    data: {
      data: {
        data: userRegisters.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
        length: userRegisters.length,
      },
      success: true,
      message: 'get all user register successfully',
    },
  });
});
// const add
const addUserRegister = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.addUserRegisterSchema, req.body);
  const userRegister = await addUserRegisterSv(req.body);
  if (req.body.representer !== 'Không'){
      const collaborator = await getUserCollaboratorByIdCollaborator(req.body.representer)
      if (!collaborator){
        return res.status(httpStatus.BAD_REQUEST).json({
          data: {
            success: false,
            message: 'add user register failed because idPresenter not found',
          },
        });
      }else{
         await connectUserRegisterToUserCollaborator(collaborator.id,userRegister.id)
      }
    }
  return res.status(httpStatus.CREATED).json({
    data: {
      userRegister: userRegister,
      success: true,
      message: 'add user register successfully',
    },
  });
});
const getUserRegister = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  const userRegister = await getUserRegisterByID(
    req.params.id as unknown as number
  );
  return res.status(httpStatus.OK).json({
    data: {
      userRegister: userRegister,
      success: true,
      message: 'get user register by id successfully',
    },
  });
});
// filterUserCollaborator
const getUserRegisterFilter = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.filterUserRegisterSchema, req.body);
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  const userRegisters = await filterUserRegister(
    req.body
  );
  return res.status(httpStatus.OK).json({
    data: {
      success: true,
      message: 'get user register by id successfully',
        data: userRegisters.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
        length: userRegisters.length,
      },
  });
});

const getUserCollaboratorFilter = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.filterUserCollaboratorSchema, req.body);
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  const userCollaborators = await filterUserCollaborator(
    req.body
  );
  return res.status(httpStatus.OK).json({
    data: {
      success: true,
      message: 'get user register by id successfully',
      data: {
        data: userCollaborators.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
        length: userCollaborators.length,
      },
    },
  });
});

const deleteUserRegister = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idArrSchema, req.body);
  await deleteUserRegisterArr(req.body);
  return res.status(httpStatus.OK).json({
    data: {
      success: true,
      message: 'delete user register successfully',
    },
  });
});


const getAllUserCollaborator = catchAsync(
  async (req: Request, res: Response) => {
    const userCollaborator = await getAllUserCollaboratorSv();
    const { page, perPage } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const perPageNum = parseInt(perPage as string) || 20;
    return res.status(httpStatus.OK).json({
      data: {
        data: {
          data: userCollaborator.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
          length: userCollaborator.length,
        },
        success: true,
        message: 'get all user Collaborator successfully',
      },
    });
  }
);
// const add
const addUserCollaborator = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.addUserCollaboratorSchema, req.body);
  const isExist = await getOneCollaborator(req.body.email,req.body.phoneNumber);
  if (isExist){
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'already exist phone number or email',
    })
  }
  const userCollab = await getAllUserCollaboratorByBranchWork(
    req.body.idBranchWork
  );
  const userCollaborator = await addUserCollaboratorSv(
    req.body,
    userCollab === undefined ? 0 : userCollab.length + 1
  );
  return res.status(httpStatus.CREATED).json({
    data: {
      userCollaborator: userCollaborator,
      success: true,
      message: 'add user Collaborator successfully',
    },
  });
});
const getUserCollaborator = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  const userCollaborator = await getUserCollaboratorByID(
    req.params.id as unknown as number
  );
  return res.status(httpStatus.OK).json({
    data: {
      userCollaborator: userCollaborator,
      success: true,
      message: 'get user Collaborator by id successfully',
    },
  });
});

const deleteUserCollaborator = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.idArrSchema, req.body);
    await deleteUserCollaboratorArr(req.body);
    return res.status(httpStatus.OK).json({
      data: {
        success: true,
        message: 'delete user Collaborator successfully',
      },
    });
  }
);

const getAllPreQualificationUser = catchAsync(
  async (req: Request, res: Response) => {
    const userPreQualifications = await getAllPreQualificationUserSv();
    return res.status(httpStatus.OK).json({
      data: {
        userPreQualifications: userPreQualifications,
        success: true,
        message: 'get all user PreQualification successfully',
      },
    });
  }
);

const getPreQualificationUser = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.idSchema, req.params);
    const userPreQualification = await getPreQualificationUserByID(
      req.params.id as unknown as number
    );
    return res.status(httpStatus.OK).json({
      data: {
        userPreQualification: userPreQualification,
        success: true,
        message: 'get user PreQualification by id successfully',
      },
    });
  }
);

// const add
const addPreQualificationUser = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.addPreQualificationUserSchema, req.body);
    const isExist = await getOnePreQualificationUser(req.body.email,req.body.phoneNumber)
    const userPreQualification = await addPreQualificationUserSv(req.body);
    return res.status(httpStatus.CREATED).json({
      data: {
        userPreQualification: userPreQualification,
        success: true,
        message: 'add user PreQualification successfully',
      },
    });
  }
);

const deletePreQualificationUser = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.idArrSchema, req.body);
    await deletePreQualificationUserArr(req.body);
    return res.status(httpStatus.OK).json({
      data: {
        success: true,
        message: 'delete user PreQualification successfully',
      },
    });
  }
);

const uploadImageHandler = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.uploadImage, req.body);
  const fileName = req.file?.filename;
  if (fileName === undefined)
    throw new ApiError(httpStatus.BAD_REQUEST, 'image is undefined');

  const basePath = '/public/images/';
  const image = `${basePath}${fileName}`;
  const imageCreated = await createImage({ ...req.body, link: image });

  return res.status(httpStatus.CREATED).json({
    success: true,
    message: 'create image successfully',
    data: imageCreated,
  });
});

const editImageHandler = catchAsync(async (req: Request, res: Response) => {
  await Promise.all([
    validate(schemas.idSchema, req.params),
    validate(schemas.editImage, req.body),
  ]);

  let link = '';
  if (req.file !== undefined) {
    const fileName = req.file.filename
    const basePath = '/public/images/';
    link = `${basePath}${fileName}`;
  }
  let update: Prisma.ImageUpdateInput
  if(link) {
    update = {
      ...req.body,
      link
    }
  } else {
    update = {...req.body}
  }
  try {
  const updated = await updateImage(+req.params.id, update)
    return res.status(httpStatus.OK).json({
      message: 'updated image info successfully',
      data: updated
    })
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message)
  }
});

const exportExcelUserRegister = catchAsync(async (req: Request, res: Response) => {
  let workbook = new ExcelJS.Workbook();
  let worksheet = workbook.addWorksheet("UserRegister");
  const data = await getAllUserRegisterToExportExcel();
  worksheet.columns = [
    { header: "Id", key: "id", width: 5 },
    { header: "Name", key: "name", width: 15 },
    { header: "Birthday", key: "dateOfBirth", width: 15 },
    { header: "Email", key: "email", width: 15 },
    { header: "PhoneNumber", key: "phoneNumber", width: 15 },
    { header: "InterestedService", key: "interestedService", width: 15 },
    { header: "Content", key: "content", width: 15 },
    { header: "Address", key: "address", width: 15 },
  ];

// Add Array Rows
  worksheet.addRows(data);

// res is a Stream object
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "UserRegister.xlsx"
  );

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
})

const exportExcelUserCollaborator = catchAsync(async (req: Request, res: Response) => {
  let workbook = new ExcelJS.Workbook();
  let worksheet = workbook.addWorksheet("UserRegister");
  const data = await getAllUserCollaboratorToExportExcel();
  worksheet.columns = [
    { header: "Id", key: "id", width: 5 },
    { header: "IdCollaborator", key: "idCollaborator", width: 15 },
    { header: "Name", key: "name", width: 15 },
    { header: "Email", key: "email", width: 15 },
    { header: "PhoneNumber", key: "phoneNumber", width: 15 },
    { header: "Address", key: "address", width: 15 },
    { header: "NamePresenter", key: "namePresenter", width: 15 },
    { header: "PhonePresenter", key: "phonePresenter", width: 15 },
    { header: "AddressWork", key: "addressWork", width: 15 },
    { header: "IdBranchWork", key: "idBranchWork", width: 15 },
  ];

// Add Array Rows
  worksheet.addRows(data);

// res is a Stream object
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "UserCollaborator.xlsx"
  );

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
})

const exportExcelUserPrequalification = catchAsync(async (req: Request, res: Response) => {
  let workbook = new ExcelJS.Workbook();
  let worksheet = workbook.addWorksheet("UserRegister");
  const data = await getAllUserPrequalificationToExportExcel();

  worksheet.columns = [
    { header: "Id", key: "id", width: 5 },
    { header: "Name", key: "name", width: 15 },
    { header: "Gender", key: "gender", width: 15 },
    { header: "Email", key: "email", width: 15 },
    { header: "PhoneNumber", key: "phoneNumber", width: 15 },
    { header: "Height", key: "height", width: 15 },
    { header: "Weight", key: "weight", width: 15 },
    { header: "DateOfBirth", key: "dateOfBirth", width: 15 },
    { header: "Address", key: "address", width: 15 },
    { header: "HealthCare", key: "healthCare", width: 15 },
    { header: "Tattoo", key: "tattoo", width: 15 },
    { header: "AcademicLevel", key: "academicLevel", width: 15 },
    { header: "LevelEnglish", key: "levelEnglish", width: 15 },
    { header: "Presenter", key: "presenter", width: 15 },
    { header: "LearningStatus", key: "learningStatus", width: 15 },
    { header: "Status", key: "status", width: 15 },
  ];

// Add Array Rows
  worksheet.addRows(data);

// res is a Stream object
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "UserPrequalification.xlsx"
  );

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
})
export {
  addUserRegister,
  getAllUserRegister,
  getUserRegister,
  deleteUserRegister,
  getAllUserCollaborator,
  addUserCollaborator,
  getUserCollaborator,
  deleteUserCollaborator,
  getAllPreQualificationUser,
  getPreQualificationUser,
  deletePreQualificationUser,
  addPreQualificationUser,
  uploadImageHandler,
  filterUserRegistrationByTypeAndDate,
  filterUserRegistrationByType,
  editImageHandler,
  getUserRegisterFilter,
  getUserCollaboratorFilter,
  exportExcelUserRegister,
  exportExcelUserCollaborator,
  exportExcelUserPrequalification
};
