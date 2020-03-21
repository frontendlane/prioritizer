export const isBetween = (lowerEval, number, upperEval) => {
    if (!lowerEval.endsWith('<') && !lowerEval.endsWith('<=')) {
        throw new Error(`first argument must end with '<' or '<='`);
    }
    if (!upperEval.startsWith('<') && !upperEval.startsWith('<=')) {
        throw new Error(`third argument must start with '<' or '<='`);
    }
    const [lowerBound, lowerEquality] = lowerEval.split('<');
    const satisfiesLowerBound = lowerEquality === '='
        ? +lowerBound <= number
        : +lowerBound < number;
    const upperEquality = upperEval.split('<')[1];
    const satisfiesUpperBound = upperEquality.startsWith('=')
        ? number <= +upperEquality.substr(1)
        : number < +upperEquality;
    return satisfiesLowerBound && satisfiesUpperBound;
};
