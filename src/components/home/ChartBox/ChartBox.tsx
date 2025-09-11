import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type ChartBoxProperties = {
  data: { name: string; value: number }[];
  chartType?: 'line' | 'bar' | 'pie';
};

const primaryBlue = '#335A8C'; // From src/styles/theme.ts

// Function to get bar color based on fuel level
const getFuelBarColor = (value: number): string => {
  if (value < 100) return '#f44336'; // Red for low fuel
  if (value <= 500) return '#ff9800'; // Orange/Yellow for medium fuel
  return '#4caf50'; // Green for sufficient fuel
};

type CustomTooltipProperties = {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProperties) {
  if (active && payload && payload.length > 0) {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
        }}
      >
        <Typography variant="body2">{`День: ${label}`}</Typography>
        <Typography
          variant="body2"
          sx={{ color: primaryBlue }}
        >{`Расходы: ${payload[0].value} ₽`}</Typography>
      </Box>
    );
  }
}

function ChartBox({ data, chartType = 'line' }: ChartBoxProperties) {
  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={70} />
          <Tooltip
            formatter={(value: number) => [`${value} литров`, 'Остаток']}
            labelFormatter={(label: string) => `Топливо: ${label}`}
          />
          <Bar dataKey="value">
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={getFuelBarColor(entry.value)}
              />
            ))}
          </Bar>
        </BarChart>
      );
    }

    // Default line chart
    return (
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={primaryBlue}
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '16rem' }}>
      <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
    </Box>
  );
}

export default ChartBox;
