import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Spinner from '#root/components/Spinner/Spinner';
import { getAuthStatus } from '#root/store';
import { postAuthData } from '#root/store/slice/auth-data/thunk';
import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import AppRoute from '#root/const/app-route';

type LoginFormData = {
  username: string;
  password: string;
  rememberMe: boolean;
};

const schema = yup.object({
  username: yup
    .string()
    .required('Имя пользователя обязательно.')
    .matches(/^[\w.-]{3,20}$/, 'Пожалуйста, введите валидное имя пользователя.')
    .trim(),
  password: yup
    .string()
    .required('Пароль обязателен.')
    .min(3, 'Пароль должен содержать не менее 3 символов.')
    .matches(/^\S*$/, 'Пароль не должен содержать пробелы.'),
  rememberMe: yup.boolean().default(false),
});

const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const char = event.key;
  const regex = /^[\w-]+$/;
  if (!regex.test(char)) {
    event.preventDefault();
  }
};

function Login() {
  const dispatch = useAppDispatch();
  const { isSuccess, isLoading } = useAppSelector(getAuthStatus);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    delayError: 500,
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(postAuthData(data));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((previous) => !previous);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(AppRoute.Main);
    }
  }, [isSuccess, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {isLoading && <Spinner fullscreen size={70} />}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Вход в систему
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.username}
                sx={(theme) => ({
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.primary,
                  },
                })}
                helperText={errors.username?.message}
                margin="normal"
                required
                fullWidth
                label="Имя пользователя"
                autoComplete="username"
                autoFocus
                onKeyDown={handleKeyPress}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.password}
                sx={(theme) => ({
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.primary,
                  },
                })}
                helperText={errors.password?.message}
                margin="normal"
                required
                fullWidth
                label="Пароль"
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                onKeyDown={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    value={field.value}
                    sx={(theme) => ({
                      color: theme.palette.grey[500],
                      '&.Mui-checked': {
                        color: theme.palette.text.primary,
                      },
                    })}
                    color="secondary"
                  />
                }
                label="Запомнить меня"
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !isValid}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;