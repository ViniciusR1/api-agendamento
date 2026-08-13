import {NextFunction, Request, Response} from 'express';

type AsyncRouteHandler<Req extends Request = Request> = (
  req:Req,
  res:Response,
  next:NextFunction,
) => Promise<void>;

export function asyncHandler<Req extends Request = Request>(handler: AsyncRouteHandler) {
  return (req:Req, res:Response, next:NextFunction) => {
    handler(req, res, next).catch(next);
  }
}