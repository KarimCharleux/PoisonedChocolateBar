import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private nbLines: number = 6;
  private nbColumns: number = 3;
  private poisonedSquareX: number = 0;
  private poisonedSquareY: number = 0;
  private player1: string = "Joueur 1";
  private player2: string = "Joueur 2";
  private needUpdateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private needUpdate$: Observable<boolean> = this.needUpdateSubject.asObservable();
  private eatActionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private eatAction$: Observable<boolean> = this.eatActionSubject.asObservable();
  private isPoisonedSquarePositioned: boolean = false;

  constructor() { }

  public getNeedUpdate(): Observable<boolean> {
    return this.needUpdate$;
  }

  public setNeedUpdate(needUpdate: boolean): void {
    this.needUpdateSubject.next(needUpdate);
  }

  public getEatAction(): Observable<boolean> {
    return this.eatAction$;
  }

  public setEatAction(eatAction: boolean): void {
    this.eatActionSubject.next(eatAction);
  }

  public getNbLines(): number {
    return this.nbLines;
  }

  public getNbColumns(): number {
    return this.nbColumns;
  }

  public getPlayer1(): string {
    return this.player1;
  }

  public getPlayer2(): string {
    return this.player2;
  }

  public setNbLines(nbLines: number): void {
    this.nbLines = nbLines;
  }

  public setNbColumns(nbColumns: number): void {
    this.nbColumns = nbColumns;
  }

  public setPlayer1(player1: string): void {
    this.player1 = player1;
  }

  public setPlayer2(player2: string): void {
    this.player2 = player2;
  }

  public getPoisonedSquareX(): number {
    return this.poisonedSquareX;
  }

  public getPoisonedSquareY(): number {
    return this.poisonedSquareY;
  }

  public setPoisonedSquareX(poisonedSquareX: number): void {
    this.poisonedSquareX = poisonedSquareX;
  }

  public setPoisonedSquareY(poisonedSquareY: number): void {
    this.poisonedSquareY = poisonedSquareY;
  }

  public setPositionPoisonedSquare(): void {
    this.isPoisonedSquarePositioned = !this.isPoisonedSquarePositioned;
  }

  public getIsPoisonedSquarePositioned(): boolean {
    return this.isPoisonedSquarePositioned;
  }
}
