import { ActionTypes, ArticleActions } from "./type";
import { TabType } from "../../types/tab";
import { moveFromTo } from "../../utils/moveFromTo";
import { tabKeyDecoder } from "../../utils/tabKeyDecoder";

type State = {
  articlesPerPageCount: number;
  currTab: string;
  tabList: TabType[];
  tabOrder: string[];
  articlePageNumbers: { [key: string]: number };
};

const initialState: State = {
  articlesPerPageCount: 10,
  tabList: [],
  tabOrder: [],
  currTab: "default-",
  articlePageNumbers: { "default-": 0 },
};

export default function reducer(
  state = initialState,
  action: ArticleActions
): State {
  switch (action.type) {
    case ActionTypes.SET_ARTICLES_PER_PAGE_COUNT:
      return {
        ...state,
        articlesPerPageCount: action.payload,
      };
    case ActionTypes.ADD_TAB:
      return {
        ...state,
        tabOrder: [...state.tabOrder, action.payload.key],
        tabList: [
          ...state.tabList,
          { ...action.payload.newTab, key: action.payload.key },
        ],
        currTab: action.payload.key,
        articlePageNumbers: {
          ...state.articlePageNumbers,
          [action.payload.key]: action.payload.page,
        },
      };
    case ActionTypes.ADD_TABS:
      return {
        ...state,
        tabOrder: action.payload,
        tabList: action.payload.map((key) => ({ ...tabKeyDecoder(key), key })),
        articlePageNumbers: {
          ...Object.fromEntries(action.payload.map((key) => [key, 0])),
          ...state.articlePageNumbers,
        },
      };
    case ActionTypes.REMOVE_TAB:
      return {
        ...state,
        tabList: state.tabList.filter((item) => item.key !== action.payload),
        tabOrder: state.tabOrder.filter((item) => item !== action.payload),
        articlePageNumbers: {
          ...state.articlePageNumbers,
          [action.payload]: undefined,
        },
      };
    case ActionTypes.SET_TAB:
      return {
        ...state,
        currTab: action.payload,
      };
    case ActionTypes.MOVE_TAB:
      return {
        ...state,
        tabOrder: moveFromTo(
          state.tabOrder,
          action.payload.from,
          action.payload.to
        ),
      };
    case ActionTypes.SET_PAGE_NUMBER:
      return {
        ...state,
        articlePageNumbers: {
          ...state.articlePageNumbers,
          [action.payload.key]: action.payload.page,
        },
      };
    case ActionTypes.SERVER_SET_TAB:
      return {
        ...state,
        currTab: action.payload.currTab,
        articlePageNumbers: {
          ...state.articlePageNumbers,
          [action.payload.currTab]: action.payload.page,
        },
      };
    default:
      return state;
  }
}
