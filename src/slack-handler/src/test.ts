import Proggology from "./Controllers/Proggology";
import chalk from 'chalk';

const p = new Proggology();
const genText = p.getText();

const spiltText = genText.split('*')
    .reduce((agg, chunk, index) => {
        [1, 3, 5].includes(index)
            ? agg += chalk.bgBlueBright.bold(chunk)
            : agg += chalk.bgMagenta(chunk);
        return agg;
    });

console.log(spiltText);
