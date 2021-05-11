import './style.css';

const byId = document.getElementById.bind(document);
const video = byId('video');
const canvas = byId('canvas');
const output = byId('output');
const devicesListUI = byId('devices');
let deviceSelected;

function showSelectedListGUI(element) {
  const className = 'selected';
  document.querySelectorAll('li').forEach(e => e.classList.remove(className));
  element.classList.add(className);
}
function selectedDevice(event, device, element) {
  deviceSelected = device;
  showSelectedListGUI(element);
  // Initializa la Camara
  navigator.getUserMedia(
    { video: device },
    mediaStream => {
      video.srcObject = mediaStream;
      console.log(mediaStream.getTracks());
      let track = mediaStream.getTracks()[0];
      track
        .applyConstraints({ advanced: [{ focusMode: 'manual' }] })
        .then(r => console.log('Then', r))
        .catch(r => console.log('Catch', r));
      detectCode();
    },
    () => {}
  );

  setInterval(() => {
    canvas.getContext('2d').drawImage(video, 0, 0, 300, 110);
  }, 100);
}

function associateDeviceWithOptionGUI(devices) {
  devices.forEach(function(device) {
    const d = document.createElement('li');
    d.innerText = `${device.label}:${device.kind}`;
    devicesListUI.appendChild(d);
    d.addEventListener('click', event => selectedDevice(event, device, d));
  });
}

function enumerateAllDevicesToSelect() {
  navigator.mediaDevices
    .enumerateDevices()
    .then(devices => associateDeviceWithOptionGUI(devices))
    .catch(function(err) {
      console.log(err.name + ': ' + err.message);
    });
}

enumerateAllDevicesToSelect();

// Detectar el codigo QR
function detectCode() {
  if (!('BarcodeDetector' in window)) {
    console.log('No barcode detector support');
    return;
  }
  const bd = new BarcodeDetector({
    // Aqui ponemos los formatos que queramos lista 👉 t.ly/JHFR
    formats: ['qr_code']
  });

  bd.detect(canvas).then(([data]) => {
    output.innerText = data.rawValue;
  });
}
