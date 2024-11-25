import DataList from '#root/components/layouts/data-layouts/DataList/DataList';
import { DataListItemProps } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItem';
import { TransactionType } from '#root/types';
import TransactionHeaderProperties from './TransactionsListHeader';
import TransactionBody from './TransactionsListBody';

type TransactionsListProperties = {
  transactions: TransactionType[];
  isLoading: boolean;
};

function TransactionsList({
  transactions,
  isLoading = false,
}: TransactionsListProperties) {
  const transactionListItems: DataListItemProps[] = transactions.map(
    (transaction) => {
      const headerProperties = TransactionHeaderProperties(transaction);

      return {
        id: `${transaction.dt}-${transaction.cardnum}-${transaction.op}`,
        header: headerProperties,
        body: <TransactionBody transaction={transaction} />,
      };
    },
  );

  return <DataList items={transactionListItems} isLoading={isLoading} />;
}

export default TransactionsList;
