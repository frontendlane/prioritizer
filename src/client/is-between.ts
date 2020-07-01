export const isBetween = (lowerEval: string, number: number, upperEval: string): boolean => {
    if (!lowerEval.endsWith('<') && !lowerEval.endsWith('<=')) {
        throw new Error(`first argument must end with '<' or '<='`);
    }

    if (!upperEval.startsWith('<') && !upperEval.startsWith('<=')) {
        throw new Error(`third argument must start with '<' or '<='`);
    }

    const [lowerBound, lowerEquality]: string[] = lowerEval.split('<');
    const satisfiesLowerBound: boolean = lowerEquality === '='
        ? +lowerBound <= number
        : +lowerBound < number;

    const upperEquality: string = upperEval.split('<')[1];
    const satisfiesUpperBound: boolean = upperEquality.startsWith('=')
        ? number <= +upperEquality.substr(1)
        : number < +upperEquality;

    return satisfiesLowerBound && satisfiesUpperBound;
};