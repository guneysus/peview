window.Uploader = (function() {
 const upload = function(el) {
  let file = el.files[0];
  
  UI.setTitle(file.name);
  
  file.arrayBuffer().then(result => {
   var data = new Uint8Array(result);
   PE.setData(data);
   UI.render(PE.getData());
   

  });
 };
 
 return {
  upload
 };
})();
