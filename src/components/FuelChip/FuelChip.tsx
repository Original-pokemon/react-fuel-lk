import { Chip, getContrastRatio, useTheme } from '@mui/material';
import { useAppSelector } from '#root/hooks/state';
import { getNomenclatureInfo } from '#root/store';

type FuelChipProperties = {
  fuelId: number;
};

function FuelChip({ fuelId }: FuelChipProperties) {
  const theme = useTheme();
  const nomenclature = useAppSelector(getNomenclatureInfo);

  const fuel = nomenclature?.find((item) => item.fuelid === fuelId);
  const fuelName = fuel ? fuel.fuelname : 'Неизвестное топливо';
  const color = theme.palette.fuelColors[fuelId] || '#CCCCCC';

  const contrastTextColor =
    getContrastRatio(color, theme.palette.common.black) > 4.5
      ? theme.palette.text.primary
      : theme.palette.text.secondary;

  return (
    <Chip
      label={fuelName}
      sx={{
        backgroundColor: color,
        color: contrastTextColor,
        fontWeight: 'bold',
      }}
    />
  );
}

export default FuelChip;
