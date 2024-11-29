import { Typography, PaperProps, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import DateCellPaperStyled from './DateCell.style';

type DateCellProperties = {
  value: string;
  backgroundColor?: string;
  flexDirection?: 'column' | 'row'; // Новый пропс для изменения направления
} & PaperProps;

function DateCell({
  value,
  backgroundColor,
  flexDirection = 'column',
  ...rest
}: DateCellProperties) {
  const date = dayjs(value).locale('ru');
  const { palette } = useTheme();

  return (
    <DateCellPaperStyled
      backgroundColor={backgroundColor || palette.background.default}
      flexDirection={flexDirection} // Передаем направление
      {...rest}
    >
      <Typography
        variant="subtitle2"
        sx={{ marginRight: flexDirection === 'row' ? '0.5em' : 0 }}
      >
        {date.format('D MMM YYYY')}
      </Typography>
      <Typography variant="caption">{date.format('h:mm a')}</Typography>
    </DateCellPaperStyled>
  );
}

export { DateCell };
