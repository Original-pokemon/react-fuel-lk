import { PaperProps, Typography } from '@mui/material';
import { ProgressBar } from './ProgressBar/ProgressBar';

type Properties = {
  limit: number;
  remain: number;
} & PaperProps;

function LimitCell({ limit, remain, ...rest }: Properties) {
  const progress = limit > 0 ? remain / limit : 0;

  return limit ? (
    <ProgressBar value={progress} label={`${remain} / ${limit}`} {...rest} />
  ) : (
    <Typography variant="body2">Не установлен</Typography>
  );
}

export default LimitCell;
