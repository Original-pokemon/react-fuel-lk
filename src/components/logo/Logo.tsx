import { NavLink } from 'react-router-dom';
import AppRoute from '#root/const/app-route';
import { logoStyle } from './Logo.style';

function Logo() {
  return (
    <NavLink className="logo" css={logoStyle} to={AppRoute.Main}>
      <img src="logo.svg" alt="logo" />
    </NavLink>
  );
}

export default Logo;
