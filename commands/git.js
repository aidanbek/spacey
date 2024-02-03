const {resolve} = require('path')
const findGitRepos = require('../tools/findGitRepos')
const {execSync} = require("child_process");

async function git(command, dir) {
    const repos = findGitRepos(dir)

    for (const repo of repos) {
        const path = resolve(repo)
        const script = `git -C ${path} ${command}`

        console.log(path + ': ' + execSync(script, {encoding: 'utf8'}))
    }

    console.log(`git ${command} finished`);
}

module.exports = git