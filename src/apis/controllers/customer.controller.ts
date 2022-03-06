import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  generateVerifyEmailToken,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
  sendMail,
} from '../../utils/';
import {
  registerCustomer,
  editCustomerProfile,
  updateCustomer,
  removeCustomer,
} from '../../services';
import ApiError from '../../utils/api-error';
import { Prisma, PrismaClient, Customer } from '@prisma/client';
import { signJWT } from '../../utils';
import env from '../../configs/env';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const customers = await prisma.customer.findMany({});
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  return res.status(httpStatus.OK).json({
    message: 'get all list blog categories successfully',
    success: true,
    data: {
      data: customers.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: customers.length,
    },
  });
});

const signUp = catchAsync(async (req: Request, res: Response) => {
  const customerData = { ...req.body };
  const newCustomer = await registerCustomer(customerData);
  if (!newCustomer) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'something went wrong when create customer'
    );
  }
  return res.status(httpStatus.CREATED).json({
    message: 'create customer successfully',
    success: true,
  });
});

// send mail verify account after create
const sendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email, id } = req.user as Customer;

    const verifyEmailToken = generateVerifyEmailToken({
      id: id,
      name: email,
    });
    const subject = 'Xác thực tài khoản';
    let confirmationUrl = env.feUrl + `/verify-email/${verifyEmailToken}`;
    const text = `Click vào link sau để xác thực tài khoản: ${confirmationUrl}`;
    await sendMail(email, subject, text);
    return res.status(httpStatus.OK).json({
      message: 'email sent successfully',
    });
  }
);

const logIn = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as Customer;
  if (user!.status) {
    const token = signJWT(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
      env.passport.jwtAccessExpired as string
    );
    return res.status(200).json({ ...user, token });
  }
  return res.status(httpStatus.UNAUTHORIZED).json({
    message: 'Có lỗi không cấp quyền đăng nhập được hoặc tài khoản bị khóa',
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const customer = await prisma.customer.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  if (!customer) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one customer failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one customer successfully',
    data: customer,
    success: true,
  });
});
// editCustomerProfile,
//   updateCustomer,
//   removeCustomer,
const update = catchAsync(async (req: Request, res: Response) => {
  const customer = await editCustomerProfile(+req.params.id, req.body);
  if (!customer) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Update customer failed',
      success: false,
    });
  }
  const token = signJWT(
    {
      userId: customer.id,
      email: customer.email,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
    },
    env.passport.jwtAccessExpired as string
  );
  return res.status(httpStatus.OK).json({
    message: 'update blog category successfully',
    success: true,
    token,
  });
});

const updateCustomerByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const customer = await updateCustomer(+req.params.id, req.body);
    if (!customer) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Update customer failed',
        success: false,
      });
    }
    return res.status(httpStatus.OK).json({
      message: 'update blog category successfully',
      success: true,
      data: customer,
    });
  }
);

const remove = catchAsync(async (req: Request, res: Response) => {
  const customer = await prisma.customer.delete({
    where: { id: +req.params.id },
  });
  if (!customer) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'delete customer failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'delete customer successfully',
    success: true,
  });
});

// const sendVerificationEmail = catchAsync(
//   async (req: Request, res: Response) => {
//     const { email, id } = req.user as User;

//     const verifyEmailToken = generateVerifyEmailToken({
//       id: id,
//       name: email,
//     });
//     const subject = 'Xác thực tài khoản';
//     let confirmationUrl = env.feUrl + `/verify-email/${verifyEmailToken}`;
//     const text = `Click vào link sau để xác thực tài khoản: ${confirmationUrl}`;
//     await sendMail(email, subject, text);
//     return res.status(httpStatus.OK).json({
//       message: 'email sent successfully',
//     });
//   }
// );

export { index, update, remove, show, signUp, updateCustomerByAdmin };
