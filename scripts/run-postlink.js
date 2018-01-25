;[
  // run postlink sequentially
  require('./postlink-android'),
  require('./postlink-ios')
]
  .reduce((p, fn) => p.then(fn), Promise.resolve())
  .catch(err => {
    console.error(err.message)
  })
