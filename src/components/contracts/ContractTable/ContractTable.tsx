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
    }) => {
      // Check if priceType is "Цена Табло" and initialAmount is 0
      const isPriceTabloAndZeroAmount =
        priceTypeString === 'Цена Табло' &&
        Number.parseFloat(initialAmount) === 0;

      return {
        id: dogref,
        code: contractNumber,
        fuelname: priceTypeString,
        priceType,
        dsumma: isPriceTabloAndZeroAmount
          ? undefined
          : Number.parseFloat(initialAmount),
        spent: isPriceTabloAndZeroAmount
          ? undefined
          : Number.parseFloat(totalAmountSpent),
        canSpend: isPriceTabloAndZeroAmount
          ? undefined
          : Number.parseFloat(canSpendRublesWithCredit),
        moneyRemain: Number.parseFloat(paymentBalance),
        fuelRemain: balances,
      };
    },
  );

  if (isIdle) {
    return <Spinner fullscreen={false} />;
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
      getRowHeight={() => 'auto'}
      getEstimatedRowHeight={() => 120}
      showCellVerticalBorder
    />
  );
}

export default ContractTable;
