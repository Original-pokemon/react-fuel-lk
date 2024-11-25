import { Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { green, red } from '@mui/material/colors';
import { StatusCellStyled } from './StatusCell.style';

const getStatusColor = (value: boolean, brightness: keyof typeof green) =>
  value ? red[brightness] : green[brightness];

const getText = (value: boolean) => (value ? 'Заблокирована' : 'Активна');

function StatusCell({ value }: { value: boolean }) {
  const textColor = getStatusColor(value, 500);
  const icon = value ? (
    <CloseIcon sx={{ color: textColor, mr: 0.5, fontSize: 16 }} />
  ) : (
    <CheckIcon sx={{ color: textColor, mr: 0.5, fontSize: 16 }} />
  );

  return (
    <StatusCellStyled
      variant="outlined"
      backgroundColor={getStatusColor(value, 50)}
    >
      {icon}
      <Typography variant="subtitle2" color={textColor} fontSize="0.8rem">
        {getText(value)}
      </Typography>
    </StatusCellStyled>
  );
}

export default StatusCell;
