import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCounterComponent } from '../_components/home-counter/home-counter.component';

const routes: Routes = [
  { path: '', component: HomeCounterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }