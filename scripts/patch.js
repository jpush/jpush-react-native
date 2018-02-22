const fs = require('fs')
const glob = require('glob')
const inquirer = require('inquirer')
const makeRecipes = require('./recipes')

const debug = console.log

function checkPatch (text, patch) {
  return [text, patch]
    .map(x => x.replace(/\s+/g, ' '))
    .reduce((t, p) => t.includes(p))
}

/**
 * @param {string} text
 * @param {Recipe} recipe
 * @return {string?}
 */
function applyRecipe (text, recipe) {
  if (!text || checkPatch(text, recipe.patch)) {
    return null
  }

  const matched = text.match(recipe.pattern)
  if (matched && matched.length === 1) {
    return text.replace(matched[0], `${matched[0]}${recipe.patch}`)
  }

  return text
}

/**
 * @param {string} file
 * @param {(Recipe|Recipe[])} recipes
 */
function patch (file, recipes) {
  debug(`patching ${file}`)

  const path = glob.sync(file, {
    ignore: ['node_modules/**', '**/build/**']
  })[0]

  const init = fs.readFileSync(path, 'utf8')
  const text = recipes.reduce(applyRecipe, init)

  if (text) {
    fs.writeFileSync(path, text)
  }
}

const questions = [
  {
    type: 'input',
    name: 'appKey',
    message: 'Input the appKey for JPush'
  }
]

inquirer.prompt(questions).then(answers => {
  const recipes = makeRecipes(answers)
  Object.keys(recipes).forEach(file => {
    patch(file, [].concat(recipes[file]))
  })

  debug('patch done!')
})
