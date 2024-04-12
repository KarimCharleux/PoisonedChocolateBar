import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-winner-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    NgOptimizedImage
  ],
  templateUrl: './winner-dialog.component.html',
  styleUrl: './winner-dialog.component.scss'
})
export class WinnerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: String,
              public dialogRef: MatDialogRef<WinnerDialogComponent>) {

  }


}
