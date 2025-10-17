import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchApiResponseData,
  getApiResponseFirmCardById,
  getAuthData,
} from '#root/store';
import { useAppDispatch, useAppSelector } from '../../hooks/state';

function CardDetails() {
  const { id: cardnum } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const cardNumber = Number(cardnum);
  const authData = useAppSelector(getAuthData);
  const card = useAppSelector((state) =>
    getApiResponseFirmCardById(state, cardNumber),
  );

  useEffect(() => {
    if (!card && authData) {
      dispatch(fetchApiResponseData(authData.firmId));
    }
  }, [authData, card, cardnum, dispatch]);

  if (!card) {
    return <div>Карта с номером {cardnum} не найдена</div>;
  }

  return <div> Детали карты</div>;
}

export default CardDetails;
