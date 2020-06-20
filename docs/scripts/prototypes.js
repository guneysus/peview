Number.prototype.toHex = function() {
  const padding = 2;

  var hex = this.toString(16);
  // padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

  while (hex.length < padding) {
   hex = "0" + hex;
  }
  return hex;
};

Uint8Array.prototype.toHex = function() {
  for (var hex = [], i = 0; i < this.length; i++) {
   var current = this[i] < 0 ? this[i] + 256 : this[i];
   hex.push((current >>> 4).toString(16));
   hex.push((current & 0xf).toString(16));
  }
  return hex.join(""); 
}