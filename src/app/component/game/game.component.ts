import {Component} from '@angular/core';
import {ChocoBarComponent} from "./choco-bar/choco-bar.component";
import {ChocoButtonComponent} from "./choco-button/choco-button.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    ChocoBarComponent,
    ChocoButtonComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  protected gameInstruction: string = "<b>Joueur</b> 1️⃣ à toi de manger ! 🍫";

}
