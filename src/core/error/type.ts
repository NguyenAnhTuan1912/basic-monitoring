export type TBaseErrorDetail = { source: string; desc?: string } & Record<
  string,
  any
>;
export type TErrorDetails = {
  reasons?: Array<TBaseErrorDetail>;
};
