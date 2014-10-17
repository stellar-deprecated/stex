var db      = stex.db;

var migrate = module.exports;

migrate.run = function (cmd, arg) {
    switch (cmd) {
        case 'make':
            return db.migrate.make(arg);
        case 'latest':
            return db.migrate.latest();
        case 'rollback':
            return db.migrate.rollback();
        case 'currentVersion':
            return db.migrate.currentVersion()
                .then(function (result) {
                    console.log(result);
                })
        default:
            throw new Error("Unknown cmd " + cmd);
    }
}
