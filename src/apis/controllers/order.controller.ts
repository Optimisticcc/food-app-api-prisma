import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import ApiError from '../../utils/api-error';
import { createOrder, filterOrder, createOrderItem } from '../../services';
import { Prisma, PrismaClient } from '@prisma/client';
import { getDiscountByCode } from '../../services';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      Customer: true,
      orderItems: true,
      user: true,
      paymentDetail: true,
      discount: true,
    },
  });

  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    data: orders.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
    totalCount: orders.length,
    totalPage: Math.ceil(orders.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
  });
});
// const skip = (pageNum - 1) * perPageNum;
// const cats = await getAllCate()
// Total page tổng page
// Page size số data 1 page
// Page no là trang số mấy
// Limit là số data 1 trang
// Skip là bỏ qua bnh dữ liệu
const filterOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await filterOrder(req.body);
  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;

  return res.status(httpStatus.OK).json({
    data: orders.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
    totalCount: orders.length,
    totalPage: Math.ceil(orders.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
    // pageNo: Math.floor(skip / perPageNum) + 1,
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: {
      id: Number(req.params.id),
    },
    include: {
      Customer: true,
      orderItems: true,
      user: true,
      paymentDetail: true,
      discount: true,
    },
  });
  if (!order) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one orders failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one orders successfully',
    data: order,
    success: true,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  if (req.body.items && req.body.items.length > 0) {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: req.body.items.map((i: any) => i.product.id),
        },
      },
      select: {
        code: true,
        id: true,
        quantity: true,
        price: true,
      },
    });
    if (products && products.length > 0) {
      let notice = '';
      let count = 0;
      for (const [index, item] of req.body.items.entries()) {
        const p = products.find((i) => i.id === item.product.id);
        if (!p) {
          count = count + 1;
          notice =
            notice +
            `Không tìm thấy sản phẩm có id bằng ${item.product.code}\n`;
        } else if (p.quantity < 1) {
          count = count + 1;
          notice = notice + `Sản phẩm có id bằng ${p.code} đã hết hàng\n`;
        } else if (p.quantity < item.quantity) {
          count = count + 1;
          notice =
            notice + `Sản phẩm có id bằng ${p.code} không đủ số lượng \n`;
        } else {
          req.body.items[index].product = p;
        }
      }
      if (count > 0) {
        return res.status(500).json({ message: notice });
      } else {
        return res
          .status(500)
          .json({ message: 'Không tìm thấy sản phẩm nào phù hợp' });
      }
    }
  }
  // req.body.items
  console.log("🚀 ~ file: order.controller.ts ~ line 134 ~ create ~ req.body", req.body)
  const order = await createOrder({
    ...req.body,
    
  });
  const orderItems = await createOrderItem(order.id, req.body.items);
  if (order && orderItems) {
    return res.status(httpStatus.OK).json({
      message: 'create order successfully',
      success: true,
    });
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'create order failed',
    success: false,
  });
});

// const update = catchAsync(async (req: Request, res: Response) => {
//   const product = await updateProduct(+req.params.id, {
//     ...req.body,
//     slug: removeVietnameseTonesStrikeThrough(req.body.name),
//   });
//   if (!product) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       message: 'update product failed',
//       success: false,
//     });
//   }
//   return res.status(httpStatus.OK).json({
//     message: 'update product successfully',
//     success: true,
//   });
// });

// const remove = catchAsync(async (req: Request, res: Response) => {
//   const product = await prisma.product.delete({
//     where: { id: +req.params.id },
//   });
//   if (!product) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       message: 'delete product failed',
//       success: false,
//     });
//   }
//   return res.status(httpStatus.OK).json({
//     message: 'delete product category successfully',
//     success: true,
//   });
// });

export { index, show, create, filterOrders };

// import DonHang from "../models/DonHang.js";
// import SanPham from "../models/SanPham.js";
// import { request_momo } from "../../services/momo/index.js";
// import crypto from "crypto";
// import pug from "pug";
// import { sendGmail } from "../../services/nodemailer/index.js";
// import path from "path";
// import { fileURLToPath } from "url";
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const index = ({ querymen: { query, select, cursor } }, res, next) => {
//   if (query.keywords) {
//     // query.keywords = cleanAccents(query.keywords)
//     query.keywords =
//       query.keywords instanceof RegExp
//         ? query.keywords
//         : new RegExp(query.keywords, "i");
//   }
//   DonHang.count(query)
//     .then((count) => {
//       return DonHang.find(query, select, cursor)
//         .sort({ createdAt: -1 })
//         .populate({
//           path: "items.sanpham",
//           fields: "DonGia",
//           populate: {
//             path: "AnhMoTa",
//             fields: "source",
//             options: { withDeleted: true },
//           },
//           options: { withDeleted: true },
//         })
//         .populate({
//           path: "MaKhachHang",
//           options: { withDeleted: true },
//         })
//         .populate({
//           path: "MaTaiKhoan",
//           options: { withDeleted: true },
//         })
//         .then((donhang) => ({
//           result: {
//             totalCount: count,
//             totalPage: Math.ceil(count / cursor.limit),
//             pageSize: cursor.limit,
//             pageNo: Math.floor(cursor.skip / cursor.limit) + 1,
//             data: donhang,
//           },
//         }));
//     })

//     .then((data) => {
//       return res.status(200).json(data);
//     })
//     .catch((err) => {
//       return res.status(500).json({ message: err.message });
//     });
// };
// const filter = ({ querymen: { query, select, cursor } }, res, next) => {
//   DonHang.count(query)
//     .then((count) => {
//       return DonHang.find(query)
//         .populate({
//           path: "items.sanpham",
//           fields: "DonGia",
//           populate: {
//             path: "AnhMoTa",
//             fields: "source",
//             options: { withDeleted: true },
//           },
//           // options: { withDeleted: true },
//         })
//         .populate({
//           path: "MaKhachHang",
//           options: { withDeleted: true },
//         })
//         .populate({
//           path: "MaTaiKhoan",
//           options: { withDeleted: true },
//         })
//         .then((donhang) => ({
//           data: donhang,
//         }));
//     })
//     .then((data) => {
//       return res.status(200).json(data);
//     })
//     .catch((err) => {
//       return res.status(500).json({ message: err.message });
//     });
// };
// const show = async ({ params }, res) => {
//   let q;
//   if (Number(params.id)) {
//     q = { _id: params.id };
//   } else {
//     q = { slug: params.id };
//   }
//   DonHang.findOne(q)
//     .populate("items.sanpham")
//     .then((p) => p)
//     .then((data) => {
//       return res.status(200).json({ data });
//     })
//     .catch((err) => res.status(500).json({ message: err.message }));
// };
// const create = async (req, res) => {
//   try {
//     if (req.body.items && req.body.items.length) {
//       console.log(req.body.items.map((i) => i.sanpham._id));
//       const products = await SanPham.find({
//         _id: { $in: req.body.items.map((i) => i.sanpham._id) },
//       });
//       if (products && products.length) {
//         let notice = "";
//         let count = 0;
//         for (const [index, item] of req.body.items.entries()) {
//           const p = products.find(
//             (i) => i._id.toString() === item.sanpham._id.toString()
//           );
//           if (!p) {
//             count = count + 1;
//             notice =
//               notice +
//               `Không tìm thấy sản phẩm có id bằng ${item.sanpham.code}\n`;
//           } else if (p.SoLuong < 1) {
//             count = count + 1;
//             notice = notice + `Sản phẩm có id bằng ${p.code} đã hết hàng\n`;
//           } else if (p.SoLuong < item.soluong) {
//             count = count + 1;
//             notice =
//               notice + `Sản phẩm có id bằng ${p.code} không đủ số lượng \n`;
//           } else {
//             req.body.items[index].sanpham = p;
//           }
//         }
//         if (count > 0) {
//           return res.status(500).json({ message: notice });
//         }
//       } else {
//         return res
//           .status(500)
//           .json({ message: "Không tìm thấy sản phẩm nào phù hợp" });
//       }
//     }
//     DonHang.create({ ...req.body })
//       .then((donhang) =>
//         donhang.populate([
//           {
//             path: "items.sanpham",
//             fields: 'AnhMoTa TenSanPham',
//             populate: {
//               path: "AnhMoTa",
//               fields: "source",
//               options: { withDeleted: true },
//             },
//           },
//         ])
//       )
//       .then(async (data) => {
//         const newData = data;
//         let payUrl = "";
//         if (data.KieuThanhToan == "momo") {
//           payUrl = await request_momo(data);
//         }

//         return { data, payUrl };
//       })
//       .then(async (data) => {
//         const adminTitle = "New order from Fast Food";
//         console.log(data.data.items[0].sanpham.AnhMoTa)
//         await sendGmail(
//           {
//             to: data.data.email,
//             subject: `New order from PinupVintageHouse.com [${data.data._id}]`,
//             message: pug.renderFile(`${__dirname}/template.pug`, {
//               title: adminTitle,
//               order: data.data,
//             }),
//           }
//         );
//         return data;
//       })
//       .then((data) => {
//         return res.status(200).json({ data });
//       })
//       .catch((err) => {
//         return res.status(500).json({ message: err.message });
//       });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
// const momo = async (req, res) => {
//   try {
//     const partnerCode = req.body.partnerCode;
//     const orderId = req.body.orderId;
//     const amount = req.body.amount;
//     const orderInfo = req.body.orderInfo;
//     const requestId = req.body.requestId;
//     const extraData = req.body.extraData;
//     const accessKey = process.env.ACCESS_KEY;
//     const secretkey = process.env.SECRET_KEY;
//     const message = req.body.message;
//     const orderType = req.body.orderType;
//     const resultCode = req.body.resultCode;
//     const payType = req.body.payType;
//     const transId = req.body.transId;
//     const responseTime = req.body.responseTime;
//     var signatureReceive = req.body.signature;
//     const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
//     console.log(rawSignature, "----------");
//     var signature = crypto
//       .createHmac("sha256", secretkey)
//       .update(rawSignature)
//       .digest("hex");
//     console.log(rawSignature, signatureReceive, signature);
//     if (signatureReceive !== signature) {
//       return res.status(500).json({ err: "Signature wrong" });
//     }
//     if (resultCode != 0) {
//       return res.status(400).json({ err: "The trans doesnt finish" });
//     } else {
//       DonHang.findOneAndUpdate(
//         { _id: orderId.split("-")[1] },
//         { TinhTrangThanhToan: 1 }
//       )
//         .then((data) => res.status(200).json(data))
//         .catch((err) => res.status(500).json(err));
//     }
//     return res.status(200).json({ data: req.body });
//   } catch (err) {
//     return res.status(500).json({ message: err });
//   }
// };
// const update = async (req, res) => {
//   try {
//     let order = await DonHang.findById(req.params.id);
//     console.log(req.body);
//     if (order) {
//       if (req.body.items && req.body.items.length) {
//         const products = await SanPham.find({
//           id: { $in: req.body.items.map((i) => i.sanpham._id) },
//         });
//         if (products && products.length) {
//           for (const [index, item] of req.body.items.entries()) {
//             const p = products.find((i) => {
//               return i._id.toString() === item.sanpham._id.toString();
//             });
//             if (!p) {
//               return res
//                 .status(500)
//                 .json({
//                   message: `Không tìm thấy sản phẩm id = ${item.sanpham}`,
//                 });
//             } else if (
//               p.SoLuong < 1 &&
//               !order.items
//                 .map((i) => i.sanpham._id.toString())
//                 .includes(p._id.toString())
//             ) {
//               return res
//                 .status(500)
//                 .json({ message: `Sản phẩm id = ${p.code} đã hết hàng` });
//             } else if (
//               p.SoLuong < item.soluong - item.soluongcu &&
//               order.items
//                 .map((i) => i.sanpham._id.toString())
//                 .includes(p._id.toString())
//             ) {
//               return res
//                 .status(500)
//                 .json({ message: `Sản phẩm id = ${p.code} không đủ số lượng` });
//             } else {
//               req.body.items[index].sanpham = p;
//             }
//           }
//         } else {
//           return res
//             .status(500)
//             .json({ message: "Không tìm thấy sản phẩm nào phù hợp" });
//         }
//       }
//     }
//     order = await Object.assign(order, req.body).save();
//     return res.status(200).json(order);
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };
// const remove = async (req, res) => {
//   DonHang.findById({ _id: req.params.id })
//     .then((data) => (data ? data.remove() : null))
//     .then(() => res.status(201).json({ message: "Delete success" }))
//     .catch((err) => res.status(500).json({ message: err.message }));
// };

// export { index, create, update, remove, show, momo, filter };
