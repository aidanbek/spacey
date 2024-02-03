const extractor = require('./extractEnvsFromString')

it('find envs', () => {
    const content = `
            env("ARG1")
            env('ARG2', "VAL2")
            env("ARG3")
            env("ARG4", 'VAL4')
            env("ARG5", null)
            env("ARG6", null)
            env("ARG7", null)
            env(
            
                'ARG8'
            )
            env(
                'ARG9',
                
                "VAL9"
            )
            env("ARG10", false)
            env("ARG11", true)
            env("ARG12", )
            env("ARG13", 1)
            env("ARG13", 1)
            env("ARG13", "R")
        `;

    const result = extractor(content);

    expect(result).toStrictEqual([
        {name: 'ARG1', values: []},
        {name: 'ARG2', values: ['VAL2']},
        {name: 'ARG3', values: []},
        {name: 'ARG4', values: ['VAL4']},
        {name: 'ARG5', values: ['null']},
        {name: 'ARG6', values: ['null']},
        {name: 'ARG7', values: ['null']},
        {name: 'ARG8', values: []},
        {name: 'ARG9', values: ['VAL9']},
        {name: 'ARG10', values: ['false']},
        {name: 'ARG11', values: ['true']},
        {name: 'ARG12', values: []},
        {name: 'ARG13', values: ['1', 'R']},
    ])
})
