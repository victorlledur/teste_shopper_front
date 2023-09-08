import styled from "styled-components";

export const MainDiv = styled.div`
display: flex;
flex-direction: column;  
align-items: center;
min-height: 30rem;
`;

export const LabelButtonDiv = styled.div`
display: flex;
flex-direction: column;  
gap: 15px;
`;

export const Label = styled.label`
color: rgb(13, 171, 119);
font-size  :1.6rem ;  
align-self: center;

`;

export const Tilte = styled.h1`
color: rgb(13, 171, 119);
font-size  :2.3rem ;
`;

export const Input = styled.input`
color: white;
font-size  :1.5rem;
border: solid 2px rgb(13, 171, 119);
border-radius: 10px;
background-color : #060937;
padding: 5px;
`;

export const Buttons = styled.button`
color: white;
font-size  :1.5rem;
border: solid 2px;
border: solid 2px rgb(13, 171, 119);
border-radius: 10px;
background-color : #060937;
padding: 5px;
width: 10rem;
margin-top: 2%;
`;

export const ValidationDiv = styled.div`
color: black;
text-align: center;
display: flex;
flex-direction: column;  
font-size: 20px;
`;

export const ResultsDiv = styled.div`
color: black;
text-align: center;
display: flex;
flex-direction: column;  
font-size: 20px;
`;
