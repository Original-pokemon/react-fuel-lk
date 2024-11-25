import { Box, Typography } from '@mui/material';
import singleStyle from './Single.style';

type Properties = {
  img?: string;
  title: string;
  details: {
    [key: string]: string | JSX.Element;
  };
  otherDetails?: JSX.Element[];
  dataGrid?: JSX.Element;
};

function Single(properties: Properties) {
  const { img, title, details, otherDetails, dataGrid } = properties;

  return (
    <Box className="single" css={singleStyle}>
      <Box className="view">
        <Box className="info">
          <Box className="topInfo">
            {img && <img src={img} alt="img" />}
            <Typography variant="h5" component="h1">
              {title}
            </Typography>
          </Box>
          <Box className="details">
            {Object.entries(details).map(([key, value]) => (
              <Box className="item" key={key}>
                <Typography className="itemTitle" component="span">
                  {key}
                </Typography>
                <Typography className="itemValue" component="span">
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {otherDetails && (
          <Box className="otherDetails">
            {otherDetails.map((detail) => (
              <Box className="otherDetail" key={detail.key}>
                {detail}
              </Box>
            ))}
          </Box>
        )}

        {dataGrid && <Box className="rightSideBlock">{dataGrid}</Box>}
      </Box>
    </Box>
  );
}

export default Single;
