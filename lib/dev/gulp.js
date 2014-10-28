module.exports = function() {

  var StexDev = require("../stex-dev.js");
  var plugins = StexDev.gulpPlugins();
  var paths   = StexDev.paths;
  var gulp    = require("gulp");
  var Promise = require("bluebird");
  var _       = require('lodash');

  gulp.on('stop', shutdown);
  gulp.on('err', shutdown);

  addAppTasks();
  addTestTasks();
  addDbTasks();

  // REMOVED until we can figure out why jsdoc continually breaks the build
  // gulp.task('docs', function() {
  //   return gulp.src(paths.docs)
  //     .pipe(plugins.jsdoc.parser({}))
  //     .pipe(plugins.jsdoc.generator('./docs'));
  // });

  gulp.task('watch', function() {
    gulp.run('test');
    gulp.watch(paths.watch, ['test']);
    gulp.watch(paths.docs,  ['docs']);
  });

  return gulp;

  function addAppTasks() {
    gulp.task('app', function(next) {
      var stex = require(paths.root + "/lib/app");
      stex.init().then(function() {
        stex.activate();
        next();
      });
    });
  }

  function addTestTasks() {
    gulp.task('lint', function () {
      return gulp.src(paths.lint)
        .pipe(plugins.jshint('.jshintrc'))
        // .pipe(plugins.jscs())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
    });

    gulp.task('mocha', function(cb) {
      return ensureTestDbCreated()
        .then(spawnMocha);
    });

    gulp.task('db:ensure-created-test', function () {
      return gulp
        .start('db:ensure-created')
        .start('db:migrate')
        .start('db:migrate-knex');
    });

    function spawnMocha() {
      return gulp
        .src(paths.tests, {"cwd": paths.root})
        .pipe(plugins.spawnMocha({
          'reporter' : 'list',
          'env'      : {'NODE_ENV': 'test'},
          'istanbul' : true
        }));
    }

    function ensureTestDbCreated() {
      if (process.env["NODE_ENV"] === 'test') {
        console.log("already test!");
        return gulp.start("db:ensure-created-test");
      } else {
        return spawnGulpTask('db:ensure-created-test', "test");
      }
    }

    gulp.task('submit-coverage', function(cb) {
      return gulp
        .src("./coverage/**/lcov.info", {"cwd": paths.root})
        .pipe(plugins.coveralls());
    });
  }

  function spawnGulpTask(task, targetEnv) {
    return new Promise(function (resolve, reject) {
      var join  = require('path').join;
      var spawn = require('child_process').spawn;
      var bin   = join(paths.root, "node_modules/gulp/bin/gulp.js");
      var env = _.assign({}, process.env);
      env.NODE_ENV = targetEnv;
      var proc = spawn(bin, [task], { stdio: 'inherit', env: env });
      proc.on('close', function (code) {
        if(code === 0) {
          resolve();
        } else {
          reject(new Error("Process failed: " + code));
        }
      });
    });
  }

  function addDbTasks() {
    gulp.task('db:ensure-created', ['app'], function() {
      var Knex       = stex.constructor.Knex;
      var dbConfig   = conf.get("db");
      var dbToCreate = dbConfig.connection.database;
      // create a connection to the db without specifying the db
      delete dbConfig.connection.database;
      var db = Knex.initialize(dbConfig);

      return db.raw("CREATE DATABASE IF NOT EXISTS `" + dbToCreate + "`")
        .then(function() { /* noop */ })
        .finally(function(){
          db.client.pool.destroy();
        });
    });

    gulp.task('db:migrate', function(next) {
      var join  = require('path').join;
      var spawn = require('child_process').spawn;
      var bin   = join(require.resolve('stex'), "..", "bin", "stex");

      var proc = spawn(bin, ["db-migrate", "up"], { stdio: 'inherit' });
      proc.on('close', function (code) {
        if(code === 0) {
          next();
        } else {
          next(new Error("Process failed: " + code));
        }
      });
    });

    gulp.task('db:migrate-knex', function (next) {
      var join  = require('path').join;
      var spawn = require('child_process').spawn;
      var bin   = join(require.resolve('stex'), "..", "bin", "stex");

      var proc = spawn(bin, ["migrate", "latest"], { stdio: 'inherit' });
      proc.on('close', function (code) {
        if(code === 0) {
          next();
        } else {
          next(new Error("Process failed: " + code));
        }
      });
    })
  }


  function shutdown() {
    if(typeof stex !== 'undefined') {
      stex.shutdown();
    }
  }
};
