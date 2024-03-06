const {Gitlab} = require('@gitbeaker/rest');
const {resolve} = require('path');
const {execSync} = require("child_process");

const {dirNotExist} = require('./tools')

async function deploy(options) {
    const targetDirectory = resolve(options.directory);
    const mainGroupId = options.groupId;

    if (dirNotExist(targetDirectory)) {
        console.log(`${targetDirectory} does not exist`)
        return;
    }

    const token = options.token;

    const api = new Gitlab({token});

    const subgroups = await api.Groups.allSubgroups(mainGroupId);

    const folders = {}

    for (const group of subgroups) {
        folders[group.path] = []

        const projects = await api.Groups.allProjects(group.id, {perPage: 100, withShared: false})

        folders[group.path].push(...projects.map(p => ({
            http_url_to_repo: p.http_url_to_repo,
            path: p.path
        })))
    }

    for (const folderName of Object.keys(folders)) {
        if (dirNotExist(`${targetDirectory}/${folderName}`)) {
            const path = resolve(`${targetDirectory}/${folderName}`);
            execSync(`mkdir ${path}`);
            console.log(`created folder ${path}`)
        }

        for (const p of folders[folderName]) {
            console.log(`${targetDirectory}/${folderName}/${p.path}: trying to clone`)

            if (dirNotExist(`${targetDirectory}/${folderName}/${p.path}`)) {
                const url = token
                    ? p.http_url_to_repo.replace('https://gitlab.com', `https://oauth2:${token}@gitlab.com`)
                    : p.http_url_to_repo

                const cloneCommand = `git clone ${url} ${targetDirectory}/${folderName}/${p.path}`;

                console.log(`running ${p.http_url_to_repo}`)
                console.log(execSync(cloneCommand, {encoding: 'utf8'}))

                console.log(`${targetDirectory}/${folderName} ${p.path}: cloned`)
            } else {
                console.log(`${targetDirectory}/${folderName} ${p.path}: already existed`)
            }
        }
    }
}

module.exports = deploy;