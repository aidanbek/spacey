const extract = require('./findGitRepos');
const mock = require('mock-fs');
const GIT = '.git'

mock({
    empty_folder: {},
    dir_as_git_repo: {
        [GIT]: {}
    },
    nested_dir: {
        dir1: {
            dir11: {
                [GIT]: {},
                other_folder: {}
            },
            other_folder: {}
        },
        dir2: {
            [GIT]: {},
            other_folder: {}
        },
        dir3: {
            other_folder: {}
        },
        other_folder: {}
    }
})

describe('find git repo', () => {
    it('no git repo in empty dir', () => {
        const actual = extract('empty_folder')

        expect(actual).toEqual([])
    })

    it('passed dir as git repo', () => {
        const actual = extract('dir_as_git_repo')

        expect(actual).toEqual(['dir_as_git_repo'])
    })

    it('nested dirs as git repos', () => {
        const actual = extract('nested_dir')

        expect(actual).toEqual(['nested_dir\\dir1\\dir11', 'nested_dir\\dir2'])
    })
})
