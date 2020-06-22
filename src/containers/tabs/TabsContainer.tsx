import RemovableTab from "./RemovableTab";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabList from "@material-ui/lab/TabList";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { State, ThunkDispatcher } from "../../types";
import { useDispatch } from "react-redux";
import { moveTab } from "../../redux/articleTabs/actions";
import { FC } from "react";
import { TabType } from "../../types/tab";
import AddNewTabButton from "./AddNewTabButton";
import Router from "next/router";
import { tabKeyDecoder } from "../../utils/tabKeyDecoder";
import SortableList from "../common/SortableList";

const selectData = createSelector(
  (state: State) => state.articleTabs.tabOrder,
  (state: State) => state.articleTabs.articlePageNumbers,
  (tabOrder, articlePageNumbers) => ({ tabOrder, articlePageNumbers })
);

type Props = {
  tabList: TabType[];
};

const TabsContainer: FC<Props> = ({ tabList }) => {
  const { tabOrder, articlePageNumbers } = useSelector(selectData);
  const dispatch = useDispatch<ThunkDispatcher>();
  const handleChange = (_: any, newValue: string) => {
    if (newValue !== "add") {
      const { type, value } = tabKeyDecoder(newValue);
      const page = articlePageNumbers[newValue] + 1;
      const path =
        type !== "default"
          ? {
              pathname: "/",
              query: { [type]: value, ...(page > 1 ? { page } : {}) },
            }
          : `/${page > 1 ? "?page=" + page : ""}`;
      Router.push(path, path, { shallow: true });
    }
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    dispatch(moveTab(oldIndex, newIndex));
  };
  const tabs = [
    <Tab value="default-" label="Last articles" key={1} />,
    ...tabList.map((tab, index) => (
      <RemovableTab
        value={tab.key}
        tab={tab}
        key={index + 2}
        articlesPagesNumber={articlePageNumbers}
        tabIndex={tabOrder.findIndex((key) => key === tab.key)}
      />
    )),
    <AddNewTabButton
      key={tabOrder.length + 2}
      value={"add"}
      articlesPagesNumber={articlePageNumbers}
    />,
  ];
  return (
    <AppBar position="static" color="default">
      <SortableList
        axis={"x"}
        lockAxis={"x"}
        distance={10}
        onSortEnd={onSortEnd}
      >
        <TabList
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs}
        </TabList>
      </SortableList>
    </AppBar>
  );
};

export default TabsContainer;