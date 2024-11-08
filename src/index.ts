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

    //Check if prettier was installed
    const prettierPath = path.join(
        process.cwd(),
        "node_modules",
        ".bin",
        "prettier"
    );
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
        execSync(`${prettierPath} --write ${file} ${prettierArgs}`);
        core.info(`Formatting file: ${file}`);
    });
};

main();
