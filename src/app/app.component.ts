import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RulesComponent} from "./component/rules/rules.component";
import {GameComponent} from "./component/game/game.component";
import {SettingsComponent} from "./component/settings/settings.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RulesComponent, GameComponent, SettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
