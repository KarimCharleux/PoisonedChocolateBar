import {Component} from '@angular/core';
import {SettingsService} from "../../../service/settings.service";

@Component({
  selector: 'app-choco-button',
  standalone: true,
  imports: [],
  templateUrl: './choco-button.component.html',
  styleUrl: './choco-button.component.scss'
})
export class ChocoButtonComponent {

  constructor(private settingsService: SettingsService) {
  }

  eat() {
    this.settingsService.setEatAction(true);
  }
}
