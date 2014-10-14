var db      = stex.db;

var migrate = module.exports;

migrate.run = function (cmd, arg) {
    switch (cmd) {
        case 'make':
            return db.migrate.make(arg);
        case 'latest':
            return db.migrate.latest(config);
        case 'rollback':
            return db.migrate.rollback(config);
        case 'currentVersion':
            return db.migrate.currentVersion(config);
        default:
            throw new Error("Unknown cmd " + cmd);
    }
}
