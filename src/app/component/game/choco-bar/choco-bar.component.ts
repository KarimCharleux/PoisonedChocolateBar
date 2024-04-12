import {Component, HostListener} from '@angular/core';
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
    private currentNbLines: number = 0;
    private currentNbCol: number = 0;
    private isSelecting: boolean = false;
    private isSelectingSelected: boolean = false;

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
                    this._snackBar.open('❌ Tu dois positionner la case empoisonnée avant de manger la tablette de chocolat !', 'OK', {
                        duration: 1600,
                    });
                } else {
                    this.eatChocoBar();
                }
            }
        });
    }

    public createChocoBar(): void {
        this.allChocoSquares = new Array<ChocolateSquare>();
        this.markers = new Array<Marker>();
        this.currentNbLines = this.settingsService.getNbLines();
        this.currentNbCol = this.settingsService.getNbColumns();

        if (this.settingsService.getPoisonedSquareX() >= this.currentNbCol || this.settingsService.getPoisonedSquareY() >= this.currentNbLines) {
            this.settingsService.setPoisonedSquareX(0);
            this.settingsService.setPoisonedSquareY(0);
        }

        for (let line: number = 0; line < this.currentNbLines; line++) {
            for (let column: number = 0; column < this.currentNbCol; column++) {
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
            this._snackBar.open("✅ Carré empoisonné mise à jour !", 'OK', {
                duration: 2000,
            });
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
        // Filter the selected squares from all chocolate squares
        const selectedSquare: ChocolateSquare[] = this.allChocoSquares.filter((chocoSquare: ChocolateSquare) => chocoSquare.isSelected);

        // Check if no square has been selected
        if (selectedSquare.length === 0) {
            this._snackBar.open('❌ On ne peut pas manger du vent 💨 ! Sélectionne des cases à manger 🍫 !', 'OK', {
                duration: 1600,
            });
            return false;
        }

        // Check if the number of selected squares is not a multiple of the number of lines or columns
        if (selectedSquare.length % this.currentNbLines !== 0 && selectedSquare.length % this.currentNbCol !== 0) {
            this._snackBar.open('❌ Tu dois manger une ou plusieurs lignes entières !', 'OK', {
                duration: 1600,
            });
            return false;
        }

        // Grouping selected squares by columns to determine if the selection forms a valid line
        const groupByColumn = selectedSquare.reduce((acc: any, square: any) => {
            (acc[square.column] = acc[square.column] || []).push(square);
            return acc;
        }, {});

        // Determine if the selection is a complete line by checking if the number of unique columns matches currentNbCol
        const isLine: boolean = Object.keys(groupByColumn).length === this.currentNbCol;

        if (isLine) {
            // Extract unique line indices from the selection to detect duplicates
            let uniqueLines = selectedSquare.map(square => square.line).filter((line, index, self) => self.indexOf(line) === index);

            // Ensure that the number of unique lines matches the number of lines in each column
            if ((selectedSquare.length / this.currentNbCol) !== uniqueLines.length) {
                this._snackBar.open('❌ Tu dois manger une ou plusieurs lignes entières !', 'OK', {
                    duration: 1600,
                });
                return false;
            }

            // Get the minimum value of the line of all chocolate squares
            const topExtremity = this.allChocoSquares.reduce((acc: number, square: ChocolateSquare) => Math.min(acc, square.line), this.currentNbLines);

            // Validate only if at least one square is on the border
            if (selectedSquare.some(square => square.line === topExtremity || square.line === this.currentNbLines - 1)) {
                this.currentNbLines -= uniqueLines.length;
                if (this.checkIfWeHaveAWinner()) {
                    this.settingsService.setWeHaveWinner(true);
                } else {
                    this.settingsService.setGoNextPlayer(true);
                }
                return true;
            } else {
                this._snackBar.open('❌ La ligne n\'est pas sur les extrémités !', 'OK', {
                    duration: 1600,
                });
                return false;
            }
        }

        // Grouping selected squares by lines to determine if the selection forms a valid column
        const groupByLine = selectedSquare.reduce((acc: any, square: any) => {
            (acc[square.line] = acc[square.line] || []).push(square);
            return acc;
        }, {});

        // Determine if the selection is a complete column by checking if the number of unique lines matches currentNbLines
        const isColumn: boolean = Object.keys(groupByLine).length === this.currentNbLines;

        if (isColumn) {
            // Extract unique column indices from the selection to detect duplicates
            let uniqueColumns = selectedSquare.map(square => square.column).filter((column, index, self) => self.indexOf(column) === index);

            // Ensure that the number of unique columns matches the number of columns in each line
            if ((selectedSquare.length / this.currentNbLines) !== uniqueColumns.length) {
                this._snackBar.open('❌ Tu dois manger une ou plusieurs colonnes entières !', 'OK', {
                    duration: 1600,
                });
                return false;
            }

            // Get the minimum value of the column of all chocolate squares
            const leftExtremity = this.allChocoSquares.reduce((acc: number, square: ChocolateSquare) => Math.min(acc, square.column), this.currentNbCol);

            // Validate only if at least one square is on the border
            if (selectedSquare.some(square => square.column === leftExtremity || square.column === this.currentNbCol - 1)) {
                this.currentNbCol -= uniqueColumns.length;
                if (this.checkIfWeHaveAWinner()) {
                    this.settingsService.setWeHaveWinner(true);
                } else {
                    this.settingsService.setGoNextPlayer(true);
                }
                return true;
            } else {
                this._snackBar.open('❌ La colonne n\'est pas sur les extrémités !', 'OK', {
                    duration: 1600,
                });
                return false;
            }
        }

        return false;
    }

    private checkIfWeHaveAWinner(): boolean {
        return this.currentNbCol === 1 && this.currentNbLines === 1;
    }

    startSelection(chocoSquare: ChocolateSquare, isAlreadySelected: boolean): void {
        if(!isAlreadySelected) {
            this.isSelecting = true;
        } else {
            this.isSelectingSelected = true;
        }
        this.handleClick(chocoSquare); // Toggle the first square's selection state
    }

    @HostListener('document:mouseup', ['$event'])
    onGlobalMouseUp(event: MouseEvent): void {
        if (this.isSelecting) {
            this.isSelecting = false;
        }
    }

    selectSquare(chocoSquare: ChocolateSquare, isAlreadySelected: boolean): void {
        if(!isAlreadySelected) {
            if (this.isSelecting) { // Only select squares if the mouse is down
                this.handleClick(chocoSquare);
            }
        }
    }
}
