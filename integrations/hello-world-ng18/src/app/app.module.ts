import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { StoreModule } from './store/store.module';

const routes: Routes = [{ path: '', component: AppComponent }];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'hello-world-ng18' }),
    RouterModule.forRoot(routes),
    StoreModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
