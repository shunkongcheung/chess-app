import React, { memo } from "react";
import styled from "styled-components";

const Container = styled.li`
  list-style-type: none;
  margin-top: 0;
`;

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const ListItem: React.FC<ListItemProps> = (props) => {
  return <Container {...props} />;
};

export default memo(ListItem);
