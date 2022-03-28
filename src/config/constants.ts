export const STATUS_200 = 200;
export const STATUS_201 = 201;
export const STATUS_203 = 203;
export const STATUS_400 = 401;
export const STATUS_404 = 404;

export const baseRouter = () =>
  process.env.NODE_ENV === 'production' ? '/Dev-Event-Client' : '';
