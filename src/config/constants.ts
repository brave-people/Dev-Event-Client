export const STATUS_200 = 20001;
export const STATUS_201 = 20101;
export const STATUS_203 = 20003;
export const STATUS_400 = 40001;
export const STATUS_404 = 40004;

export const baseRouter = () =>
  process.env.NODE_ENV === 'production' ? '/Dev-Event-Client' : '';
