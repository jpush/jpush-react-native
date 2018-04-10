const patch = require('mpatch')
const inquirer = require('inquirer')
const makeRecipes = require('./recipes')

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

  console.log('done!')
})
