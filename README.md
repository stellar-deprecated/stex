# Stex
**An opinionated web framework built upon expressjs**

Express is nice, but bare.  Rails has many great features, but can be overkill
for json microservices.  Stex aims to be a point in the middle.  It does this by
making a few opinionated choices with how you solve the recurrent problems of
building a production ready web application.  Namely, it makes choices for you
regarding:  configuration, logging, database access, database schema management,
error handling, error reporting, and more.

Lets look at what Stex provides in each of these areas:

## Configuration

Configuration within stex is managed by [nconf](https://www.npmjs.org/package/nconf),
and your configuration files are laid out in a manner similar to how rails 
handles configuration.  You application will have a directory called `/config`
and that folder will contain files named corresponding to the NODE_ENVs they 
apply to. `development.json` and `production.json` would be examples.  In 
addition, there is a special file allowed named `all-envs.json` that lets you set
defaults for your config that can be overriden in more specific environments.

Stex exposes a global var `conf` through which you can get access to your 
configuration. Say for example you have a config file that looks like so:

```json
{
  "showStackTraces": true,
  "logLevel": "debug",
  "PORT" : 3000
}
```

Executing `conf.get("showStackTraces")` will return `true`.  Simple enough, eh?

## Logging

Logging is provided via [bristol](https://www.npmjs.org/package/bristol) and 
exposed through another handy global: `log`.  In addition to the human-friendly
console output that you get when your `logTarget` config variable is set to 
`humanizer`, you can also get easily scriptable json logs sent to syslog if you
set your target to `syslog`

Out of the box, we log data pertaining to every request coming in and every
response leaving your application.  We also log every uncaught error. In the 
future, we will log every db query.

TODO: describe more about the json-based logging system

## Database Access

Rather than going straight to bundling an ORM, we're starting stex of with just
[knex](https://www.npmjs.org/package/knex).  We expose a knex client to you 
under the global `db`, such that you can write code like so:

```javascript
db("users").where("id", id).select()
```

## Database Schema Management

Knex is great for query building, but Knex for data migration is a bit underbaked
at the moment.  Given that, we've decided to leverage [db-migrate](https://www.npmjs.org/package/db-migrate)
instead for db migrations.

TODO: go into details, fool

## Error Handling

Stex installs a set of middleware to make the unhandled error story of your app
a little less hands on.  Stex provides a simple 404 handler for you, and will
render a standardized response to the client (plus sending error data to your log)
for any error that makes it past your custom middlewares.

## Error Reporting

In addition to your local logs, we bundle support for [sentry](http://getsentry.com) 
meaning that if you supply a configuration value for `sentryDsn` we will 
automically start reporting error data to sentry for you.

## And More...

### Stex CLI

The Stex CLI is your gateway.  It provides a series of subcommands that should help you in your day-to-day:  `www`, `console`, `db-console`, `db-migrate` and `humanize-logs`.  We'll go through each one:

#### stex www

Starts up a server process.  Add the option --watch to have stex watch your 
directory for file changes and automatically restart itself when it needs to.

#### stex console

Opens up a REPL with the Stex application globals loaded.

#### stex db-console

Opens up a MySQL console given the current configuration

#### stex db-migrate

TODO


### Gulp
TODO

### Testing
TODO

### Lifecycle

A Stex application has, at present, 4 different lifecycle events that happen:  
init, activate, boot, and finally shutdown. 

####  Init

Loading your stex application (by requiring your app.js) will initiate the 
'init' event, and will initialize as much of the framework as possible... 
notably it will allow you to use the logging and configuration infrastructure 
of the app.

#### Activate

Stex is not designed to have multiple concurrent stex applications running in 
the same process; By taking this stance, we allow you to make your app code more
concise by relying upon a curated set of global vars we think most of your code
needs access to.  Activation is the lifecycle event that installs these global
vars.

#### Boot

Everything else needed to get your application loaded runs during the boot event.
Database connections, middleware installation, routing definitions, and heavy 
work.

#### Shutdown

Can be triggered to force db connections to close, etc. so that your process can
gracefully terminate.
