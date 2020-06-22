import styled from "styled-components";
import Tab from "@material-ui/core/Tab";

export const StyledAddNewTabButton = styled(Tab)`
  min-width: 0;
  order: 9999;
  .MuiGrid-item {
    width: 0;
    transition: 0.3s ease-in-out;
  }
`;