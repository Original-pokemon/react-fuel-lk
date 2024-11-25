import { Typography, Stack } from '@mui/material';

type DetailsRowProperties = {
  label: React.ReactNode;
  value: React.ReactNode;
  direction: 'row' | 'column';
};

function DetailsRow({ label, value, direction = 'row' }: DetailsRowProperties) {
  return (
    <Stack direction={direction} spacing={1} alignItems="center">
      {typeof label === 'string' ? (
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      ) : (
        label
      )}
      {value}
    </Stack>
  );
}

export default DetailsRow;
