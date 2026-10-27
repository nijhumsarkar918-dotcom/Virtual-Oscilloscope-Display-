const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');

const ampInput = document.getElementById('amplitude');
const freqInput = document.getElementById('frequency');
const resInput = document.getElementById('resistance');
const capInput = document.getElementById('capacitance');

const ampVal = document.getElementById('amp-val');
const freqVal = document.getElementById('freq-val');
const resVal = document.getElementById('res-val');
const capVal = document.getElementById('cap-val');
const fcVal = document.getElementById('fc-val');
const gainVal = document.getElementById('gain-val');

function drawOscilloscope() {
  const Vin = parseFloat(ampInput.value);
  const f = parseFloat(freqInput.value);
  const R = parseFloat(resInput.value);
  const C = parseFloat(capInput.value) * 1e-6; // Convert µF to Farads

  ampVal.textContent = Vin;
  freqVal.textContent = f;
  resVal.textContent = R;
  capVal.textContent = (C * 1e6).toFixed(1);

  // RC Low-Pass Filter Math
  const fc = 1 / (2 * Math.PI * R * C);
  const gain = 1 / Math.sqrt(1 + Math.pow(f / fc, 2));
  const phaseShift = -Math.atan(f / fc);

  fcVal.textContent = fc.toFixed(2);
  gainVal.textContent = gain.toFixed(3);
  const Vout = Vin * gain;

  // Clear Screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Grid Lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Center Axis
  ctx.strokeStyle = '#475569';
  ctx.beginPath(); ctx.moveTo(0, 175); ctx.lineTo(canvas.width, 175); ctx.stroke();

  // Draw Input Waveform (Cyan)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const t = x * 0.0001;
    const y = 175 - (Vin * 15 * Math.sin(2 * Math.PI * f * t));
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw Output Waveform (Pink)
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const t = x * 0.0001;
    const y = 175 - (Vout * 15 * Math.sin(2 * Math.PI * f * t + phaseShift));
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

[ampInput, freqInput, resInput, capInput].forEach(input => {
  input.addEventListener('input', drawOscilloscope);
});

drawOscilloscope();
