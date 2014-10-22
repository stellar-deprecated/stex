var db      = stex.db;

var migrate = module.exports;

// TODO: remove directory config below once backwards compatibility with db-migrate is removed
var config = {
  directory: stex.root + "/migrations-knex"
}

migrate.run = function (cmd, arg) {
  switch (cmd) {
  case 'make':
    return db.migrate.make(arg, config);
  case 'latest':
    return db.migrate.latest(config);
  case 'rollback':
    return db.migrate.rollback(config);
  case 'currentVersion':
    return db.migrate.currentVersion(config)
      .then(function (result) {
        console.log(result);
      })
  default:
    throw new Error("Unknown cmd " + cmd);
  }
}
