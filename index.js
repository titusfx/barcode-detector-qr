import './style.css';

const byId = document.getElementById.bind(document);
const video = byId('video');
const canvas = byId('canvas');
const output = byId('output');

// Initializa la Camara
navigator.getUserMedia(
  { video: true },
  stream => {
    video.srcObject = stream;
    detectCode();
  },
  () => {}
);

// Detectar el codigo QR
function detectCode() {
  const bd = new BarcodeDetector({
    // Aqui ponemos los formatos que queramos lista 👉 t.ly/JHFR
    formats: ['qr_code']
  });
  setInterval(() => {
    canvas.getContext('2d').drawImage(video, 0, 0, 300, 110);

    bd.detect(canvas).then(([data]) => {
      output.innerText = data.rawValue;
    });
  }, 100);
}
