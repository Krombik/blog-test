import Card from "@material-ui/core/Card";
import styled from "styled-components";

export const StyledArticlePreview = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 0;
`;

export const TagList = styled.ul`
  padding: 0 8px;
  margin: 8px 0 0;
  & > li {
    margin-bottom: 8px;
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;
