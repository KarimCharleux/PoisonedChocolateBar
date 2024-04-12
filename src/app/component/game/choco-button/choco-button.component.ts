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

    private button: HTMLButtonElement | undefined;

    constructor(private settingsService: SettingsService) {
        this.settingsService.getGoNextPlayer().subscribe((goNextPlayer: boolean) => {
            if (goNextPlayer) {
                if (this.button !== undefined) {
                    if (typeof Audio != "undefined") {
                        let audio = new Audio();
                        audio.src = "assets/eat.mp3";
                        audio.load();
                        audio.play().catch(error => console.error("Error playing the sound.", error));
                    }
                    this.button.classList.add("chocolate-button-animate");
                    setTimeout(() => {
                        // @ts-ignore
                        this.button.classList.remove("chocolate-button-animate");
                    }, 300);
                }
            }
        });
    }

    protected eat(button: HTMLButtonElement) {
        this.button = button;
        this.settingsService.setEatAction(true);
    }
}
