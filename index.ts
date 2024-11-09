import * as core from "@actions/core";
import * as fs from "fs";
import * as path from "path";

import { execSync } from "child_process";
import { glob } from "glob";

const main = async () => {
    const filesGlop = core.getInput("files-glob");
    const prettierVersion = core.getInput("prettier-version");
    const configPath = core.getInput("config-path");
    const prettierOptions = core.getInput("prettier-options");

    core.info(`Installing prettier version ${prettierVersion}`);
    execSync(`npm install prettier@${prettierVersion}`);

    // Check if prettier was installed
    const prettierPath = path.join(process.cwd(), "node_modules", ".bin", "prettier");
    if (!fs.existsSync(prettierPath)) {
        core.setFailed("Prettier was not installed successfully!");
        return;
    }

    core.info(`Prettier installed successfully`);

    // Construct the command dynamically
    let command = `${prettierPath}  ${filesGlop} ${prettierOptions}`;



        const configFiles = glob.sync(configPath || ".prettierrc*", { cwd: process.cwd() });

        if (configFiles.length > 0) {
            const configFile = path.join(process.cwd(), configFiles[0]); // Use the first match
            command += ` --config ${configFile}`;
            core.info(`Using config file: ${configFile}`);
        } else {
            core.warning(
                `Config file matching "${configPath}" not found, using default configuration.`
            );
        }


    try {
        core.info(`Running Prettier with the following command:\n ${command}`);
        const output = execSync(command).toString();

        const filesFormatted = ["ts", "tsx", "js", "jsx"].some((ext) => output.includes(ext));
        if (filesFormatted) {
            core.info(`Prettier has formatted the following files:\n${output}`);
            core.setOutput("changed-files", "true");
        } else {
            core.info("No files were formatted.");
            core.setOutput("changed-files", "false");
        }
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Prettier formatting failed: ${error.message}`);
        } else {
            core.setFailed("Prettier formatting failed with an unknown error.");
        }
    }
};

main();