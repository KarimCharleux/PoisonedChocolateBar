import {Component} from '@angular/core';
import {ChocoBarComponent} from "./choco-bar/choco-bar.component";
import {ChocoButtonComponent} from "./choco-button/choco-button.component";
import {SettingsService} from "../../service/settings.service";
import {MatDialog} from "@angular/material/dialog";
import {WinnerDialogComponent} from "./winner-dialog/winner-dialog.component";

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
    protected currentPlayer: string = this.settingsService.getPlayer1();
    protected gameInstruction: string = "<b>" + this.currentPlayer + "</b> à toi de manger ! 🍫";

    private postEatMessages: string[] = [
        "Super mouvement ! 🌟",
        "C'était savoureux ! 😋",
        "Tu te régales ! 🍬",
        "Miam miam ! 🍭",
        "Tu es un pro du chocolat ! 🍫",
        "Tu vas gagner ! C'est sûr ! 🏆",
        "Tu es le roi du chocolat ! 👑",
    ];

    constructor(private settingsService: SettingsService,
                private dialog: MatDialog) {
        this.settingsService.getGoNextPlayer().subscribe((goNextPlayer: boolean) => {
            if (goNextPlayer) {
                this.displayRandomMessage();
            }
        });

        this.settingsService.getWeHaveWinner().subscribe((weHaveWinner: boolean) => {
            if (weHaveWinner) {
                if (typeof Audio != "undefined") {
                    let audio = new Audio();
                    audio.src = "assets/winner.mp3";
                    audio.load();
                    audio.play().catch(error => console.error("Error playing the sound.", error));
                }
                this.gameInstruction = "🎉 <b>" + this.currentPlayer + "</b> a gagné ! 🎉";
                const dialogRef = this.dialog.open(WinnerDialogComponent, {
                    data: this.currentPlayer,
                    enterAnimationDuration: 2000,
                });
                dialogRef.afterClosed().subscribe(() => {
                    this.settingsService.setWeHaveWinner(false);
                    this.settingsService.setNeedUpdate(true);
                });
            }
        });

        this.settingsService.getNeedUpdate().subscribe((needUpdate: boolean) => {
            if (needUpdate) {
                this.currentPlayer = this.settingsService.getPlayer1();
                this.gameInstruction = "<b>" + this.currentPlayer + "</b> à toi de manger ! 🍫";
            }
        });
    }

    public goNextPlayer(): void {
        this.currentPlayer = this.currentPlayer === this.settingsService.getPlayer1() ? this.settingsService.getPlayer2() : this.settingsService.getPlayer1();
        this.gameInstruction = "<b>" + this.currentPlayer + "</b> à toi de manger ! 🍫";
    }

    private displayRandomMessage(): void {
        const randomIndex = Math.floor(Math.random() * this.postEatMessages.length);
        this.gameInstruction = this.postEatMessages[randomIndex];

        // Wait for 1 second before updating the player
        setTimeout(() => {
            this.goNextPlayer();
        }, 1000); // 1000 milliseconds delay
    }
}
