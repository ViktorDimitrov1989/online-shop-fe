import { ArticleState } from "./article-state";

import { CREATE_ARTICLE, GET_ARTICLES, GET_ARTICLE_OPTIONS, CREATE_BRAND, CreateArticleAction, GetArticlesAction, GetArticleOptions, CreateBrandAction} from "./article-actions";
import { createFeatureSelector, createSelector } from "@ngrx/store";

const initialState: ArticleState = {
    allArticles: [],
    brands: [],
    colors: [],
    sizes: [],
    categories: []
}

export function articleReducer(state = initialState, 
    action: CreateArticleAction | GetArticlesAction | GetArticleOptions | CreateBrandAction): ArticleState {
  
      switch(action.type) {
        case CREATE_ARTICLE: {
          return state;
        }
        case GET_ARTICLES: {
          return Object.assign({}, state, {allArticles: action.articles, brands: state.brands, colors: state.colors, sizes: state.sizes, categories: state.categories});
        }
        case GET_ARTICLE_OPTIONS:{
          return Object.assign({}, state, {allArticles: state.allArticles, brands: action.brands, colors: action.colors, sizes: action.sizes, categories: action.categories})
        }
        case CREATE_BRAND:{
          return Object.assign({}, state, {allArticles: state.allArticles, brands: state.brands.push(action.brand), colors: state.colors, sizes: state.sizes, categories: state.categories})
        }
        default: {
          return state;
        }
      }	
  } 
  
  export const getArticleState = createFeatureSelector<ArticleState>('articleState');
  
  export const getUsers = createSelector(
      getArticleState, 
      (state: ArticleState) => state
  ); 