const {EOL} = require('os');

const tools = require('./tools')

const fillEnvLines = (oldEnvLines, mappingArray) => {
    let mutatedMapping = Array.from(mappingArray);

    const newLines = oldEnvLines.map(line => {
        if (line.trim().length === 0 || line.substring(0, 1) === '#') {
            return line;
        }

        const found = mutatedMapping.filter((m) => {
            return Array.isArray(
                line.match(
                    new RegExp(`^${m.name}`)
                )
            )
        })

        if (found.length) {
            mutatedMapping = mutatedMapping.filter((m, i) => m.name !== found[0].name);
            return `${found[0].name}=${found[0].values ?? 'null'}`
        }

        return `#${line}`
    })

    mutatedMapping.map(m => {
        const value = m.values[0] ?? 'null'
        newLines.push(`${m.name}=${value}`)
    })

    return newLines;
}

async function envize(targetDirectory) {
    if (tools.dirNotExist(targetDirectory)) {
        console.log(`${targetDirectory} does not exist`)
        return;
    }

    if (tools.composerJsonExist(targetDirectory)) {
        const envsFromProject = tools.extractEnvFromPHPProject(targetDirectory);
        console.log(envsFromProject)
        const actionEnvs = envsFromProject.map(e => e.name)
        const envsFromEnvExample = tools.parseEnvExampleIfExist(targetDirectory)
        const envsFromEnv = tools.parseEnvIfExist(targetDirectory)

        const uniqueEnvs = Array.from(
            new Set(
                ([
                    ...envsFromProject,
                    ...envsFromEnvExample,
                    ...envsFromEnv
                ]).map(e => e.name).filter(name => actionEnvs.includes(name))
            )
        )

        const mapping = new Map();

        for (const name of uniqueEnvs) {
            const valFromEnvExample = envsFromEnvExample.find(e => e.name === name)?.values
            const valFromProject = envsFromProject.find(e => e.name === name)?.values

            if (valFromEnvExample && valFromEnvExample.length) {
                console.log(`${name} took value from env example`, valFromEnvExample);
                mapping.set(name, valFromEnvExample);
            } else if (valFromProject && valFromProject.length) {
                console.log(`${name} took value from project`, valFromProject);
                mapping.set(name, valFromProject);
            } else {
                const valFromEnv = envsFromEnv.find(e => e.name === name)?.values

                if (valFromEnv) {
                    console.log(`${name} value took from env`, valFromEnv);
                    mapping.set(name, valFromEnv);
                } else {
                    console.log(`${name} value not found, set it to null`, null);
                    mapping.set(name, []);
                }
            }
        }

        const mappingArray = Array.from(mapping).map(([name, values]) => ({name, values}))

        if (!tools.envExist(targetDirectory)) {
            tools.createEnv(targetDirectory, '')
            console.log('.env not found');
            console.log('.env created');
        }

        const envLines = tools.splitByLines(tools.getEnv(targetDirectory))
        const newEnvLines = fillEnvLines(envLines, mappingArray);
        tools.overwriteEnv(targetDirectory, newEnvLines.join(EOL));
        console.log('env updated');

        const envExampleLines = tools.splitByLines(tools.getEnvExample(targetDirectory))
        const newEnvExampleLines = fillEnvLines(envExampleLines, mappingArray);
        tools.overwriteEnvExample(targetDirectory, newEnvExampleLines.join(EOL));
        console.log('env.example updated');

        // todo update env example
    }
}

module.exports = envize;
