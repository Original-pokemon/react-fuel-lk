import { Box } from '@mui/material';
import { TransactionType } from '#root/types';
import React from 'react';
import { DataTable } from '../../layouts/data-layouts/DataTable/DataTable';
import transactionColumns from './TransactionColumns';
import { mapTransactionsToRows } from './map-transactions-to-row';

type TransactionsTableProperties = {
  name: string;
  transactions: TransactionType[];
  isLoading: boolean;
};

function TransactionsTable({
  transactions,
  name,
  isLoading = false,
}: TransactionsTableProperties) {
  const row = mapTransactionsToRows(transactions);

  return (
    <Box
      className="transactions-table"
      bgcolor="background.paper"
      padding={2}
      borderRadius="10px"
    >
      <DataTable
        name={name}
        columns={transactionColumns}
        rows={row}
        loading={isLoading}
      />
    </Box>
  );
}

export default React.memo(TransactionsTable);
