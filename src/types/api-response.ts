// API Response Types for Fuel Card Management System

/**
 * Fuel names dictionary mapping fuel IDs to names
 */
export type FuelNamesType = {
  [key: string]: string;
};

/**
 * Price types dictionary mapping price type IDs to names
 */
export type PriceTypesType = {
  [key: string]: string;
};

/**
 * Balance information for a specific fuel at a specific price
 */
export type BalanceType = {
  fuelId: number;
  balanceType: string;
  initialPrice: string;
  lastStationPrice: string;
  lastRealPrice: string;
  initialVolume: string;
  controlledVolume: string;
  volumeSpentBefore: string;
  operationalVolumeSpent: string;
  volumeRemainBefore: string;
  volumeRemainBeforeWithCredit: string;
  volumeRemainBeforeOperational: string;
  volumeRemain: string;
  canSpendLitersByVolumeWithCredit: string;
  overdraftLitersByVolume: string;
  initialAmount: string;
  controlledAmount: string;
  amountRemainBefore: string;
  amountSpentBefore: string;
  operationalAmountSpent: string;
  amountRemainBeforeControlled: string;
  amountRemainBeforeWithCredit: string;
  amountRemainBeforeOperational: string;
  amountRemainControlled: string;
  canSpendRublesByAmountWithCredit: string;
  overdraftRublesByAmount: string;
  priceCanSpend: string;
  canSpendLitersWithCredit: string;
  canSpendRublesWithCredit: string;
  overdraftLiters: string;
  overdraftRubles: string;
};
/**
 * Balances grouped by fuel ID and price
 */
export type BalancesType = {
  [fuelId: string]: {
    [price: string]: BalanceType;
  };
};

/**
 * Fueling information within a current refueling
 */
export type FuelingType = {
  contractNumber: string;
  priceForClient: string;
  litersFilled: string;
  litersRemaining: string;
};

/**
 * Current refueling operation
 */
export type CurrentRefuelingType = {
  isBefore: number;
  isSpecial: number;
  cardNumber: number;
  stationId: number;
  fuelId: number;
  stationPrice: string;
  needToFill: string;
  fuelings: FuelingType[];
  overdraft: unknown[];
};

/**
 * Contract/Agreement information from API (Договор)
 */
export type ApiContractType = {
  firmId: number;
  dogref: string;
  contractStartDate: string;
  contractEndDate: string;
  contractNumber: string;
  contractComment: string;
  priceType: number;
  priceTypeString: string;
  discountMultiplier: string;
  personalFuelPrices: Record<string, unknown>;
  personalFuelDiscounts: Record<string, unknown>;
  initialAmount: string;
  controlledAmount: string;
  creditDepthRubles: string;
  paymentDeferralDays: number;
  paymentAmount: string;
  amountSpentBefore: string;
  operationalAmountSpent: string;
  totalAmountSpent: string;
  paymentBalanceBefore: string;
  paymentBalanceBeforeWithCredit: string;
  paymentBalanceBeforeOperational: string;
  paymentBalance: string;
  paymentBalanceWithCredit: string;
  paymentBalanceOperational: string;
  paymentBalanceWithCreditRubles: string;
  paymentBalanceWithCreditRublesWithCredit: string;
  paymentBalanceWithCreditRublesOperational: string;
  amountRemainBeforeControlled: string;
  amountRemainControlled: string;
  amountRemainWithCredit: string;
  amountRemainOperational: string;
  canSpendRublesContractWithCredit: string;
  overdraftRublesContract: string;
  canSpendRublesTechWithCredit: string;
  overdraftRublesTech: string;
  canSpendRublesWithCredit: string;
  virtualContractAccountRubles: string;
  overdraftRubles: string;
  accountMaxPrices: Record<string, string>;
  balances: BalancesType;
  cards: number[];
};

/**
 * Card wallet information
 */
export type CardWalletType = {
  [fuelId: string]: string;
};

/**
 * Card information - card type
 */
export type CardInfoType = {
  date: string;
  firmId: number;
  cardNumber: number;
  cardOwner: string;
  blocked: number;
  walletType: number;
  dayLimit: string;
  dayRemain: string;
  monthLimit: string;
  monthRemain: string;
  wallets: CardWalletType;
  sost: string;
};

/**
 * Cards dictionary mapping card numbers to card info
 */
export type CardsType = {
  [cardNumber: string]: CardInfoType;
};

/**
 * Fuel volume by card and fuel type
 */
export type FuelVolumeType = {
  [cardId: string]: {
    [fuelId: string]: string;
  };
};

/**
 * Virtual card balance by fuel type
 */
export type VirtualCardBalanceType = {
  [fuelId: string]: string;
};

/**
 * Firm data structure
 */
export type FirmDataType = {
  firmId: number;
  name: string;
  blocked: number;
  unlimited: number;
  contractPeriodStart: string;
  contractPeriodEnd: string;
  priceTypes: number[];
  priceTypesString: string[];
  contracts: ApiContractType[];
  overdraftInfo: unknown[];
  currentRefuels: CurrentRefuelingType[];
  virtualCard: VirtualCardBalanceType;
  virtualAccountRubles: string;
  specialCards: unknown[];
  cards: CardsType;
  cardFuelVolumeRemain: FuelVolumeType;
  fuelVolumeRemain: VirtualCardBalanceType;
  cardFuelVolumeOverdraft: FuelVolumeType;
  fuelVolumeOverdraft: VirtualCardBalanceType;
  canSpendRublesWithCredit: number | string;
  canSpendStringRubles?: number | string;
  version: string | null;
  total: VirtualCardBalanceType;
};

/**
 * Remains data structure
 */
export type RemainsType = {
  [firmId: string]: string;
};

/**
 * Main API Response structure
 */
export type ApiResponseType = {
  date: string;
  fuelNames: FuelNamesType;
  priceTypes: PriceTypesType;
  firms: FirmDataType[];
  blocked: string[];
  noLimit: string[];
  noRemains: string[];
  remains: RemainsType;
  workingCards: string[];
};
