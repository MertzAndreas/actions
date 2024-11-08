import * as core from "@actions/core";
import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { execSync } from "child_process";

const main = async () => {
    // Install Prettier
    core.info("Installing Prettier...");
    const prettierVersion = core.getInput("prettier-version");
    execSync(`npm install prettier@${prettierVersion}`);
    core.info(`Prettier ${prettierVersion} installed successfully!`);
};

main();
