import { wrapper } from "@/redux/store";
import Layout from "@/components/common/Layout";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import { useEffect, FC, useMemo } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import makeTheme from "@/utils/makeTheme";
import { AppProps } from "next/app";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { State } from "@/types";
import GlobalStyle from "@/components/common/GlobalStyle";
import { ThemeProvider } from "styled-components";
import "@/font.css";

const selectData = createSelector(
  (state: State) => state.common.dark,
  (dark) => ({ dark })
);

const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const { dark } = useSelector(selectData);
  useEffect(() => {
    document.querySelector("#jss-server-side")?.remove();
  }, []);
  const theme = useMemo(() => makeTheme(dark), [dark]);
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={theme}>
          <GlobalStyle />
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MuiThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default wrapper.withRedux(WrappedApp);
