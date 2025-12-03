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
  id: string;
  cardNumber: number;
  cardOwner: string;
  fuels: FuelSummary[];
  totalSum: number;
  totalVolume: number;
  transactionCount: number;
};

export type FuelReportRow = {
  id: string;
  hierarchy: string[];
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
