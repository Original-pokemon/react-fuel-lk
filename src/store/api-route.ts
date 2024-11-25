export const APIRoute = {
  Token: '/security/getToken',
  FirmInfo: (id: number) => `/cc/e?${id}`,
  AuthInfo: '/who/ami',
  NomenclatureData: '/cc/e-fuelids',
  Transaction: '/cc/t',
} as const;
