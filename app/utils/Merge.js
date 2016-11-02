module.exports = {
  merge: function(){
    // Combines several objects into one.
    // Does not mutate its arguments.
    // e.g. merge({a: 1, b: 2}, {c: 'hi!'}) = {a: 1, b: 2, c: 'hi!'}
    var items = Array.prototype.slice.call(arguments);
    var out = {};
    items.forEach(function(item) {
      Object.keys(item).forEach(function(key) {
        out[key] = item[key];
      });
    });
    return out;
  }
};