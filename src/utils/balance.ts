import { ContractType } from '../types/contract';

const calculateBalance = (contracts: ContractType[]) => {
  const balance = contracts.reduce(
    (totalBalance, contract) => totalBalance + contract.remain,
    0,
  );

  return balance;
};

export default calculateBalance;
