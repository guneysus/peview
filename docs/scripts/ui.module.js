window.UI = (function() {
 const render = function(array, bytesPerRow = 16, limit = 0x1000) {
  var chunk = array.slice(0, limit);

  var blocksData = _.chunk(chunk, bytesPerRow);
  var blocks = _.map(blocksData, function(block, index) {
   return UI.newRow(block, index, bytesPerRow);
  });

  var peContent = document.querySelector("#hex-content");
  peContent.innerHTML = null;

  _.each(blocks, function(block) {
   peContent.insertAdjacentElement("beforeend", block);
  });

  limit = limit > array.length ? array.length : limit;
  
  var lines = linenumbers(limit + (limit % 16 < 1 ? 16 : 0));
  var preContent = "\n" + lines.join("\n");
  var lineNumbersNode = document.querySelector("pre#line-numbers");
  lineNumbersNode.innerHTML = null;
  lineNumbersNode.textContent = preContent;
  
  // set title
  document.querySelector("h2#file-name").textContent = UI.getTitle();
 };

 const newRow = function(bytes, rowIndex, bytesPerRow) {
  var parent = document.createElement("div");

  var spans = _.map(bytes, function(word, index) {
   return UI.newWord(word, parent, rowIndex * bytesPerRow + index);
  });

  var asciiContainer = document.createElement("span");
  asciiContainer.classList = "ascii-container bl pl2";

  var asciiValues = _.map(bytes, function(byte, index) {
   var ascii = document.createElement("span");
   ascii.classList = ["ascii-value"];

   ascii.textContent = String.fromCharCode(byte);
   ascii.dataset.index = rowIndex * bytesPerRow + index;
   return ascii;
  });

  _.each(asciiValues, function(val) {
   asciiContainer.appendChild(val);
  });

  parent.appendChild(asciiContainer);

  parent.classList = ["block"];
  parent.dataset.index = rowIndex;
  return parent;
 };

 const toHex = function(d) {
  const padding = 2;

  var hex = d.toString(16);
  // padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

  while (hex.length < padding) {
   hex = "0" + hex;
  }
  return hex;
 };

 const bytesToHex = function(bytes) {
  /*
  https://stackoverflow.com/a/34356351/1766716
  */
  
  for (var hex = [], i = 0; i < bytes.length; i++) {
   var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
   hex.push((current >>> 4).toString(16));
   hex.push((current & 0xf).toString(16));
  }
  return hex.join("");
 };

 const newWord = function(word, parent, index) {
  var span = document.createElement("span");
  span.classList = ["hex-value"];

  var repr = toHex(word).toUpperCase();
  span.dataset.index = index;
  span.dataset.val = repr;

  span.textContent = repr;
  // span.insertAdjacentText("afterend", "\u00A0");  
  span.classList.add('ph1');
  parent.appendChild(span);
  
  return span;
 };

 const highlight = function(address, classes = ["bg-light-red"]) {
  var query = _.map(new Array(address.size), function(v, i) {
   return `span[data-index='${address.offset + i}']`;
  }).join(",");

  _.each(document.querySelectorAll(query), function(el) {
   el.classList.add(...classes);
  });
 };

 const linenumbers = function(length) {
  var lines = _.map(new Array(length >> 4), function(_, i) {
   return toHex(i << 4).toUpperCase();
  });
  return lines;
 };

 const columns = function() {
  var columms = _.map(new Array(0x10), function(el, i) {
   var col = document.createElement('span');
   col.classList.add('red', 'ph1');
   col.textContent = toHex(i).toUpperCase();
   return col;
  });
  
  return columms;
 };
 
 var _title = "";
 const setTitle = function(title) { _title = title; }
 const getTitle = function() { return _title; }
 
 return {
   render
  ,newWord
  ,newRow
  ,toHex
  ,bytesToHex
  ,highlight
  ,linenumbers
  ,columns
  ,setTitle
  ,getTitle
 };
})();
