import React from 'react';
import type { CardType } from '#root/types';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfoBox from '../InfoBox/InfoBox';

type CardsSummaryProperties = {
  cards: CardType[];
};

const TOTAL_CARDS_LABEL: string = 'Всего карт';
const BLOCKED_CARDS_LABEL: string = 'Заблокированных карт';

const CardsSummary: React.FC<CardsSummaryProperties> = ({ cards }) => {
  const navigate = useNavigate();

  const totalCards = cards.length;
  const blockedCards = cards.filter((card) => card.blocked).length;

  const handleTotalCardsClick = () => {
    navigate('/cards?filter=all'); // Перейти к списку всех карт
  };

  const handleBlockedCardsClick = () => {
    navigate('/cards?filter=blocked'); // Перейти к списку заблокированных карт
  };

  const cardsData = [
    {
      [TOTAL_CARDS_LABEL]: (
        <Typography
          sx={{ cursor: 'pointer', color: 'primary.main' }}
          onClick={handleTotalCardsClick}
        >
          {totalCards}
        </Typography>
      ),
    },
    {
      [BLOCKED_CARDS_LABEL]: (
        <Typography
          sx={{ cursor: 'pointer', color: 'primary.main' }}
          onClick={handleBlockedCardsClick}
        >
          {blockedCards}
        </Typography>
      ),
    },
  ];

  return <InfoBox title="Топливные карты" data={cardsData} />;
};

export default CardsSummary;
