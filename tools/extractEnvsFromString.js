module.exports = (content) => {
    const envRegex = /\benv\s*\(\s*['"]([^'"\n]+)['"](?:\s*,\s*(['"]?([^'"\n]*)['"]?))?\s*\)/dgm
    const envs = new Map()

    let found;

    while (found = envRegex.exec(content)) {
        const name = found[1]
        const value = found[3] ?? null

        if (envs.has(name)) {
            const values = envs.get(name)
            if (value && !values.includes(value)) {
                values.push(value)
            }
        } else {
            envs.set(name, value ? [value]: [])
        }
    }

    return Array.from(envs, ([name, values]) => ({ name, values }));
}