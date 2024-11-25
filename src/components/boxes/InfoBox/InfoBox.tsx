import { Box, Typography } from '@mui/material';
import { Fragment } from 'react';
import InfoStyledBox from './InfoBox.style';

type InfoItem = Record<string, string | number | JSX.Element>;

type InfoBoxProperties = {
  title: string;
  data: InfoItem[];
};

function InfoBox({ title, data }: InfoBoxProperties) {
  return (
    <InfoStyledBox>
      <Typography variant="h5" component="h1">
        {title}
      </Typography>
      <Box className="list">
        {data.map((item) => (
          <Box className="listItem" key={title + item}>
            {Object.entries(item).map(([key, value]) => (
              <Fragment key={key}>
                <Typography className="name">{key}</Typography>
                <Typography className="value">{value}</Typography>
              </Fragment>
            ))}
          </Box>
        ))}
      </Box>
    </InfoStyledBox>
  );
}

export default InfoBox;
