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
const child_process_1 = require("child_process");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const filesGlop = core.getInput("files-glob");
    const prettierVersion = core.getInput("prettier-version");
    const configPath = core.getInput("config-path");
    const prettierOptions = core.getInput("prettier-options");
    core.info("Installing Prettier...");
    (0, child_process_1.execSync)(`npm install prettier@${prettierVersion}`);
    core.info(`Prettier ${prettierVersion} installed successfully!`);
    // Check if prettier was installed
    const prettierPath = path.join(process.cwd(), "node_modules", ".bin", "prettier");
    if (!fs.existsSync(prettierPath)) {
        core.setFailed("Prettier was not installed successfully!");
        return;
    }
    // Construct the command dynamically
    let command = `${prettierPath}  ${filesGlop} ${prettierOptions}`;
    if (configPath) {
        const configFile = path.join(process.cwd(), configPath);
        if (fs.existsSync(configFile)) {
            command += ` --config ${configFile}`;
        }
        else {
            core.warning(`Config file not found at ${configFile}, using default configuration.`);
        }
    }
    try {
        core.info(`Running Prettier with the following command:\n ${command}`);
        const output = (0, child_process_1.execSync)(command).toString();
        const filesFormatted = ['ts', 'tsx', 'js', 'jsx'].some(ext => output.includes(ext));
        if (filesFormatted) {
            core.info(`Prettier has formatted the following files:\n${output}`);
            core.setOutput("changed-files", "true");
        }
        else {
            core.info("No files were formatted.");
            core.setOutput("changed-files", "false");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Prettier formatting failed: ${error.message}`);
        }
        else {
            core.setFailed("Prettier formatting failed with an unknown error.");
        }
    }
});
main();
