import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApiResponseStore, useAuthStore } from "#root/store";
function CardDetails() {
  const { id: cardnum } = useParams<{ id: string }>();
  const { authData } = useAuthStore();
  const { cards, fetchApiResponseData } = useApiResponseStore();

  const cardNumber = Number(cardnum);
  const card = cards.find((c) => c.cardNumber === cardNumber);

  useEffect(() => {
    if (!card && authData?.firmId) {
      fetchApiResponseData(authData.firmId);
    }
  }, [authData?.firmId, card, fetchApiResponseData]);

  if (!card) {
    return <div>Карта с номером {cardnum} не найдена</div>;
  }

  return <div> Детали карты</div>;
}

export default CardDetails;
