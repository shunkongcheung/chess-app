import React, { memo } from "react";
import styled from "styled-components";

const Container = styled.button`
  background: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 15px;
  cursor: pointer;
  width: 100px;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = (props) => {
  return <Container {...props} />;
};

export default memo(Button);
