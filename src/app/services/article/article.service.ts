import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app-state";
import { AppComponent } from "../../app.component";
import { CreateArticleAction, GetArticleOptions, CreateBrandAction, GetArticlesAction, CreateCategoryAction, FilterArticlesAction, GetAdvertsAction } from "../../store/article/article-actions";
import CreateArticle from "../../models/create-article";
import { CreateBrand } from "../../models/create-brand";
import { CreateCategory } from "../../models/create-category";

@Injectable()
export class ArticleService {


  private articlesFilters: any;
  private currentArticlesPage: number;
  private currentArticlePageSize: number;

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public store: Store<AppState>
  ) {

    this.subscribeToTheState();

  }

  subscribeToTheState() {
    this.store.select(state => state.articleState.currentArticlesFilters)
      .subscribe(stateFilters => {
        this.articlesFilters = stateFilters;
      })

    this.store.select(state => state.articleState.currentArticlesPage)
      .subscribe(stateArticlesPage => {
        this.currentArticlesPage = stateArticlesPage;
      })

    this.store.select(state => state.articleState.currentArticlesPageSize)
      .subscribe(stateArticlesPageSize => {
        this.currentArticlePageSize = stateArticlesPageSize;
      })
  }

  getArticleOptions(chosenSeason: string, chosenGender: string, allFlag: boolean) {
    this.http.post(AppComponent.API_URL + `/article/options`, {
      gender: chosenGender,
      season: chosenSeason,
      all: allFlag
    } ,{ withCredentials: true })
      .subscribe((respObject: any) => {
        let colors = respObject.response.colors;
        let sizes = respObject.response.sizes;
        let brands = respObject.response.brands;
        let categories = respObject.response.categories;
        this.store.dispatch(new GetArticleOptions(brands, colors, sizes, categories));
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  createArticle(articleToCreate: CreateArticle) {

    console.log(articleToCreate);
    let data = new FormData();
    let { name, description, brandName, price, status, expireDate, discount, colors, sizes, category, isAvailable } = articleToCreate;

    console.log({ name, description, brandName, price, status, expireDate, discount, colors, sizes, category, isAvailable })

    data.append('article', new Blob([JSON.stringify({ name, description, brandName, price, status, expireDate, discount, colors, sizes, category, isAvailable })],
      { type: 'application/json' }));

    if (articleToCreate.photo) {
      data.append('photo', articleToCreate.photo);
    }

    console.log(data);

    this.http.post(AppComponent.API_URL + "/admin/article/create", data, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.router.navigateByUrl('/');
        this.store.dispatch(new CreateArticleAction(respObject));
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  createBrand(brand: CreateBrand) {
    this.http.post(AppComponent.API_URL + "/admin/brand/create", brand, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.router.navigateByUrl('/');
        this.store.dispatch(new CreateBrandAction(respObject.response));
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  createCategory(category: CreateCategory) {
    this.http.post(AppComponent.API_URL + "/admin/category/create", category, { withCredentials: true })
      .subscribe((respObject: any) => {
        //console.log(respObject)
        this.toastr.success(respObject.message);
        this.router.navigateByUrl('/');
        this.store.dispatch(new CreateCategoryAction(respObject.response));
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  getArticles(page: number, size: number) {
    this.http.get(AppComponent.API_URL + "/article/all?page=" + page + "&size=" + size, { withCredentials: true })
      .subscribe((respObject: any) => {
        console.log(respObject.response);
        this.store.dispatch(new GetArticlesAction(respObject.response));
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  filterArticles(page: number, size: number, filters: any) {
    this.http.post(AppComponent.API_URL + "/article/filter?page=" + page + "&size=" + size, filters, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.store.dispatch(new FilterArticlesAction(respObject.response, page, size, filters));
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  editArticleStatus(bindingModel: any) {
    this.http.post(AppComponent.API_URL + "/admin/articleStatus/edit", bindingModel, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.filterArticles(this.currentArticlesPage, this.currentArticlePageSize, this.articlesFilters);
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  editArticle(articleToEdit: any) {
    let data = new FormData();
    let { name, description, price, colors, sizes, id } = articleToEdit;

    data.append('article', new Blob([JSON.stringify({ name, description, price, status, colors, sizes, id })],
      { type: 'application/json' }));

    if (articleToEdit.photo) {
      data.append('photo', articleToEdit.photo);
    } else {
      data.append('photo', null);
    }

    this.http.post(AppComponent.API_URL + "/admin/article/edit", data, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.filterArticles(this.currentArticlesPage, this.currentArticlePageSize, this.articlesFilters);
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  deleteArticle(articleId: number) {
    this.http.post(AppComponent.API_URL + "/admin/article/delete/" + articleId, {}, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.filterArticles(this.currentArticlesPage, this.currentArticlePageSize, this.articlesFilters);
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  getAdverts() {
    this.http.get(AppComponent.API_URL + "/unAuth/adverts/")
      .subscribe((respObject: any) => {
        this.store.dispatch(new GetAdvertsAction(respObject.response))
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }


}