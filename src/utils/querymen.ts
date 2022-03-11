import aqp from 'api-query-params';
import { Request, Response, NextFunction } from 'express';
function middleware() {
  return function (req: Request, res: Response, next: NextFunction) {
    let { filter, skip, limit, sort, projection, population } = aqp(req.query);
    if (filter.pageNo && filter.pageSize) {
      const page = parseInt(filter.pageNo, 10);
      skip = (page - 1) * filter.pageSize;
      delete filter.pageNo;
      limit = filter.pageSize;
      delete filter.pageSize;
    }
    // @ts-ignore
    req.querymen = {
      query: filter,
      select: projection,
      cursor: {
        limit: limit || 10,
        sort: sort || '-createdAt',
        skip: skip || 0,
      },
      population,
    };
    next();
  };
}

export { middleware };
