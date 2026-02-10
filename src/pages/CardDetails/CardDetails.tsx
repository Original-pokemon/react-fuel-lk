import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApiResponseStore, useAuthStore } from "#root/store";
import { useApi } from "#root/hooks";

function CardDetails() {
  const { id: cardnum } = useParams<{ id: string }>();
  const api = useApi();
  const { authData } = useAuthStore();
  const { cards, fetchApiResponseData } = useApiResponseStore();

  const cardNumber = Number(cardnum);
  const card = cards.find((c) => c.cardNumber === cardNumber);

  useEffect(() => {
    if (!card && authData?.firmId) {
      fetchApiResponseData(authData.firmId, api);
    }
  }, [authData?.firmId, card, fetchApiResponseData, api]);

  if (!card) {
    return <div>Карта с номером {cardnum} не найдена</div>;
  }

  return <div> Детали карты</div>;
}

export default CardDetails;
