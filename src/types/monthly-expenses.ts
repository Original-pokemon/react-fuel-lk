export interface FuelExpense {
  fuelId: number;
  fuelName: string;
  volume: number; // литры
  amount: number; // рубли
}

export interface CardMonthlyExpense {
  cardNumber: number;
  cardOwner: string;
  fuelExpenses: FuelExpense[];
  totalVolume: number;
  totalAmount: number;
}

export interface MonthlyExpenseSummary {
  month: string; // YYYY-MM
  monthName: string; // "Октябрь 2024"
  cards: CardMonthlyExpense[];
  fuelTotals: FuelExpense[]; // итоги по видам топлива за месяц
  totalVolume: number;
  totalAmount: number;
}

export interface MonthlyExpensesData {
  months: MonthlyExpenseSummary[];
  totalVolume: number;
  totalAmount: number;
}
