import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFirmData, getFirmCardById } from '#root/store';
import { useAppDispatch, useAppSelector } from '../../hooks/state';

function CardDetails() {
  const { id: cardnum } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const cardNumber = Number(cardnum);
  const card = useAppSelector((state) => getFirmCardById(state, cardNumber));

  useEffect(() => {
    if (!card) {
      dispatch(fetchFirmData());
    }
  }, [card, cardnum, dispatch]);

  if (!card) {
    return <div>Карта с номером {cardnum} не найдена</div>;
  }

  return <div> Детали карты</div>;
}

export default CardDetails;
