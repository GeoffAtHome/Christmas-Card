"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const xmas_2023_1 = require("./xmas-2023");
async function saveTheData(filename, text) {
    console.log('save the data');
    await fs_1.default.writeFile(`./${filename}`, text, err => {
        console.log('writing');
        if (err) {
            console.log(`Error writing file: ${err}`);
        }
    });
}
async function doTheWork() {
    const data = xmas_2023_1.Card2023;
    await saveTheData('file.json', JSON.stringify(data));
}
function main() {
    console.log('Start');
    doTheWork();
}
main();
//# sourceMappingURL=index.js.map