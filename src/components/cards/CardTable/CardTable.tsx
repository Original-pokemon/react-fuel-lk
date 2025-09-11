import DataTable from '#root/components/layouts/data-layouts/DataTable/DataTable';
import { useAppSelector } from '#root/hooks/state';
import { getFirmStatus } from '#root/store';
import Spinner from '#root/components/Spinner/Spinner';
import { CardType } from '#root/types';
import CardsColumns from './СardsСolumns';

type CardsTable = {
  cards: CardType[];
};

function CardTable({ cards }: CardsTable) {
  const { isIdle, isLoading, isError, isSuccess } =
    useAppSelector(getFirmStatus);

  const rows = cards.map((card) => ({
    id: card.cardnum,
    cardnum: card.cardnum,
    cardowner: card.cardowner,
    blocked: card.blocked,
    wallettype: card.wallettype,
    monthlimit: card.monthlimit,
    monthremain: card.monthremain,
    daylimit: card.daylimit,
    dayremain: card.dayremain,
    datedaylimit: card.datedaylimit,
    datelastop: new Date(card.datelastop),
  }));

  if (isIdle) {
    return <Spinner fullscreen />;
  }

  if (isError) {
    return <div>Ошибка при загрузке данных по картам</div>;
  }

  if (cards.length === 0 && isSuccess) {
    return <div>Нет данных по картам</div>;
  }

  return (
    <DataTable
      name="cards"
      columns={CardsColumns}
      rows={rows}
      loading={isLoading}
    />
  );
}

export default CardTable;
