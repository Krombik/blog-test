import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { FC, MouseEvent, memo, useCallback } from "react";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { State, ThunkDispatcher } from "../../types";
import UnauthorizedButtons from "./UnauthorizedButtons";
import AuthorizedButtons from "./AuthorizedButtons";
import NextLink from "next/link";
import { setModal } from "../../redux/modal/actions";
import { ModalType } from "../../redux/modal/type";
import SettingsDial from "./SettingsDial";
import { SITE_NAME } from "../../utils/constant";

const selectData = createSelector(
  (state: State) => state.authentication.currentUserName,
  (currentUserName) => ({ currentUserName })
);

const Header: FC = memo(() => {
  const dispatch = useDispatch<ThunkDispatcher>();
  const { currentUserName } = useSelector(selectData);
  const openModal = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    dispatch(setModal(true, e.currentTarget.name as ModalType));
  }, []);
  return (
    <AppBar position="static" color="default">
      <Container maxWidth="lg">
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Typography variant="h6">
              <NextLink as="/" href="/" passHref>
                <Link color="inherit" underline="none">
                  {SITE_NAME}
                </Link>
              </NextLink>
            </Typography>
            <div>
              {currentUserName ? (
                <AuthorizedButtons
                  openModal={openModal}
                  currentUserName={currentUserName}
                />
              ) : (
                <UnauthorizedButtons openModal={openModal} />
              )}
              <SettingsDial />
            </div>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
});

export default Header;
