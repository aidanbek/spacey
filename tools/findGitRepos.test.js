const extract = require('./findGitRepos');
const mock = require('mock-fs');
const GIT = '.git'

afterEach(() => mock.restore())

describe('find git repo', () => {
    it('no git repo in empty dir', () => {
        mock({
            'node_modules': mock.load('node_modules'),
            empty_folder: {},
        })

        const actual = extract('empty_folder')

        expect(actual).toEqual([])
    })

    it('passed dir as git repo', () => {
        mock({
            'node_modules': mock.load('node_modules'),
            dir_as_git_repo: {
                [GIT]: {}
            },
        })

        const actual = extract('dir_as_git_repo')

        expect(actual).toEqual(['dir_as_git_repo'])
    })

    it('nested dirs as git repos', () => {
        mock({
            'node_modules': mock.load('node_modules'),
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

        const actual = extract('nested_dir')

        expect(actual).toEqual(['nested_dir/dir1/dir11', 'nested_dir/dir2'])
    })
})
