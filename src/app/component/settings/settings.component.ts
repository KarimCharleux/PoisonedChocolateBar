import {Component} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SettingsService} from "../../service/settings.service";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDividerModule, ReactiveFormsModule, NgClass],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
})
export class SettingsComponent {
    public minimumColumns: number = 1;
    public minimumLines: number = 1;
    public maximumColumns: number = 10;
    public maximumLines: number = 10;

    chocoBarForm = this.formBuilder.group({
        nbLines: ['', Validators.required],
        nbColumns: ['', Validators.required]
    });

    chocoSquareForm = this.formBuilder.group({
        poisonedSquareX: ['', Validators.required],
        poisonedSquareY: ['', Validators.required]
    });

    playersForm = this.formBuilder.group({
        player1: [''],
        player2: ['']
    });

    constructor(private formBuilder: FormBuilder,
                private _snackBar: MatSnackBar,
                protected settingsService: SettingsService) {
    }

    public updateChocoBar(): void {
        if (this.chocoBarForm.valid) {
            let nbLines = parseInt(<string>this.chocoBarForm.value.nbLines);
            let nbColumns = parseInt(<string>this.chocoBarForm.value.nbColumns);
            if ((nbLines <= 1 && nbColumns >= 2) || (nbLines >= 2 && nbColumns <= 1) || (nbLines < 2 && nbColumns < 2)) {
                this._snackBar.open("❌ L'une des valeurs doit être supérieure à 1", 'OK', {
                    duration: 2000,
                });
                return;
            }
            this.settingsService.setNbLines(nbLines);
            this.settingsService.setNbColumns(nbColumns);
            this._snackBar.open("✅ Tablette de chocolat mise à jour ! Prêt à être mangée !", 'OK', {
                duration: 2000,
            });
            this.settingsService.setNeedUpdate(true);
            return;
        }
        this._snackBar.open("❌ Les valeurs doivent être supérieures à 1 et inférieures à " + this.maximumColumns, 'OK', {
            duration: 2000,
        });
    }

    public updateChocoSquare(): void {
        if (this.chocoSquareForm.valid) {
            let poisonedSquareX = parseInt(<string>this.chocoSquareForm.value.poisonedSquareX);
            let poisonedSquareY = parseInt(<string>this.chocoSquareForm.value.poisonedSquareY);
            if (poisonedSquareX >= this.settingsService.getNbColumns() || poisonedSquareY >= this.settingsService.getNbLines()) {
                this._snackBar.open("❌ Les valeurs doivent être inférieures à " + this.settingsService.getNbLines() + " pour x et " + this.settingsService.getNbColumns() + " pour y", 'OK', {
                    duration: 2000,
                });
                return;
            }
            this.settingsService.setPoisonedSquareX(poisonedSquareX);
            this.settingsService.setPoisonedSquareY(poisonedSquareY);
            this._snackBar.open("✅ Carré empoisonné mise à jour !", 'OK', {
                duration: 2000,
            });
            this.settingsService.setNeedUpdate(true);
            return;
        }
        this._snackBar.open("❌ Les valeurs doivent être inférieures à " + this.settingsService.getNbLines() + " pour x et " + this.settingsService.getNbColumns() + " pour y", 'OK', {
            duration: 2000,
        });
    }

    public updatePlayers(): void {
        if (this.playersForm.valid) {
            if (this.playersForm.value.player1 === "" && this.playersForm.value.player2 === "") {
                this._snackBar.open("❌ Les deux joueurs ne peuvent pas être vides !", 'OK', {
                    duration: 2000,
                });
                return;
            }
            if (this.playersForm.value.player1 === this.playersForm.value.player2) {
                this._snackBar.open("❌ Les deux joueurs ne peuvent pas avoir le même nom ! Tu veux te battre contre toi-même ?", 'OK', {
                    duration: 2000,
                });
                return;
            }
            if (this.playersForm.value.player1 !== "") {
                this.settingsService.setPlayer1(<string>this.playersForm.value.player1);
            }
            if (this.playersForm.value.player2 !== "") {
                this.settingsService.setPlayer2(<string>this.playersForm.value.player2);
            }
            this._snackBar.open("✅ Joueurs mis à jour ! " + this.settingsService.getPlayer1() + " et " + this.settingsService.getPlayer2() + " sont prêts à se battre !", 'OK', {
                duration: 2000,
            });
            this.settingsService.setNeedUpdate(true);
            return;
        }
        this._snackBar.open("❌ Au moins un des deux joueurs doit avoir un nom !", 'OK', {
            duration: 2000,
        });
    }

    public onClickPositionPoisonedSquare(): void {
        this.settingsService.setPositionPoisonedSquare();
        this.settingsService.setNeedUpdate(true);
    }
}
