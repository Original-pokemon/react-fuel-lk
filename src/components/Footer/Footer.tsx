import Logo from '../logo/Logo';
import { FooterStyledBox } from './Footer.style';

function Footer({ className }: { className?: string }) {
  return (
    <FooterStyledBox className={className}>
      <Logo />
    </FooterStyledBox>
  );
}

export default Footer;
