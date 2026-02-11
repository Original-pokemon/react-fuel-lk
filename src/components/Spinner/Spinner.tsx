import { Box, CircularProgress, CircularProgressProps } from "@mui/material";

type SpinnerProperties = {
  fullscreen?: boolean; // Если true, спиннер будет блокировать весь экран
} & CircularProgressProps;

function Spinner({
  fullscreen = false,
  size = 40,
  ...rest
}: SpinnerProperties) {
  if (fullscreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        <CircularProgress size={size} {...rest} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress size={size} {...rest} />
    </Box>
  );
}

export default Spinner;
