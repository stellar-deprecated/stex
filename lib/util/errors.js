var util = require("util");

Error.subclass = function(errorName) {
  function MyError(message) {
    var tmp = Error.apply(this, arguments);
    tmp.name = this.name = "MyError";

    this.stack = tmp.stack;
    this.message = tmp.message;

    return this;
  };

  var IntermediateInheritor = function() {}
  IntermediateInheritor.prototype = Error.prototype;
  MyError.prototype = new IntermediateInheritor();

  return MyError;
};

Error.prototype.setCode = function(code) {
  this.code = code;
  return this;
}

Error.prototype.setData = function(data) {
  this.data = data;
  return this;
}

var errors = module.exports;

errors.DuplicateRecord = Error.subclass("DuplicateRecord");
errors.MissingField    = Error.subclass("MissingField");
errors.RecordNotFound  = Error.subclass("RecordNotFound");
errors.Forbidden       = Error.subclass("Forbidden");
errors.ArgumentError   = Error.subclass("ArgumentError");

errors.ClientError = Error.subclass("ClientError");