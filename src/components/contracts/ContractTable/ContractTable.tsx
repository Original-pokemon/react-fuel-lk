import { DataTable } from '#root/components/layouts/data-layouts/DataTable/DataTable';
import { useAppSelector } from '#root/hooks/state';
import { getApiResponseStatus } from '#root/store';
import Spinner from '#root/components/Spinner/Spinner';
import { ApiContractType } from '#root/types';
import ContractColumns from './ContractColumns';

type ContractTableProperties = {
  contracts: ApiContractType[];
};

function ContractTable({ contracts }: ContractTableProperties) {
  const { isIdle, isLoading, isError, isSuccess } =
    useAppSelector(getApiResponseStatus);

  const rows = contracts.map(
    ({
      dogref,
      contractNumber,
      priceTypeString,
      priceType,
      initialAmount,
      totalAmountSpent,
      canSpendRublesWithCredit,
      paymentBalance,
      balances,
    }) => ({
      id: dogref,
      code: contractNumber,
      fuelname: priceTypeString,
      priceType,
      dsumma: Number.parseFloat(initialAmount),
      spent: Number.parseFloat(totalAmountSpent),
      canSpend: Number.parseFloat(canSpendRublesWithCredit),
      moneyRemain: Number.parseFloat(paymentBalance),
      fuelRemain: balances,
    }),
  );

  if (isIdle) {
    return <Spinner fullscreen />;
  }

  if (isError) {
    return <div>Ошибка при загрузке данных по договорам</div>;
  }

  if (contracts.length === 0 && isSuccess) {
    return <div>Нет данных по договорам</div>;
  }

  return (
    <DataTable
      name="contracts"
      columns={ContractColumns}
      rows={rows}
      loading={isLoading}
    />
  );
}

export default ContractTable;
