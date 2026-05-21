const APIRoute = {
  Token: "/security/getToken",
  FirmInfo: (id: number) => `/cc/e?${id}`,
  AuthInfo: "/who/ami",
  NomenclatureData: "/cc/e-fuelids",
  Transaction: "/cc/t",
  FullData: "online/full",
  MapMarkers: "/api/map-markers",
  Report: "online/report",
  UpdateCardOwner: (cardId: string | number) => `/admin/cards/${cardId}/cardowner`,
} as const;

export { APIRoute };
export default APIRoute;
