import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { OAuthIFrameComponent } from './oauth-iframe.component';

@NgModule({
    declarations: [
        OAuthIFrameComponent
    ]
  , imports: [
        BrowserModule
      , HttpClientModule
    ]
  , exports: [
        OAuthIFrameComponent
    ]
})
export class SSOImplicitModule { }
