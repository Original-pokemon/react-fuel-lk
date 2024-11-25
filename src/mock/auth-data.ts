import { faker } from '@faker-js/faker';
import { AuthInfoType } from '#root/types';

const generateMockAuthorizationData = async (
  delay = 0,
): Promise<AuthInfoType & { token: string }> => {
  await new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

  return {
    token: faker.string.uuid(),
    isAdmin: faker.datatype.boolean(),
    isCard: faker.datatype.boolean(),
    isFirm: faker.datatype.boolean(),
    firmId: faker.number.int({ min: 100, max: 1000 }), // Рандомный firmid
    cardNum: faker.number.int({ min: 0, max: 9999 }), // Рандомный cardnum
  };
};

export default generateMockAuthorizationData;
