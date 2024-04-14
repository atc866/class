let ctx;
document.getElementById('fileUpload').onchange = function(e) {
  var img = new Image();
  img.onload = draw;
  img.onerror = failed;
  img.height=400;
  img.width=400;
  img.src = URL.createObjectURL(this.files[0]);
};
function draw() {
  var canvas = document.getElementById('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  ctx = canvas.getContext('2d');
  //ctx.globalAlpha=0;
  ctx.drawImage(this, 0,0,400,400);
}
function failed() {
  console.error("The provided file couldn't be loaded as an Image media");
}

document.getElementById('removeimage').onclick=function(){ctx.clearRect(0, 0, 400, 400);}