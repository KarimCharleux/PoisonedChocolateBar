export type ChocolateSquare = {
    id: string;
    line: number;
    column: number;
    isPoisoned: boolean;
    isWaiting: boolean;
    isSelected: boolean;
}

export type Marker = {
    line: number;
    column: number;
    label: string;
}
