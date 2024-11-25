import React from 'react';
import type { CardType } from '#root/types';
import InfoBox from '../InfoBox/InfoBox';

type CardsSummaryProperties = {
  cards: CardType[];
};

// Текстовые лейблы
const TOTAL_CARDS_LABEL: string = 'Всего карт';
const BLOCKED_CARDS_LABEL: string = 'Заблокированных карт';
const TOTAL_MONTH_LIMIT_LABEL = 'Общий месячный лимит';
const TOTAL_MONTH_REMAIN_LABEL: string = 'Оставшийся месячный лимит';
const TOTAL_DAY_LIMIT_LABEL: string = 'Общий дневной лимит';
const TOTAL_DAY_REMAIN_LABEL: string = 'Оставшийся дневной лимит';

const CardsSummary: React.FC<CardsSummaryProperties> = ({ cards }) => {
  const totalCards = cards.length;
  const blockedCards = cards.filter((card) => card.blocked).length;
  const totalMonthLimit = cards.reduce((sum, card) => sum + card.monthlimit, 0);
  const totalMonthRemain = cards.reduce(
    (sum, card) => sum + card.monthremain,
    0,
  );
  const totalDayLimit = cards.reduce((sum, card) => sum + card.daylimit, 0);
  const totalDayRemain = cards.reduce((sum, card) => sum + card.dayremain, 0);

  const cardsData = [
    { [TOTAL_CARDS_LABEL]: totalCards },
    { [BLOCKED_CARDS_LABEL]: blockedCards },
    { [TOTAL_MONTH_LIMIT_LABEL]: `${totalMonthLimit} руб.` },
    { [TOTAL_MONTH_REMAIN_LABEL]: `${totalMonthRemain} руб.` },
    { [TOTAL_DAY_LIMIT_LABEL]: `${totalDayLimit} руб.` },
    { [TOTAL_DAY_REMAIN_LABEL]: `${totalDayRemain} руб.` },
  ];

  return <InfoBox title="Топливные карты" data={cardsData} />;
};

export default CardsSummary;
