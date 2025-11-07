import { Model, Op, type FindOptions, type Order } from 'sequelize';
import { logger } from './logger.js';
import AppError from './appError.js';

interface QueryString {
  [key: string]: any;
}

class ApiFeatures<T extends Model> {
  constructor(
    public queryString: QueryString,
    public options: FindOptions<T> = {}
  ) {}

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);

    let where: Record<string, any> = {};
    const regex = /^(\w+)\[(\w+)\]$/;
    for (const [key, value] of Object.entries(queryObj)) {
      const match = key.match(regex);
      if (match) {
        const field = match[1];
        const operator = match[2] as keyof typeof Op;

        if (!field || !operator) {
          throw new AppError('Either field or operator is not defined', 500);
        }

        if (!Op[operator])
          throw new AppError(`Invalid operator ${operator}`, 400);

        if (!where[field]) where[field] = {} as any;
        (where[field] as any)[Op[operator]] = value;

        // where[field] = { [Op[operator]]: entry[1] };
        // the problem here that this line overwrites the whole field ex:(age[gt]=20&age[lt]=20)
      } else {
        const field = key;
        where[field] = value;
      }
    }

    this.options.where = where;
    logger.info('filtered a request!', {
      service: 'apiFeatures-service',
      thisObj: this,
    });
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const order = (this.queryString.sort as string)
        .split(',')
        .map((el) =>
          el.startsWith('-') ? [el.slice(1), 'DESC'] : [el, 'ASC']
        ) as Order;

      this.options.order = order;
      logger.info('sorting request', {
        service: 'apiFeatures-service',
        order,
        sort: this.queryString.sort,
      });
    }
    return this;
  }

  paginate() {
    if (this.queryString.limit) {
      const page = +this.queryString.page || 1;
      this.options.limit = +this.queryString.limit;
      this.options.offset = (page - 1) * this.options.limit;
    }

    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const attributes = (this.queryString.fields as string).split(',');
      this.options.attributes = attributes;

      logger.info('selecting request fields', {
        service: 'apiFeatures',
        fields: attributes,
      });
    }
    return this;
  }
}

export default ApiFeatures;
