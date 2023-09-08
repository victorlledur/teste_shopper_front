import styled from "styled-components";

export const FooterDiv = styled.div`
  display: flex;
  flex-direction: row;
  background-color : #060937;
  gap: 15%;
  width: 100%;
  height: 320px;
  align-items: center;
  justify-content: space-evenly;
  margin-top: auto;
  `;

export const ImgLogoFooter = styled.img`
  display: flex;
  background-color : #060937;
`;

export const FooterInnerDivs = styled.div`
  display: flex;
  flex-direction: column;
  background-color : #060937;
  width: 33%;
  align-items: center;
  justify-content: space-evenly;
  bottom: 0;
  line-height: 6px;
  color: white;
  text-align: center;
  gap: 20px;
`;

export const FooterInnerDivCenter = styled.div`
display: flex;
flex-direction: column;
line-height: 0.1;
color: white;
font-size: 16px;
line-height: 24px;
border: 0;
margin: 0;
`

export const FooterInnerDivsRight = styled.div`
  display: flex;
  flex-direction: column;
  background-color : #060937;
  width: 100%;
  height: 50%;
  align-items: flex-start;
  justify-content: center;
  gap: 15px;
  margin-left: 60%;
`;

export const FooterInnerDivsRightIcons = styled.div`
  display: flex;
  flex-direction: row;
  background-color : #060937;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  gap: 1%;
`;

export const FaceInstaIcons = styled.img`
  width: 23px;
  height: 23px;
`;

export const AstoreGplayIcons = styled.img`
  width: 100px;
  height: 30px;
`;

export const Text = styled.p`
margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    margin: 0px;
    padding: 0px;
    font-family: Lato;
    font-size: 16px;
`

export const TextTitle = styled.p`
margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    margin: 0px;
    padding: 0px;
    font-weight: bold;
    font-family: Lato;
`
export const TextTitleRight = styled.p`
margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    margin: 0px;
    padding: 0px;
    font-weight: bold;
    font-family: Lato;
    text-align: left;
`
export const RightTitleDivs = styled.div`
display: flex;
justify-content: flex-start;
text-align: right;
`
