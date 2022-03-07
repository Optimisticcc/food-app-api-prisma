import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/';
import {
  addUser,
  updateUser,
  softDeleteUser,
  isEmailOrPhoneNumberExists,
  getUserByID,
  findManyUsers,
} from '../../services/';

import { generateVerifyEmailToken } from '../../utils/';
import ApiError from '../../utils/api-error';

import { sendMail } from '../../utils/';

import { UpdateUserInput } from '../../interfaces/';
import {
  findPermision,
  deleteUserPermision,
  deletePermision,
  addPermisionForUser,
  getPermisionById,
  createPermision,
  getPermisionDetailOfUser,
  getPermisionOfUser,
  createPermisionDetail,
  updatePermisionDetail,
} from '../../services/user/userPer';

import env from '../../configs/env';

// const softDeleteUserByAdmin = catchAsync(
//   async (req: Request, res: Response) => {
//     await validate(schemas.idArrSchema, req.body);
//     try {
//       await softDeleteUser(req.body.id);
//       return res.status(httpStatus.OK).json({
//         message: 'delete user successfully',
//       });
//     } catch (e: any) {
//       throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
//     }
//   }
// );

// const createUserProfileByAdmin = catchAsync(
//   async (req: Request, res: Response) => {
//     await validate(userSchema.addUserInput, req.body);
//     await isEmailOrPhoneNumberExists(req.body?.email, req.body?.phoneNumber);
//     const user = await addUser(req.body);

//     // send email verify for user
//     const verifyEmailToken = generateVerifyEmailToken({
//       id: user.id,
//       name: user.email,
//     });
//     const subject = 'Xác thực tài khoản';
//     let confirmationUrl = env.feUrl + `/verify-email/${verifyEmailToken}`;
//     const text = `Click vào link sau để xác thực tài khoản: ${confirmationUrl}`;
//     await sendMail(user.email, subject, text);

//     // return
//     return res.status(httpStatus.CREATED).json({
//       message: 'add user successfully, please verify email before login',
//       data: user,
//     });
//   }
// );

// const updateUserProfileByAdmin = catchAsync(
//   async (req: Request, res: Response) => {
//     const args: UpdateUserInput = { ...req.body };
//     const user = await updateUser(+req.params?.id, args);
//     return res.status(httpStatus.OK).json({
//       message: 'update user successfully',
//       data: user,
//     });
//   }
// );

// const createRoleHandler = catchAsync(async (req: Request, res: Response) => {
//   await validate(roleSchema.createRole, req.body);
//   console.log(req.body);
//   const role = await createRole(req.body);

//   return res.status(httpStatus.CREATED).json({
//     message: 'create role successfully',
//     data: role,
//   });
// });

// const addRoleForUserHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     await validate(roleSchema.addRoleForUser, req.body);
//     const userID = req.body.userId as number;
//     const arrRoleIds: number[] = req.body.roleIds.map((i: string) => Number(i));

//     const user = await getUserByID(+userID);
//     if (!user) {
//       throw new ApiError(
//         httpStatus.NOT_FOUND,
//         `not found user with id = ${userID}`
//       );
//     }

//     const userRole = await getRolesOfUser(+userID);
//     const userRoleId: number[] = userRole.map((role) => role.id);
//     const roleAdd = arrRoleIds.filter((roleId) => !userRoleId.includes(roleId));
//     const roleDelete = userRoleId.filter(
//       (roleId) => !arrRoleIds.includes(roleId)
//     );
//     await deleteUserRole(roleDelete);
//     for (let i in roleAdd) {
//       await addRoleForUser({ userID, roleID: roleAdd[i] });
//     }
//     return res.status(httpStatus.OK).json({
//       message: `add role: ${roleAdd} for user: ${user.email} successfully`,
//     });
//   }
// );

// const deleteRolesHandler = catchAsync(async (req: Request, res: Response) => {
//   await validate(roleSchema.arrayIds, req.body);
//   if (req.body.roles.length === 0) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'you must select least 1 role to delete'
//     );
//   }
//   const arrRoles: number[] = req.body.roles.map((i: string) => Number(i));
//   await deleteRoles(arrRoles);
//   return res.status(httpStatus.OK).json({
//     message: 'deleted roles successfully',
//   });
// });

// const addCatsForRoleHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     await validate(roleSchema.addCatsForRole, req.body);
//     if (req.body.catIds.length === 0) {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         'you must select least 1 category'
//       );
//     }
//     const arrCats: number[] = req.body.catIds.map((i: string) => Number(i));

//     await addCatsForRole(+req.body.role, arrCats);
//     return res.status(httpStatus.CREATED).json({
//       message: 'add roles successfully',
//     });
//   }
// );

// const getCatsOfRoleHandler = catchAsync(async (req: Request, res: Response) => {
//   await validate(schemas.idSchema, req.params);
//   const cats = await getCatsOfRole(+req.params.id);
//   return res.status(httpStatus.OK).json({
//     message: 'get category of role successfully',
//     data: cats,
//   });
// });

// const updateCatsOfRoleHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     await Promise.all([
//       validate(schemas.idSchema, req.params),
//       validate(roleSchema.updateCatsOfRole, req.body),
//     ]);
//     const arrCats: number[] = req.body.catIds.map((i: string) => Number(i));

//     await updateCatsOfRole(+req.params.id, arrCats);
//   }
// );

// const getEnableOrgHandler = catchAsync(async (req: Request, res: Response) => {
//   const organizations = await getOrg({ enabled: true });
//   return res.status(httpStatus.OK).json({
//     message: 'get enable organizations successfully',
//     data: organizations,
//   });
// });

// const getOrgsHandler = catchAsync(async (req: Request, res: Response) => {
//   const organizations = await getOrg({});
//   return res.status(httpStatus.OK).json({
//     message: 'get enable organizations successfully',
//     data: organizations,
//   });
// });

// const createOrgHandler = catchAsync(async (req: Request, res: Response) => {
//   await validate(organizationSchema.createOrg, req.body);
//   let org = req.body;
//   if (req.body.parentID) {
//     const { parentID, ...rest } = req.body;
//     org = {
//       parent: {
//         connect: { id: +parentID },
//       },
//       ...rest,
//     };
//   }
//   const createdOrg = await createOrg(org);
//   return res.status(httpStatus.CREATED).json({
//     message: 'create organization successfully',
//     data: createdOrg,
//   });
// });

// const getOrgByIdHandler = catchAsync(async (req: Request, res: Response) => {
//   await validate(schemas.idSchema, req.params);
//   const org = await getOrg({ id: +req.params.id });
//   return res.status(httpStatus.OK).json({
//     message: 'get organization info successfully',
//     data: org[0],
//   });
// });

// const editOrgHandler = catchAsync(async (req: Request, res: Response) => {
//   await Promise.all([
//     validate(schemas.idSchema, req.params),
//     validate(organizationSchema.editOrg, req.body),
//   ]);

//   let orgInfo = req.body;
//   if (orgInfo.parentID) {
//     const { parentID, ...rest } = orgInfo;
//     orgInfo = {
//       parent: {
//         connect: { id: +parentID },
//       },
//       ...rest,
//     };
//   }

//   const updatedOrg = await updateOrganization(+req.params.id, orgInfo);

//   return res.status(httpStatus.OK).json({
//     message: 'edit organization info successfully',
//     data: updatedOrg,
//   });
// });

// const getUserOfOrgHandler = catchAsync(async (req: Request, res: Response) => {
//   await validate(schemas.idSchema, req.params);
//   const users = await getUserOfOrganization(+req.params.id);
//   return res.status(httpStatus.OK).json({
//     message: 'get users of organization successfully',
//     data: users,
//   });
// });

// const getChildOrgHandler = catchAsync(async (req: Request, res: Response) => {
//   await validate(schemas.idSchema, req.params);
//   const orgs = await getOrg({ parentID: +req.params.id });
//   return res.status(httpStatus.OK).json({
//     message: 'get child organization successfully',
//     data: orgs,
//   });
// });

// const getUserProfileHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     await validate(schemas.idSchema, req.params);
//     const user = await getUserByID(+req.params.id);
//     if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
//     return res.status(httpStatus.OK).json({
//       message: 'get user profile successfully',
//       data: user,
//     });
//   }
// );

// const getAllUserHandler = catchAsync(async (req: Request, res: Response) => {
//   const { page, perPage } = req.query;
//   const pageNum = parseInt(page as string) || 1;
//   const perPageNum = parseInt(perPage as string) || 10;
//   const users = await findManyUsers({});
//   return res.status(httpStatus.OK).json({
//     message: 'get all users successfully',
//     data: {
//       data: users.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
//       length: users.length,
//     },
//   });
// });

// const getRolesHandler = catchAsync(async (req: Request, res: Response) => {
//   const roles = await findRoles({});
//   return res.status(httpStatus.OK).json({
//     message: 'get roles successfully',
//     data: roles,
//   });
// });

// const getRolesByUserIdHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     await validate(schemas.idSchema, req.params);
//     const roles = await getRolesOfUser(+req.params.id);
//     return res.status(httpStatus.OK).json({
//       message: 'get role of user successfully',
//       data: roles,
//     });
//   }
// );

// export {
//   createUserProfileByAdmin,
//   updateUserProfileByAdmin,
//   softDeleteUserByAdmin,
//   createRoleHandler,
//   addRoleForUserHandler,
//   deleteRolesHandler,
//   addCatsForRoleHandler,
//   getCatsOfRoleHandler,
//   updateCatsOfRoleHandler,
//   getEnableOrgHandler,
//   getOrgsHandler,
//   createOrgHandler,
//   getOrgByIdHandler,
//   editOrgHandler,
//   getUserOfOrgHandler,
//   getChildOrgHandler,
//   getUserProfileHandler,
//   getAllUserHandler,
//   getRolesHandler,
//   getRolesByUserIdHandler,
// };
