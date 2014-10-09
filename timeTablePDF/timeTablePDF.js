document.querySelector('.btnS>button').removeAttribute('onclick');
var pdfButton = document.querySelector('.btnS').cloneNode(true);
pdfButton.classList.add('pdf');
pdfButton.querySelector('button').addEventListener('click', makePDF);
document.querySelector('.btnS:not(.ical):not(.pdf)')
  .parentNode.insertBefore(pdfButton, document.querySelector('.btnS'));
document.querySelector('.btnS:not(.ical):not(.pdf)').style.display = 'none';

function makePDF(){
  var timeTable = document.querySelector('#contentSection');
  html2canvas(timeTable).then(function(srcCanvas) {
    var convCanvas = document.createElement("canvas");
    convCanvas.width = timeTable.offsetWidth;
    convCanvas.height = timeTable.offsetHeight;

    convCtx = convCanvas.getContext('2d');
    convCtx.drawImage(srcCanvas, 0, 0);

    var pdf = new jsPDF();
    pdf.addImage(convCanvas.toDataURL("image/png"), 'PNG', 0, 0, 0, 0);
    pdf.save("時間割_"+document.querySelector('#userId').value+".pdf");
  });
}