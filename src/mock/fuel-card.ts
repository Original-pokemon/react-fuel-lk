import { faker } from '@faker-js/faker';
import { CardType } from '#root/types';

export const generateMockFuelCardData = (): CardType => {
  const monthlimit = faker.number.int({ min: 1, max: 10_000 });
  const monthremain = faker.number.int({ min: 1, max: monthlimit });
  const daylimit = faker.number.int({ min: 1, max: 10_000 });
  const dayremain = faker.number.int({ min: 1, max: daylimit });

  return {
    dt: faker.date.recent().toISOString(), //
    firmid: faker.number.int({ min: 100, max: 1000 }), //
    cardowner: faker.name.fullName(), //
    wallettype: faker.number.int({ min: 1, max: 3 }), //
    blocked: faker.datatype.boolean(),
    cardnum: faker.number.int({
      min: 1_000_000_000_000_000,
      max: 9_999_999_999_999_999,
    }),
    monthlimit,
    monthremain,
    daylimit,
    dayremain,
    datedaylimit: faker.date.past({}).toISOString(),
    datelastop: faker.date.past().toISOString(),
    fuels: [
      {
        fuelid: faker.helpers.arrayElement([14, 15, 17]),
        volume: faker.number.float({ min: 1, max: 10_000 }),
      },
    ],
  };
};

export const generateMockFuelCardList = (length: number) =>
  Array.from({ length }, () => generateMockFuelCardData());
