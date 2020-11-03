import React, { memo } from "react";
import styled from "styled-components";

const Container = styled.ul`
  list-style-type: none;
  margin-top: 0;
`;

interface ListItemGroupProps extends React.HTMLAttributes<HTMLUListElement> {}

const ListItemGroup: React.FC<ListItemGroupProps> = (props) => {
  return <Container {...props} />;
};

export default memo(ListItemGroup);
