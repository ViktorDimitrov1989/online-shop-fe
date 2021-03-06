import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { AppComponent } from '../../app.component';
import { GetUsersAction } from '../../store/user/user-actions';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public store: Store<AppState>) { }

  public getAllUsers(pageNumber: number, pageSize: number) {
    pageNumber = pageNumber > 0 ? pageNumber - 1:0;

    this.http.get(AppComponent.API_URL + "/admin/users/get?page=" + pageNumber + "&size=" + pageSize, { withCredentials: true })
      .subscribe((respObject: any) => {
        console.log(respObject);
        this.store.dispatch(new GetUsersAction(respObject.response));
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  public makeUserAdmin(id: number, pageIndex: number, pageSize: number) {
    this.http.post(AppComponent.API_URL + "/admin/users/makeAdmin/" + id, {}, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.getAllUsers(pageIndex, pageSize);
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  public takeAdminPermissions(id: number, pageIndex: number, pageSize: number) {
    this.http.post(AppComponent.API_URL + "/admin/users/takeAdmin/" + id, {}, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.getAllUsers(pageIndex, pageSize);
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  public blockUser(id: number, pageIndex: number, pageSize: number) {
    this.http.post(AppComponent.API_URL + "/admin/users/block/" + id, {}, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.getAllUsers(pageIndex, pageSize);
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }

  public unBlockUser(id: number, pageIndex: number, pageSize: number) {
    this.http.post(AppComponent.API_URL + "/admin/users/unblock/" + id, {}, { withCredentials: true })
      .subscribe((respObject: any) => {
        this.toastr.success(respObject.message);
        this.getAllUsers(pageIndex, pageSize);
      },
        (err: any) => {
          this.toastr.error(err.error.message);
        })
  }


}
