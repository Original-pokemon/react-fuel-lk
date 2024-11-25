const getFormattedCardNumber = (cardNumber: string | number): string => {
  const cardString = cardNumber.toString();
  const lastFourDigits =
    cardString.length >= 4 ? cardString.slice(-4) : cardString;
  return `*${lastFourDigits}`;
};

export default getFormattedCardNumber;
