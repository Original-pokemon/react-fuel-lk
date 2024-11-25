import { Divider, Typography, Grid2 } from '@mui/material';
import { CardType } from '#root/types';
import { DataListItemProps } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItem';
import DataList from '#root/components/layouts/data-layouts/DataList/DataList';
import LimitCell from '../CardTable/cells/LimitCell/LimitCell';
import WalletTypeCell from '../CardTable/cells/WalletTypeCell/WalletTypeCell';
import StatusCell from '../CardTable/cells/StatusCell/StatusCell';
import CardListHeader from './CardListHeader';
import { DateCell } from '../CardTable/cells/DateCell/DateCell';

const getCardBodyElement = ({
  cardowner,
  datelastop,
  wallettype,
  blocked,
  dayremain,
  daylimit,
  monthremain,
  monthlimit,
}: CardType): React.ReactElement => (
  <Grid2 container spacing={2}>
    {/* Owner and Last Operation */}
    <Grid2 size={12} container columnSpacing={1} rowSpacing={1}>
      {cardowner.trim() && (
        <Grid2 size={12}>
          <Typography variant="caption" color="main.light">
            Владелец карты:
          </Typography>
          <Typography variant="subtitle2">{cardowner}</Typography>
        </Grid2>
      )}

      <Grid2 size={12}>
        <Typography variant="caption" color="main.light">
          Последняя операция:
        </Typography>
        <DateCell
          value={datelastop}
          flexDirection="row"
          backgroundColor="#ffff"
          variant="outlined"
        />
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Тип кошелька:
        </Typography>
        <WalletTypeCell value={wallettype} />
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Статус:
        </Typography>
        <StatusCell value={blocked} />
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
        <LimitCell limit={daylimit} remain={dayremain} />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Месячный:
        </Typography>
        <LimitCell limit={monthlimit} remain={monthremain} />
      </Grid2>
    </Grid2>
  </Grid2>
);

type CardListProperties = {
  cards: CardType[];
  isLoading: boolean;
};

function CardsList({ cards, isLoading }: CardListProperties) {
  const cardListItems: DataListItemProps[] = cards.map((card) => {
    const bodyElement = getCardBodyElement(card);
    const headerElement = CardListHeader(card);

    return {
      id: card.cardnum.toString(),
      header: headerElement,
      body: bodyElement,
    };
  });

  return <DataList items={cardListItems} isLoading={isLoading} />;
}

export default CardsList;
