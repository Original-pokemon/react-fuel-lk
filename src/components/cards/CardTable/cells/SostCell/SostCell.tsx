import { Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { green, red, grey } from '@mui/material/colors';
import SostCellStyled from './SostCell.style';

const getDisplayText = (value: string) => {
  const mapping: Record<string, string> = {
    выдана: 'Выдана',
    испорчена: 'Испорчена',
    'не выдана': 'Не выдана',
    пустая: 'Пустая',
    утеряна: 'Утеряна',
    чс: 'Черный список',
  };
  return mapping[value] || value;
};

const getSostConfig = (value: string) => {
  const text = getDisplayText(value);
  if (value === 'выдана') {
    return {
      color: green[500],
      backgroundColor: green[50],
      icon: <CheckIcon sx={{ color: green[500], mr: 0.5, fontSize: 16 }} />,
      text,
    };
  }
  if (['чс', 'утеряна', 'испорчена'].includes(value)) {
    return {
      color: red[500],
      backgroundColor: red[50],
      icon: <CloseIcon sx={{ color: red[500], mr: 0.5, fontSize: 16 }} />,
      text,
    };
  }
  return {
    color: grey[500],
    backgroundColor: grey[50],
    icon: undefined,
    text,
  };
};

function SostCell({ value }: { value: string }) {
  const { color, backgroundColor, icon, text } = getSostConfig(value);

  return (
    <SostCellStyled variant="outlined" backgroundColor={backgroundColor}>
      {icon}
      <Typography variant="subtitle2" color={color} fontSize="0.8rem">
        {text}
      </Typography>
    </SostCellStyled>
  );
}

export default SostCell;
