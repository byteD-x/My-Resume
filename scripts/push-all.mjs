import { spawnSync } from "node:child_process";
import process from "node:process";

const config = {
    remote: process.env.DEPLOY_GIT_REMOTE || "origin",
    branch: process.env.DEPLOY_GIT_BRANCH || "main",
};

function run(command, args) {
    const result = spawnSync(command, args, {
        stdio: "inherit",
        shell: false,
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`${command} exited with code ${result.status}`);
    }
}

run("git", ["push", config.remote, config.branch]);
