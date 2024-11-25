import { faker } from '@faker-js/faker';
import { FirmInfoType } from '#root/types';
import { generateMockFuelCardList } from './fuel-card';

const generateMockFirmData = async (delay = 0): Promise<FirmInfoType> => {
  await new Promise((resolve) => setTimeout(resolve, delay));

  return {
    firmid: faker.number.int({ min: 100, max: 1000 }),
    firmname: faker.company.name(),
    firmcash: {
      conf: faker.number.float({ min: 100, max: 1000 }),
      unconf: faker.number.float({ min: 100, max: 1000 }),
      remain: faker.number.float({ min: 100, max: 1000 }),
      unconfV: faker.number.float({ min: 100, max: 1000 }),
    },
    firmwallet: [
      {
        fuelid: 14,
        remain: faker.number.int({ min: 100, max: 1000 }),
      },
      {
        fuelid: 15,
        remain: faker.number.int({ min: 100, max: 1000 }),
      },
    ],
    cards: generateMockFuelCardList(faker.number.int({ min: 1, max: 10 })),
  };
};

export default generateMockFirmData;
