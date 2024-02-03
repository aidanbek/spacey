const fs = require('fs')
const path = require('path')

// find repos wher to put jwt


function searchFile(dir, fileName) {
    const files = fs.readdirSync(dir);
    const result = []

    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            result.push(...searchFile(filePath, fileName));
        } else if (file === fileName) {
            result.push(filePath)
        }
    }

    return result;
}

const jwtable = 'microservice'

const root = 'root'

const cjs = searchFile('root/microservice', 'composer.json')

for(const composer of cjs) {
    const content = JSON.parse(fs.readFileSync(composer, {encoding: 'utf8'}))

    if (content['require']?.['tymon/jwt-auth']) {
        console.log('has tymon');
        console.log(composer);

        const storageDir = composer.replace('composer.json', 'storage')
        console.log({storageDir});
        const keys = fs.readdirSync('jwt', {encoding: 'utf-8'})

        if (!fs.existsSync(`${storageDir}/jwt`)) {
            fs.mkdirSync(`${storageDir}/jwt`)
        }

        for(const key of keys) {
            if  (!fs.existsSync(path.normalize(`${storageDir}/jwt/${key}`))) {
                fs.copyFileSync(path.normalize(`jwt/${key}`),path.normalize(`${storageDir}/jwt/${key}` ))
                console.log(`key was copied`);
            }
        }
    }
}

return

const r = fs.readdirSync(root, {withFileTypes: true})



for(const f of r) {
    if (f.isDirectory()) {

        const files = fs.readdirSync(`microservice/${f.name}`)
        console.log(files);


    }

    return
}
