export type FuelSummary = {
  fuelId: number;
  fuelName: string;
  totalVolume: number;
  avgAzsPrice: number;
  avgPrice: number;
  totalSum: number;
  transactionCount: number;
};

export type CardFuelReport = {
  id: string; // для DataGrid
  cardNumber: number;
  cardOwner: string;
  fuels: FuelSummary[];
  totalSum: number;
  totalVolume: number;
  transactionCount: number;
};

export type FuelReportRow = {
  id: string;
  hierarchy: string[]; // [cardNumber, fuelId] для группировки
  cardNumber: number;
  cardOwner?: string;
  fuelId?: number;
  fuelName?: string;
  totalVolume: number;
  avgAzsPrice: number;
  avgPrice: number;
  totalSum: number;
  transactionCount: number;
};
