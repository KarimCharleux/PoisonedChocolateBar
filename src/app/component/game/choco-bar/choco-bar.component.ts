import {Component} from '@angular/core';
import {SettingsService} from "../../../service/settings.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChocolateSquare, Marker} from "./chocoSquare";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-choco-bar',
    standalone: true,
    imports: [
        NgForOf
    ],
    templateUrl: './choco-bar.component.html',
    styleUrl: './choco-bar.component.scss'
})
export class ChocoBarComponent {
    public allChocoSquares: Array<ChocolateSquare> = new Array<ChocolateSquare>();
    protected markers: Array<Marker> = new Array<Marker>();
    protected chocoSquaresSize: number = 50;

    constructor(protected settingsService: SettingsService,
                private _snackBar: MatSnackBar) {
        this.createChocoBar();
        this.settingsService.getNeedUpdate().subscribe((needUpdate: boolean) => {
            if (needUpdate) {
                this.createChocoBar();
            }
        });

        this.settingsService.getEatAction().subscribe((eatAction: boolean) => {
            if (eatAction) {
                if (this.settingsService.getIsPoisonedSquarePositioned()) {
                    this._snackBar.open('❌ Tu dois positionner la case empoisonnée avant de manger la tablette de chocolat !');
                } else {
                    this.eatChocoBar();
                }
            }
        });
    }

    public createChocoBar(): void {
        this.allChocoSquares = new Array<ChocolateSquare>();
        this.markers = new Array<Marker>();
        const nbLines: number = this.settingsService.getNbLines();
        const nbColumns: number = this.settingsService.getNbColumns();

        if (this.settingsService.getPoisonedSquareX() >= nbColumns || this.settingsService.getPoisonedSquareY() >= nbLines) {
            this.settingsService.setPoisonedSquareX(0);
            this.settingsService.setPoisonedSquareY(0);
        }

        for (let line: number = 0; line < nbLines; line++) {
            for (let column: number = 0; column < nbColumns; column++) {
                // Add markers around the chocolate bar
                if (line === 0) {
                    this.markers.push({
                        line: 1,
                        column: column + 2,
                        label: String(column)
                    });
                }
                if (column === 0) {
                    this.markers.push({
                        line: line + 2,
                        column: 1,
                        label: String(line)
                    });
                }

                this.allChocoSquares.push({
                    id: `${line}-${column}`,
                    line: line,
                    column: column,
                    isPoisoned: (line === this.settingsService.getPoisonedSquareY() && column === this.settingsService.getPoisonedSquareX()),
                    isWaiting: (this.settingsService.getIsPoisonedSquarePositioned() && !(line === this.settingsService.getPoisonedSquareY() && column === this.settingsService.getPoisonedSquareX())),
                    isSelected: false
                });
            }
        }
    }

    protected handleClick(chocoSquare: ChocolateSquare): void {
        if (this.settingsService.getIsPoisonedSquarePositioned()) {
            this.settingsService.setPoisonedSquareX(chocoSquare.column);
            this.settingsService.setPoisonedSquareY(chocoSquare.line);
            this.settingsService.setPositionPoisonedSquare();
            this.settingsService.setNeedUpdate(true);
        } else {
            chocoSquare.isSelected = !chocoSquare.isSelected;
        }
    }


    private eatChocoBar() {
        if (this.allChocoSquares && this.isSelectionValid()) {
            this.allChocoSquares = this.allChocoSquares.filter((chocoSquare: ChocolateSquare) => !chocoSquare.isSelected);
        }
    }

    private isSelectionValid(): boolean {
        return true;
        // // Verify if there is a selection
        // if (selectedSquares.length === 0) {
        //     this._snackBar.open('❌ On ne peut pas manger du vent 💨 ! Sélectionnez des cases à manger 🍫 !');
        //     return false;
        // }
        //
        // // Determine if the selection is a line or a column or both
        // let isLine: boolean = false;
        // let isColumn: boolean = false;
        //
        // selectedSquares.forEach((square: HTMLDivElement) => {
        //     const line = parseInt(square.getAttribute('data-line') as string);
        //     const column = parseInt(square.getAttribute('data-column') as string);
        //     const lineSquares = Array.from(allSquares).filter((s: HTMLDivElement) => parseInt(s.getAttribute('data-line') as string) === line);
        //     const columnSquares = Array.from(allSquares).filter((s: HTMLDivElement) => parseInt(s.getAttribute('data-column') as string) === column);
        //     if (lineSquares.length === selectedSquares.length) {
        //         isLine = true;
        //     }
        //     if (columnSquares.length === selectedSquares.length) {
        //         isColumn = true;
        //     }
        // });
        //
        // console.log("selectedSquares", selectedSquares.length);
        // console.log("isLine", isLine);
        // console.log("isColumn", isColumn);
        //
        // if (!isLine && !isColumn) {
        //     this._snackBar.open('❌ On ne peut manger qu\'une ligne ou une colonne à la fois !');
        //     return false;
        // }
        //
        // // Verify if the selection is complete
        // let isComplete = true;
        // if (isLine) {
        //     const startLine = parseInt(selectedSquares[0].getAttribute('data-line') as string);
        //     const endLine = parseInt(selectedSquares[selectedSquares.length - 1].getAttribute('data-line') as string);
        //     for (let i = 0; i < allSquares.length; i++) {
        //         const square = allSquares[i];
        //         const line = parseInt(square.getAttribute('data-line') as string);
        //         const column = parseInt(square.getAttribute('data-column') as string);
        //         if (line >= startLine && line <= endLine && column === parseInt(selectedSquares[0].getAttribute('data-column') as string) && !square.classList.contains('chocoSquare--selected')) {
        //             isComplete = false;
        //             break;
        //         }
        //     }
        // } else if (isColumn) {
        //     const startColumn = parseInt(selectedSquares[0].getAttribute('data-column') as string);
        //     const endColumn = parseInt(selectedSquares[selectedSquares.length - 1].getAttribute('data-column') as string);
        //     for (let i = 0; i < allSquares.length; i++) {
        //         const square = allSquares[i];
        //         const line = parseInt(square.getAttribute('data-line') as string);
        //         const column = parseInt(square.getAttribute('data-column') as string);
        //         if (column >= startColumn && column <= endColumn && line === parseInt(selectedSquares[0].getAttribute('data-line') as string) && !square.classList.contains('chocoSquare--selected')) {
        //             isComplete = false;
        //             break;
        //         }
        //     }
        // }
        //
        // console.log("isComplete", isComplete);
        // console.log("\n");
        //
        // return isComplete;
    }

    protected readonly Array = Array;
}
