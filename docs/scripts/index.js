/**
 * index.js
 * - All our useful JS goes here, awesome!
 */

console.log("JavaScript is amazing!");

document.addEventListener('DOMContentLoaded', function() {
 
 App.demo();
 
 var columns = UI.columns(); 
 var ruler = document.querySelector("#pe-ruler");
  // ruler.insertAdjacentText("afterBegin", "\u00A0"); 

 _.each(columns, function(col){
  ruler.appendChild(col);
 });


 document.querySelectorAll('.hexdump span').forEach(function(el) {
  el.addEventListener('click', function(evt){
   // evt.target.classList.toggle("bg-light-red");
   // debugger;
   // alert(evt.target.dataset.val);
   var self = evt.target;
   var parent = self.parentElement;
   var startByte = (Number.parseInt(parent.dataset.start) - 1) * 32 + (Number.parseInt(self.dataset.index) - 1);
   var result = self.dataset.val.split(' ').map(hex2a);
   console.debug(result);
  });
 });
 
}); /* DOM Content Loaded */