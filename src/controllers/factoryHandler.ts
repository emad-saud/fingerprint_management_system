import type { RequestHandler } from 'express';
import {
  where,
  type Attributes,
  type Model,
  type ModelStatic,
  type WhereOptions,
} from 'sequelize';

import catchAsync from '../utils/catchAsync.js';
import ApiFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import { logger } from '../utils/logger.js';

export const getAll = <T extends Model>(model: ModelStatic<T>) =>
  catchAsync(async (req, res, next) => {
    const { options } = new ApiFeatures(req.query)
      .filter()
      .sort()
      .paginate()
      .fields();

    const records = await model.findAll(options);

    res.status(200).json({
      status: 'success',
      results: records.length,
      data: records,
    });
  });

export const getOneByPk = <T extends Model>(
  model: ModelStatic<T>,
  identifier: string
) =>
  catchAsync(async (req, res, next) => {
    const [src, id] = identifier.split(':') as ['params' | 'body', string];
    const record = await model.findByPk(req[src][id]);

    if (!record)
      return next(new AppError(`Couldn't find ${model.name}[${id}]`, 404));

    res.status(200).json({
      status: 'success',
      data: record,
    });
  });

export const getOne = <
  T extends Model,
  K extends Extract<keyof T['_attributes'], string>
>(
  model: ModelStatic<T>,
  identifier: `params:${K}` | `body:${K}`
) =>
  catchAsync(async (req, res, next) => {
    const [src, id] = identifier.split(':') as ['params' | 'body', K];
    const record = await model.findOne({
      where: { [id]: req[src][id] } as WhereOptions<T>,
    });

    if (!record)
      return next(
        new AppError(`Couldn't find ${model.name}.${id}[${req[src][id]}]`, 404)
      );

    res.status(200).json({
      status: 'success',
      data: record,
    });
  });

export const createOne = <T extends Model>(
  model: ModelStatic<T>,
  fields: (keyof Attributes<T>)[]
) =>
  catchAsync(async (req, res, next) => {
    const record = await model.create(req.body, {
      fields,
    });

    res.status(200).json({
      status: 'success',
      message: `Created ${model.name} successfully!`,
      data: record,
    });
  });

export const updateOne = <
  T extends Model,
  K extends Extract<keyof Attributes<T>, string>
>(
  model: ModelStatic<T>,
  identifier: `params:${K}` | `body:${K}`,
  fields: (keyof Attributes<T>)[]
) =>
  catchAsync(async (req, res, next) => {
    const [src, id] = identifier.split(':') as ['params' | 'body', K];
    const record = await model.update(req.body, {
      fields,
      where: { [id]: req[src][id] } as WhereOptions<T>,
      returning: true,
    });

    if (!record)
      logger.info(`Couldn't update ${model.name}.${id}[${req[src][id]}].`);

    res.status(200).json({
      status: 'success',
      message: `update went successfully!`,
      data: record,
    });
  });

export const deleteOne = <
  T extends Model,
  K extends Extract<keyof T['_attributes'], string>
>(
  model: ModelStatic<T>,
  identifier: `params:${K}` | `body:${K}`
) =>
  catchAsync(async (req, res, next) => {
    const [src, id] = identifier.split(':') as ['params' | 'body', K];

    const numOfDeletedRows = await model.destroy({
      where: {
        [id]: req[src][id],
      } as WhereOptions<T>,
    });

    res.status(204).json({
      status: 'success',
      message: `Deleted ${numOfDeletedRows} successfully!`,
    });
  });
