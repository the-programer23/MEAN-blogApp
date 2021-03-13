import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {
  NoopAnimationsModule,
  BrowserAnimationsModule,
} from "@angular/platform-browser/animations";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { MatPaginatorIntlEsp } from "./posts/post-list/custom-mat-paginator";
import { MatPaginatorIntl } from "@angular/material";
import { AngularMaterialModule } from "./angular-material.module";
import { PostModule } from "./posts/posts.module";

@NgModule({
  declarations: [AppComponent, HeaderComponent, ErrorComponent],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    PostModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEsp },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
