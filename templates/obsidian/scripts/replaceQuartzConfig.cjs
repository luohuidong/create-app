const fs = require('node:fs')
const path = require('node:path')
const yaml = require('js-yaml')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default

const customConfig = yaml.load(fs.readFileSync(path.resolve(__dirname, '..', 'config.yaml'), {
    encoding: 'utf-8'
}))

const quartzConfigPath = path.join(__dirname, '..', 'quartz', 'quartz.config.ts')
const code = fs.readFileSync(quartzConfigPath, {
    encoding: 'utf-8'
})

const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [
        'typescript'
    ]
})

traverse(ast, {
    ['ObjectProperty'](path) {
        const key = path.node.key
        if (key.name === 'configuration') {
            path.traverse({
                ['ObjectProperty'](path) {
                    const key = path.node.key
                    if (customConfig[key.name]) {
                        path.node.value.value = customConfig[key.name]
                    }
                }
            })
            path.skip()
        }
    }
})

const result = generate(ast).code

fs.writeFileSync(quartzConfigPath, result, {
    encoding: 'utf-8'
})