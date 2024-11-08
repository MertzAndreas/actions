"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const child_process_1 = require("child_process");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Install Prettier
    core.info("Installing Prettier...");
    const prettierVersion = core.getInput("prettier-version");
    (0, child_process_1.execSync)(`npm install prettier@${prettierVersion}`);
    core.info(`Prettier ${prettierVersion} installed successfully!`);
    //Check if prettier was installed
    const prettierPath = path.join(process.cwd(), "node_modules", ".bin", "prettier");
    if (!fs.existsSync(prettierPath)) {
        core.setFailed("Prettier was not installed successfully!");
        return;
    }
    const files = core.getInput("files-glob");
    //Find files matching the glob pattern but exclude node_modules
    const filesToFormat = glob.sync(files, {
        ignore: ["**/node_modules/**"],
    });
    if (filesToFormat.length === 0) {
        core.info("No files found to format!");
        return;
    }
    const prettierArgs = core.getInput("prettier-options");
    filesToFormat.forEach((file) => {
        (0, child_process_1.execSync)(`${prettierPath} --write ${file} ${prettierArgs}`);
        core.info(`Formatting file: ${file}`);
    });
});
main();
