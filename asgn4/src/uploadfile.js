let ctx;
//load image
document.getElementById('fileUpload').onchange = function(e) {
  var image = new Image();
  image.width=400;
  image.height=400;
  image.src = URL.createObjectURL(this.files[0]);
  image.onload = draw;
};

//draw image
function draw() {
  var canvas = document.getElementById('canvas');
  canvas.width = 400;
  canvas.height = 400;
  ctx = canvas.getContext('2d');
  ctx.drawImage(this, 0,0,400,400);
}
//clear/remove uploaded image
document.getElementById('removeimage').onclick=function(){ctx.clearRect(0, 0, 400, 400);}