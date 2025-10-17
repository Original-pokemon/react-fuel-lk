import type { DataListItemHeaderPropertiesType } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItemHeader';
import type { CardInfoType } from '#root/types';
import CardAvatar from '#root/components/CardAvatar/CardAvatar';
import CardDetailsButton from '../CardTable/cells/CardDetailsButton/CardDetailsButton';

const CardListHeader = ({
  cardNumber,
}: CardInfoType): DataListItemHeaderPropertiesType => ({
  avatar: <CardAvatar cardnum={cardNumber} />,
  action: <CardDetailsButton cardnum={cardNumber} iconSize="1.8rem" />,
});

export default CardListHeader;
