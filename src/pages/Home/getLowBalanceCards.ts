import { CardInfoType } from '#root/types';

export type LowBalanceCard = CardInfoType & {
  fuelBalances: { fuelId: number; volume: number }[];
  totalBalance: number;
  lastUsed: number;
};

export function getLowBalanceCards(cards: CardInfoType[]): LowBalanceCard[] {
  const lowBalanceCards = cards
    .filter((card) => !card.blocked && card.walletType !== 2 && card.sost === 'выдана')
    .map((card) => {
      const fuelBalances = Object.entries(card.wallets).map(([fuelId, volume]) => ({
        fuelId: +fuelId,
        volume: +volume,
      }));
      return {
        ...card,
        fuelBalances,
        totalBalance: fuelBalances.length > 0 ? Math.min(...fuelBalances.map((f) => f.volume)) : 0,
      };
    })
    .filter((card) => card.totalBalance < 50)
    .sort((a, b) => a.totalBalance - b.totalBalance)
    .slice(0, 5);

  const lowMonthRemainCards = cards
    .filter(
      (card) =>
        !card.blocked &&
        card.walletType === 2 &&
        +card.monthRemain !== 9999.99 &&
        card.sost === 'выдана',
    )
    .map((card) => ({
      ...card,
      fuelBalances: [{ fuelId: 0, volume: +card.monthRemain }],
      totalBalance: +card.monthRemain,
    }))
    .filter((card) => card.totalBalance < 50)
    .sort((a, b) => a.totalBalance - b.totalBalance)
    .slice(0, 5);

  return [
    ...lowBalanceCards,
    ...lowMonthRemainCards.filter(
      (monthCard) =>
        !lowBalanceCards.some((balanceCard) => balanceCard.cardNumber === monthCard.cardNumber),
    ),
  ]
    .map((card) => ({ ...card, lastUsed: card.date ? new Date(card.date).getTime() : 0 }))
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, 5);
}
