import Logo from "../../assets/logo-original.webp";
import Astore from "../../assets/icon-applestore.webp";
import Face from "../../assets/icon-facebook.webp";
import Gplay from "../../assets/icon-googleplay.webp";
import Insta from "../../assets/icon-instagram.webp";
import { FooterDiv, ImgLogoFooter, FooterInnerDivs, FooterInnerDivCenter, FooterInnerDivsRight, FooterInnerDivsRightIcons, FaceInstaIcons, AstoreGplayIcons, Text, TextTitle, TextTitleRight, RightTitleDivs } from "./styles";

function Footer() {
    return (
        <footer>
            <FooterDiv>
                <FooterInnerDivs>
                    <ImgLogoFooter src={Logo} alt="Logo" />
                    <div>
                        <TextTitle>+55 11 3661-1712</TextTitle>
                        <p>contato@shopper.com.br</p>
                    </div>
                    <div>
                        <p>CNPJ 24.583557/0001-60</p>
                        <p>São Paulo - SP</p>
                    </div>
                </FooterInnerDivs>
                <FooterInnerDivCenter>
                    <TextTitle>Sobre nós</TextTitle>
                    <Text>Carreiras</Text>
                    <Text>Contato</Text>
                    <Text>Imprensa</Text>
                    <Text>Termos de Uso</Text>
                    <Text>Política de Privacidade</Text>
                </FooterInnerDivCenter>
                <FooterInnerDivs>
                    <FooterInnerDivsRight>
                        <RightTitleDivs>
                            <TextTitleRight>Social</TextTitleRight>
                        </RightTitleDivs>
                        <FooterInnerDivsRightIcons>
                            <FaceInstaIcons src={Face} alt="Facebook" />
                            <FaceInstaIcons src={Insta} alt="Instagram" />
                        </FooterInnerDivsRightIcons>
                    </FooterInnerDivsRight>
                    <FooterInnerDivsRight>
                        <RightTitleDivs>
                            <TextTitleRight>Disponível em</TextTitleRight>
                        </RightTitleDivs>
                        <FooterInnerDivsRightIcons>
                            <AstoreGplayIcons src={Gplay} alt="Google Play" />
                            <AstoreGplayIcons src={Astore} alt="Apple Store" />
                        </FooterInnerDivsRightIcons>
                    </FooterInnerDivsRight>
                </FooterInnerDivs>
            </FooterDiv>
        </footer >
    )
}

export default Footer