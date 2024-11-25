import type { DataListItemHeaderPropertiesType } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItemHeader';
import type { CardType } from '#root/types';
import CardAvatar from '#root/components/CardAvatar/CardAvatar';
import CardDetailsButton from '../CardTable/cells/CardDetailsButton/CardDetailsButton';

const CardListHeader = ({
  cardnum,
}: CardType): DataListItemHeaderPropertiesType => ({
  avatar: <CardAvatar cardnum={cardnum} />,
  action: <CardDetailsButton cardnum={cardnum} iconSize="ж1.8rem" />,
});

export default CardListHeader;
