import { DataTable } from "#root/components/layouts/data-layouts/DataTable/DataTable";
import { useFirmStore } from "#root/store";
import { Status } from "#root/const";
import Spinner from "#root/components/Spinner/Spinner";
import { CardInfoType } from "#root/types";
import CardsColumns from "./СardsСolumns";

type CardsTable = {
  cards: CardInfoType[];
};

function CardTable({ cards }: CardsTable) {
  const { status } = useFirmStore();

  const isIdle = status === Status.Idle;
  const isLoading = status === Status.Loading;
  const isError = status === Status.Error;
  const isSuccess = status === Status.Success;

  const rows = cards.map(
    ({
      cardOwner,
      date,
      cardNumber,
      walletType,
      blocked,
      dayRemain,
      dayLimit,
      monthRemain,
      monthLimit,
      sost,
    }) => ({
      id: cardNumber,
      cardnum: cardNumber,
      cardowner: cardOwner,
      blocked,
      wallettype: walletType,
      monthlimit: +monthLimit,
      monthremain: +monthRemain,
      daylimit: +dayLimit,
      dayremain: +dayRemain,
      datelastop: new Date(date),
      sost,
    }),
  );

  if (isIdle) {
    return <Spinner />;
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
