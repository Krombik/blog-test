import { wrapper } from "../src/redux/store";
import { ServerSideContext, PropsFromServer } from "../src/types";
import ArticleList from "../src/containers/article/ArticlesList";
import { getArticlesUrl } from "../src/api/article";
import { NextPage } from "next";
import SortableTabs from "../src/containers/tabs/SortableTabs";
import {
  serverSetOffset,
  setPageNumber,
  addTab,
} from "../src/redux/articleTabs/actions";
import DefaultErrorPage from "next/error";
import Banner from "../src/containers/common/Banner";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { ArticlesObj } from "../src/types/article";
import fetcher from "../src/utils/fetcher";
import { parseCookies } from "nookies";
import { serverSetAuthorized } from "../src/redux/authentication/actions";
import { TabQuery } from "../src/types/tab";
import { TabValues, SITE_NAME } from "../src/utils/constant";
import Gutter from "../src/components/common/Gutter";
import TabBar from "../src/components/tabs/TabBar";

const Index: NextPage<PropsFromServer<typeof getServerSideProps>> = ({
  initialArticles,
  initialTab,
}) =>
  initialArticles?.status && !initialArticles.articles ? (
    <DefaultErrorPage statusCode={initialArticles.status} />
  ) : (
    <>
      <Banner justify="center">
        <Grid
          item
          component={Typography}
          variant="h1"
          color="textPrimary"
          css={`
            margin-top: 25px;
            margin-bottom: 25px;
          `}
        >
          {SITE_NAME}
        </Grid>
      </Banner>
      <TabBar>
        <SortableTabs />
      </TabBar>
      <Gutter>
        <ArticleList
          initialData={initialArticles}
          initialTab={initialTab}
          emptyType={TabValues.DEFAULT}
          valueKey="value"
        />
      </Gutter>
    </>
  );

export const getServerSideProps = wrapper.getServerSideProps(
  async (ctx: ServerSideContext) => {
    const { page, ...initialTab }: TabQuery = ctx.query;
    const { token, offset = 20 } = parseCookies(ctx);
    if (
      initialTab.type &&
      (initialTab.type !== TabValues.TAG || !initialTab.value) &&
      (initialTab.type !== TabValues.FEED || !token)
    ) {
      ctx.res.writeHead(301, { Location: "/" }).end();
      return null;
    }
    if (!initialTab.type) initialTab.type = TabValues.DEFAULT;
    if (token) await ctx.store.dispatch(serverSetAuthorized(token));
    const initialPage = page && +page > 0 ? +page - 1 : 0;
    const initialArticles = await fetcher.get<ArticlesObj>(
      getArticlesUrl(initialTab.type, initialTab.value, initialPage, +offset),
      token
    );
    let key = initialTab.type;
    if (initialTab.type === TabValues.TAG) {
      key = initialTab.type + "-" + initialTab.value;
      ctx.store.dispatch(addTab(key));
    }
    if (initialPage) ctx.store.dispatch(setPageNumber({ [key]: initialPage }));
    ctx.store.dispatch(serverSetOffset(+offset));
    return {
      props: {
        initialArticles,
        initialTab,
      },
    };
  }
);

export default Index;
