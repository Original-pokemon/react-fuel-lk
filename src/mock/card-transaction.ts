import { faker } from '@faker-js/faker';
import { TransactionType } from '../types/card-transaction';

export const generateMockCardTransaction = (): TransactionType => {
  const transactionType = faker.helpers.arrayElement([-1, 1]);

  return {
    confirmed: faker.helpers.arrayElement([0, 1]),
    dt: faker.date.recent().toISOString(),
    firmid: faker.number.int({ min: 1, max: 100 }),
    cardnum: faker.number.int({
      min: 100_000_000_000_000,
      max: 999_999_999_999_999,
    }),
    op: transactionType,
    fuelid: faker.helpers.arrayElement([14, 15, 17, 18, 19, 21]),
    volume: faker.number.int({ min: 1, max: 1000 }),
    price: faker.number.int({ min: 1, max: 100 }),
    summa: faker.number.int({ min: 1, max: 100 }),
    azs: faker.number.int({ min: 1, max: 100 }),
  };
};

export const generateMockCardTransactionList = (length: number) =>
  Array.from({ length }, () => generateMockCardTransaction());
