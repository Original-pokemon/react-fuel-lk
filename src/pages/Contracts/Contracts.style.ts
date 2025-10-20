import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const ContractsStyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: '10px',
}));

export default ContractsStyledBox;
