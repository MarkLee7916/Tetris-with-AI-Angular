import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { GameComponent } from './components/game/game.component';
import { MenuComponent } from './components/menu/menu.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { MobileControlsComponent } from './components/mobile-controls/mobile-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    GameComponent,
    MenuComponent,
    TutorialComponent,
    MobileControlsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
