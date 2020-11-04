import React, { memo } from "react";
import styled from "styled-components";

const Container = styled.li`
  border: 1px solid #ccc;
  padding: 20px;
`;

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const ListItem: React.FC<ListItemProps> = (props) => {
  return <Container {...props} />;
};

export default memo(ListItem);
