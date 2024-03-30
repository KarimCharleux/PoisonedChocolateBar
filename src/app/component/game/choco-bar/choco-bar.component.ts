import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {SettingsService} from "../../../service/settings.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChocolateSquare} from "./chocoSquare";

@Component({
  selector: 'app-choco-bar',
  standalone: true,
  imports: [],
  templateUrl: './choco-bar.component.html',
  styleUrl: './choco-bar.component.scss'
})
export class ChocoBarComponent implements AfterViewInit {
  @ViewChild('chocoBar', {static: true}) chocoBar: ElementRef | undefined;

  public allChocoSquares : ChocolateSquare[] = []; // TODO finish it
  private chocoSquaresSize: number = 50;

  constructor(private settingsService: SettingsService,
              private _snackBar: MatSnackBar,
              private renderer: Renderer2) {
    this.settingsService.getNeedUpdate().subscribe((needUpdate: boolean) => {
      if (needUpdate) {
        this.createChocoBar();
      }
    });

    this.settingsService.getEatAction().subscribe((eatAction: boolean) => {
      if (eatAction) {
        if (this.settingsService.getIsPoisonedSquarePositioned()) {
          this._snackBar.open('❌ Vous devez positionner la case empoisonnée avant de manger la tablette de chocolat !');
        } else {
          this.eatChocoBar();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChocoBar();
  }

  public createChocoBar(): void {
    if (this.chocoBar) {
      this.resetChocoBar();
      const nbLines: number = this.settingsService.getNbLines();
      const nbColumns: number = this.settingsService.getNbColumns();
      this.chocoBar.nativeElement.style.gridTemplateColumns = `repeat(${nbColumns + 1}, ${this.chocoSquaresSize}px)`;
      this.chocoBar.nativeElement.style.gridTemplateRows = `repeat(${nbLines + 1}, ${this.chocoSquaresSize}px)`;

      this.createGridMarkers(this.chocoBar, nbLines, nbColumns)

      if (this.settingsService.getPoisonedSquareX() >= nbColumns || this.settingsService.getPoisonedSquareY() >= nbLines) {
        this.settingsService.setPoisonedSquareX(0);
        this.settingsService.setPoisonedSquareY(0);
      }

      for (let line: number = 0; line < nbLines; line++) {
        for (let column: number = 0; column < nbColumns; column++) {

          // let chocoSquare2: ChocolateSquare = {
          //   id: `${line}-${column}`,
          //   line: line,
          //   column: column,
          //   isPoisoned: (line === this.settingsService.getPoisonedSquareY() && column === this.settingsService.getPoisonedSquareX()),
          //   isWaiting: (this.settingsService.getIsPoisonedSquarePositioned() && !(line === this.settingsService.getPoisonedSquareY() && column === this.settingsService.getPoisonedSquareX())),
          //   isEaten: false
          // };

          let chocoSquare = this.renderer.createElement("div");
          chocoSquare.classList.add("chocoSquare");
          chocoSquare.style.gridColumn = `${column + 2}`;
          chocoSquare.style.gridRow = `${line + 2}`;
          chocoSquare.setAttribute("data-line", String(line));
          chocoSquare.setAttribute("data-column", String(column));
          if (line === this.settingsService.getPoisonedSquareY() && column === this.settingsService.getPoisonedSquareX()) {
            chocoSquare.classList.add("chocoSquare--poisoned");
          } else {
            this.renderer.listen(chocoSquare, 'click', () => this.onClickChocoSquare(chocoSquare));
            if (this.settingsService.getIsPoisonedSquarePositioned()) {
              chocoSquare.classList.add("chocoSquare--waiting");
            }
          }
          this.renderer.appendChild(this.chocoBar?.nativeElement, chocoSquare);
        }
      }
    }
  }

  private onClickChocoSquare(chocoSquare: any): void {
    if (this.settingsService.getIsPoisonedSquarePositioned()) {
      this.settingsService.setPoisonedSquareX(parseInt(chocoSquare.getAttribute("data-column")));
      this.settingsService.setPoisonedSquareY(parseInt(chocoSquare.getAttribute("data-line")));
      this.settingsService.setPositionPoisonedSquare();
      this.settingsService.setNeedUpdate(true);
    } else {
      if (chocoSquare.classList.contains("chocoSquare--selected")) {
        chocoSquare.classList.remove("chocoSquare--selected");
      } else {
        chocoSquare.classList.add("chocoSquare--selected");
      }
    }
  }

  public resetChocoBar(): void {
    if (this.chocoBar) {
      this.chocoBar.nativeElement.innerHTML = "";
    }
  }

  private createGridMarkers(chocoBar: ElementRef, nbLines: number, nbColumns: number): void {
    // Add label on top left
    let label = this.renderer.createElement("div");
    label.classList.add("label");
    label.style.gridColumn = `1`;
    label.style.gridRow = `1`;
    let x = this.renderer.createElement("span");
    x.textContent = "X →";
    x.classList.add("label--x");
    let y = this.renderer.createElement("span");
    y.textContent = "Y ↓";
    y.classList.add("label--y");
    this.renderer.appendChild(label, x);
    this.renderer.appendChild(label, y);
    this.renderer.appendChild(chocoBar.nativeElement, label);

    // Add markers on top
    for (let column = 1; column <= nbColumns; column++) {
      let marker = this.renderer.createElement("div");
      marker.textContent = String(column - 1);
      marker.classList.add("marker");
      marker.style.gridColumn = `${column + 1}`;
      marker.style.gridRow = `1`;
      this.renderer.appendChild(chocoBar.nativeElement, marker);
    }

    // Add markers on left
    for (let line = 1; line <= nbLines; line++) {
      let marker = this.renderer.createElement("div");
      marker.textContent = String(line - 1);
      marker.classList.add("marker");
      marker.style.gridColumn = `1`;
      marker.style.gridRow = `${line + 1}`;
      this.renderer.appendChild(chocoBar.nativeElement, marker);
    }
  }

  private eatChocoBar() {
    if (this.chocoBar) {
      const allSquares = this.chocoBar.nativeElement.querySelectorAll('.chocoSquare');
      const selectedSquares = this.chocoBar.nativeElement.querySelectorAll('.chocoSquare--selected');
      if (!this.isSelectionValid(allSquares, selectedSquares)) {
        selectedSquares.forEach((square: HTMLElement) => {
          this.renderer.removeChild(this.chocoBar?.nativeElement, square);
        });
      }
    }
  }

  private isSelectionValid(allSquares: NodeListOf<HTMLDivElement>, selectedSquares: NodeListOf<HTMLDivElement>): boolean {
    // Verify if there is a selection
    if (selectedSquares.length === 0) {
      this._snackBar.open('❌ On ne peut pas manger du vent 💨 ! Sélectionnez des cases à manger 🍫 !');
      return false;
    }

    // Determine if the selection is a line or a column or both
    let isLine: boolean = false;
    let isColumn: boolean = false;

    selectedSquares.forEach((square: HTMLDivElement) => {
      const line = parseInt(square.getAttribute('data-line') as string);
      const column = parseInt(square.getAttribute('data-column') as string);
      const lineSquares = Array.from(allSquares).filter((s: HTMLDivElement) => parseInt(s.getAttribute('data-line') as string) === line);
      const columnSquares = Array.from(allSquares).filter((s: HTMLDivElement) => parseInt(s.getAttribute('data-column') as string) === column);
      if (lineSquares.length === selectedSquares.length) {
        isLine = true;
      }
      if (columnSquares.length === selectedSquares.length) {
        isColumn = true;
      }
    });

    console.log("selectedSquares", selectedSquares.length);
    console.log("isLine", isLine);
    console.log("isColumn", isColumn);

    if (!isLine && !isColumn) {
      this._snackBar.open('❌ On ne peut manger qu\'une ligne ou une colonne à la fois !');
      return false;
    }

    // Verify if the selection is complete
    let isComplete = true;
    if (isLine) {
      const startLine = parseInt(selectedSquares[0].getAttribute('data-line') as string);
      const endLine = parseInt(selectedSquares[selectedSquares.length - 1].getAttribute('data-line') as string);
      for (let i = 0; i < allSquares.length; i++) {
        const square = allSquares[i];
        const line = parseInt(square.getAttribute('data-line') as string);
        const column = parseInt(square.getAttribute('data-column') as string);
        if (line >= startLine && line <= endLine && column === parseInt(selectedSquares[0].getAttribute('data-column') as string) && !square.classList.contains('chocoSquare--selected')) {
          isComplete = false;
          break;
        }
      }
    } else if (isColumn) {
      const startColumn = parseInt(selectedSquares[0].getAttribute('data-column') as string);
      const endColumn = parseInt(selectedSquares[selectedSquares.length - 1].getAttribute('data-column') as string);
      for (let i = 0; i < allSquares.length; i++) {
        const square = allSquares[i];
        const line = parseInt(square.getAttribute('data-line') as string);
        const column = parseInt(square.getAttribute('data-column') as string);
        if (column >= startColumn && column <= endColumn && line === parseInt(selectedSquares[0].getAttribute('data-line') as string) && !square.classList.contains('chocoSquare--selected')) {
          isComplete = false;
          break;
        }
      }
    }

    console.log("isComplete", isComplete);
    console.log("\n");

    return isComplete;
  }

}
