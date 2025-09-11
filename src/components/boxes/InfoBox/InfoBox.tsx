import { Box, Stack, Typography } from '@mui/material';
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
      <Stack className="list">
        {data.map((item) => (
          <Stack
            className="listItem"
            key={title + Object.keys(item).join(',')}
            direction="row"
            alignContent="flex-start"
          >
            {Object.entries(item).map(([key, value]) => (
              <Fragment key={key}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  fontSize={18}
                  className="name"
                >
                  {key}
                </Typography>
                <Typography variant="body1" className="value">
                  {value}
                </Typography>
              </Fragment>
            ))}
          </Stack>
        ))}
      </Stack>
    </InfoStyledBox>
  );
}

export default InfoBox;
