const App = (function(){
 const demo = function () {
       
   PE.setData(DEMO_DATA);  
   UI.setTitle("HelloPlugin.dll");
   UI.render(PE.getData());
  
   UI.highlight({ offset: 0, size: 2 }, ["bg-light-red" ] );
   UI.highlight({ offset: 0x3c, size: 1 }, ["bg-pink" ] );
   UI.highlight(PE.range.start(), ["bg-light-green"]);
   UI.highlight(PE.range.signature(), ["bg-light-blue"]);
   UI.highlight(PE.range.coff.machine(), ["bg-light-yellow"]);
   UI.highlight(PE.range.coff.numberOfSections(), ["bg-light-pink"]);
   UI.highlight(PE.range.coff.timeDateStamp(), ["bg-lightest-blue"]);
   UI.highlight(PE.range.coff.pointerToSymbolTable(), ["bg-moon-gray"]);
   UI.highlight(PE.range.coff.sizeOfOptionalHeader(), ["bg-gold"]);
   UI.highlight(PE.range.coff.characteristics(), ["bg-light-red"]);
  
 }
 return {
  demo
 }
})();