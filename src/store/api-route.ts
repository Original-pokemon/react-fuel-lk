export const APIRoute = {
  Token: '/security/getToken',
  FirmInfo: (id: number) => `/cc/e?${id}`,
  AuthInfo: '/who/ami',
  NomenclatureData: '/cc/e-fuelids',
  Transaction: '/cc/t',
  FullData: 'online/full',
  MapMarkers: 'https://ortkazs.ru/map.json',
} as const;
