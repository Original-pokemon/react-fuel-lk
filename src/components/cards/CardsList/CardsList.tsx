import { Divider, Typography, Grid2 } from '@mui/material';
import { CardInfoType } from '#root/types';
import { DataListItemProps } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItem';
import DataList from '#root/components/layouts/data-layouts/DataList/DataList';
import LimitCell from '../CardTable/cells/LimitCell/LimitCell';
import WalletTypeCell from '../CardTable/cells/WalletTypeCell/WalletTypeCell';
import StatusCell from '../CardTable/cells/StatusCell/StatusCell';
import CardListHeader from './CardListHeader';
import { DateCell } from '../CardTable/cells/DateCell/DateCell';

const getCardBodyElement = ({
  cardOwner,
  date,
  walletType,
  blocked,
  dayRemain,
  dayLimit,
  monthRemain,
  monthLimit,
}: CardInfoType): React.ReactElement => (
  <Grid2 container spacing={2}>
    {/* Owner and Last Operation */}
    <Grid2 size={12} container columnSpacing={1} rowSpacing={1}>
      {cardOwner.trim() && (
        <Grid2 size={12}>
          <Typography variant="caption" color="main.light">
            Владелец карты:
          </Typography>
          <Typography variant="subtitle2">{cardOwner}</Typography>
        </Grid2>
      )}

      <Grid2 size={12}>
        <Typography variant="caption" color="main.light">
          Последняя операция:
        </Typography>
        <DateCell
          value={date}
          flexDirection="row"
          backgroundColor="#ffff"
          variant="outlined"
        />
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Тип кошелька:
        </Typography>
        <WalletTypeCell value={walletType} />
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Статус:
        </Typography>
        <StatusCell value={Boolean(blocked)} />
      </Grid2>
    </Grid2>

    <Grid2 size={12}>
      <Divider />
    </Grid2>

    {/* Day and Month Limits */}
    <Grid2 container size={12} spacing={2}>
      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Дневной:
        </Typography>
        <LimitCell limit={+dayLimit} remain={+dayRemain} />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Месячный:
        </Typography>
        <LimitCell limit={+monthLimit} remain={+monthRemain} />
      </Grid2>
    </Grid2>
  </Grid2>
);

type CardListProperties = {
  cards: CardInfoType[];
  isLoading: boolean;
};

function CardsList({ cards, isLoading }: CardListProperties) {
  const cardListItems: DataListItemProps[] = cards.map((card) => {
    const bodyElement = getCardBodyElement(card);
    const headerElement = CardListHeader(card);

    return {
      id: card.cardNumber.toString(),
      header: headerElement,
      body: bodyElement,
    };
  });

  return <DataList items={cardListItems} isLoading={isLoading} />;
}

export default CardsList;
