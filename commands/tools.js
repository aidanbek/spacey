const fs = require('fs');
const {EOL} = require("os");
const extractEnvsFromString = require('../tools/extractEnvsFromString')

const dirNotExist = (dir) => !fs.existsSync(dir) || !fs.statSync(dir).isDirectory();
const dirExist = (dir) => fs.existsSync(dir) && !fs.statSync(dir).isDirectory();
const isGitRepo = (dir) => fs.existsSync(`${dir}/.git`)
const composerJsonExist = (dir) => fs.existsSync(`${dir}/composer.json`)
const composerLockExist = (dir) => fs.existsSync(`${dir}/composer.lock`)
const packageJsonExist = (dir) => fs.existsSync(`${dir}/package.json`)
const packageLockJsonExist = (dir) => fs.existsSync(`${dir}/package-lock.json`)
const envExampleExist = (dir) => fs.existsSync(`${dir}/.env.example`)
const envExist = (dir) => fs.existsSync(`${dir}/.env`)
const getEnvExample = (dir) => fs.readFileSync(`${dir}/.env.example`, {encoding: 'utf8'})
const getEnv = (dir) => fs.readFileSync(`${dir}/.env`, {encoding: 'utf8'})
const parseEnvExampleIfExist = (dir) => envExampleExist(dir) ? parseEnv(getEnvExample(dir)) : []
const parseEnvIfExist = (dir) => envExist(dir) ? parseEnv(getEnv(dir)) : []
const createFile = (dir, name, data, options) => fs.writeFileSync(`${dir}/${name}`, data, options)
const createEnv = (dir, data, options) => createFile(dir, '.env', data, options)
const createEnvExample = (dir, data, options) => createFile(dir, '.env.example', data, options)
const overwriteEnv = (dir, data, options) => createEnv(dir, data, options)
const overwriteEnvExample = (dir, data, options) => createEnvExample(dir, data, options)
// const appendToEnv

const extractEnvsFromFiles = (files) => {
    const envMap = new Map()

    for (const file of files) {
        const content = fs.readFileSync(file, {encoding: 'utf8'})
        const envs = extractEnvsFromString(content);

        envs.map(({name, values}) => {
            if (!envMap.has(name)) {
                envMap.set(name, [])
            }

            for (const val of values) {
                if (val.toLowerCase() !== 'null' || val.trim() !== '') {
                    envMap.get(name).push(val)
                }
            }
        })
    }

    return Array.from(envMap, (([name, values]) => ({name, values})))
}

const extractFilesFromDir = (dir, extension) => {
    const regex = new RegExp(`.*\.${extension}$`);
    return fs.readdirSync(`${dir}`, {recursive: true})
        .filter(f => regex.test(f))
        .map(f => `${dir}/${f}`)
}

const extractEnvFromPHPProject = (dir) => {
    const includedDirs = ['app', 'config'];

    const phpFiles = includedDirs
        .map(subDir => extractFilesFromDir(`${dir}/${subDir}`, 'php'))
        .flat()

    return extractEnvsFromFiles(phpFiles);
}

const splitByLines = (content) => content.split(EOL)

const parseEnv = (str) => {
    return splitByLines(str)
        .filter(line => line.indexOf('=') > 0)
        .filter(line => line.substring(0, 1) !== '#')
        .map(line => {
            const delimiterIndex = line.indexOf('=');
            const name = line.substring(0, delimiterIndex);
            const value = line.substring(delimiterIndex + 1, line.length);

            return {
                name,
                values: value ? [value] : []
            };
        })
}

function isRepo(dir) {
    if (dirNotExist(dir)) {
        throw new Error(`${dir} does not exist`)
    }

    return isGitRepo(dir) || composerJsonExist(dir) || packageJsonExist(dir)
}


module.exports = {
    composerJsonExist,
    composerLockExist,
    createEnv,
    dirNotExist,
    dirExist,
    envExampleExist,
    envExist,
    extractEnvFromPHPProject,
    getEnv,
    getEnvExample,
    packageLockJsonExist,
    parseEnv,
    parseEnvExampleIfExist,
    parseEnvIfExist,
    overwriteEnv,
    overwriteEnvExample,
    splitByLines,
}