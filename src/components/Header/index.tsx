import Logo from "../../assets/logo-original.webp";
import { HeaderDiv, ImgLogoHeader } from "./styles";

function Header() {
    return (
        <header>
        <HeaderDiv>
            <ImgLogoHeader src={Logo} alt="Logp" />
        </HeaderDiv>
        </header >
    )
}

export default Header