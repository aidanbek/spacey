const fs = require("fs");
const {join, resolve} = require('path');

function extractGitRepos(dir) {
    const dirs = fs.readdirSync(dir, {withFileTypes: true}).filter(d => d.isDirectory())

    if (dirs.length === 0) {
        return [];
    }

    const isPassedDirRepo = dirs.find(d => d.name === '.git')

    if (isPassedDirRepo) {
        return [dir];
    }

    return dirs.map(d => extractGitRepos(join(d.path, d.name))).flat()
}

module.exports = extractGitRepos
