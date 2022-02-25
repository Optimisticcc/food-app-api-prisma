import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/';
import {
  createConfig,
  deleteConfigs,
  findConfigs,
  findOneConfig,
  updateConfig,
} from '../../services';
import { schemas, validate } from '../../validation';
import { type } from 'os';
import { Prisma } from '@prisma/client';
import ApiError from '../../utils/api-error';

const getAllPublicConfigHandler = catchAsync(
  async (req: Request, res: Response) => {
    const configs = await findConfigs({ active: true });
    return res.status(httpStatus.OK).json({
      message: 'get all active configs successfully',
      data: configs,
    });
  }
);

const getAllConfigHandler = catchAsync(async (req: Request, res: Response) => {
  const configs = await findConfigs({});
  return res.status(httpStatus.OK).json({
    message: 'get all active configs successfully',
    data: configs,
  });
});

const getConfigsByTypeHandler = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.getConfigsByType, req.body);
    const configs = await findConfigs({ type: req.body.type });
    return res.status(httpStatus.OK).json({
      message: 'get all active configs successfully',
      data: configs,
    });
  }
);

const getActiveConfigsByTypeHandler = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.getConfigsByType, req.body);
    const configs = await findConfigs({ type: req.body.type, active: true });
    return res.status(httpStatus.OK).json({
      message: 'get all active configs successfully',
      data: configs,
    });
  }
);

const addConfigHandler = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.addConfig, req.body);
  const user = res.locals.userInfo;
  let config: Prisma.ConfigCreateInput = req.body;
  // add config
  if (req.body.images) {
    const { images, ...rest } = req.body;
    const imgs: string[] = req.body.images;
    const connect = imgs.map((image) => ({ id: +image }));
    config = {
      images: {
        connect: connect,
      },
      ...rest,
    };
  }
  try {
    const configCreated = await createConfig({
      ...config,
      key: config.page + '-' + config.type + '-' + config.key,
      createdBy: { connect: { id: +user.userId } },
    });
    return res.status(httpStatus.CREATED).json({
      message: 'add config successfully',
      data: configCreated,
    });
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
});

const editConfigHandler = catchAsync(async (req: Request, res: Response) => {
  await Promise.all([
    validate(schemas.idSchema, req.params),
    validate(schemas.editConfig, req.body),
  ]);

  const config = await findOneConfig({ id: +req.params.id });
  if (!config) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: `not found config with id = ${req.params.id}`,
    });
  }
  const disconnectImgId = config.images.map((image) => ({ id: image.id }));

  // if have images => remove ole image connect => new connect images
  if (req.body.images && req.body.images.length) {
    await updateConfig(
      { id: +req.params.id },
      { images: { disconnect: disconnectImgId } }
    );
    const { images, ...rest } = req.body;
    const imgs: string[] = req.body.images;
    const connect = imgs.map((image) => ({ id: +image }));
    const configUpdate = {
      images: {
        connect: connect,
      },
      ...rest,
      key: rest.page + '-' + rest.type + '-' + rest.key,
    };
    const updated = await updateConfig({ id: +req.params.id }, configUpdate);
    return res.status(httpStatus.OK).json({
      message: 'edit config successfully',
      data: updated,
    });
  } else {
    const updated = await updateConfig({ id: +req.params.id }, req.body);
    return res.status(httpStatus.OK).json({
      message: 'edit config successfully',
      data: updated,
    });
  }
});

const getConfigByIdHandler = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  const config = await findOneConfig({ id: +req.params.id });
  if (!config)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `not found config with id = ${req.params.id}`
    );
  return res.status(httpStatus.OK).json({
    message: 'get config successfully',
    data: config,
  });
});

const deleteConfigHandler = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idArrSchema, req.body);
  await deleteConfigs(req.body.id);

  return res.status(httpStatus.OK).json({
    message: 'delete config successfully',
  });
});

const getActiveConfigsBySectionHandler = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.getConfigsBySection, req.body);
    const configs = await findConfigs({
      section: req.body.section,
      active: true,
    });
    return res.status(httpStatus.OK).json({
      message: 'get all active configs successfully',
      data: configs,
    });
  }
);

const getConfigsBySectionHandler = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.getConfigsBySection, req.body);
    const configs = await findConfigs({ section: req.body.section });
    return res.status(httpStatus.OK).json({
      message: 'get all active configs successfully',
      data: configs,
    });
  }
);

const getActiveConfigsBySectionAndTypeHandler = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.getConfigsBySectionType, req.body);
    const configs = await findConfigs({
      section: req.body.section,
      type: req.body.type,
      active: true,
    });
    return res.status(httpStatus.OK).json({
      message: 'get all active configs by section and type successfully',
      data: configs,
    });
  }
);

const getActiveConfigsFilter = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.filterConfigs, req.body);
    const configs = await findConfigs({
      ...(req.body as Prisma.ConfigWhereInput),
    });
    return res.status(httpStatus.OK).json({
      message: 'get all active configs filter successfully',
      data: configs,
    });
  }
);

export {
  getAllPublicConfigHandler,
  getAllConfigHandler,
  getConfigsByTypeHandler,
  getActiveConfigsByTypeHandler,
  addConfigHandler,
  editConfigHandler,
  getConfigByIdHandler,
  deleteConfigHandler,
  getActiveConfigsBySectionHandler,
  getConfigsBySectionHandler,
  getActiveConfigsBySectionAndTypeHandler,
  getActiveConfigsFilter,
};
