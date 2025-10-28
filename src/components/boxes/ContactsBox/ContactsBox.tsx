import { Box, Typography } from '@mui/material';
import DashboardCard from '#root/components/home/DashboardCard/DashboardCard';

function ContactsBox() {
  return (
    <DashboardCard title="Контакты">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '18px' }}>Номер телефона:</Typography>
          <Typography variant="body2">+7 (495) 596-82-73</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '18px' }}>Почта:</Typography>
          <Typography variant="body2">ortk-pro@mail.ru</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '18px' }}>WhatsApp:</Typography>
          <Typography variant="body2">+7 (929) 643-15-49</Typography>
        </Box>
      </Box>
    </DashboardCard>
  );
}

export default ContactsBox;
