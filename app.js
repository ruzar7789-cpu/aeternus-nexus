const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const valDisplay = document.getElementById('val');
const startBtn = document.getElementById('startBtn');
const warning = document.getElementById('warning');

let historyX = new Array(100).fill(0);
let historyY = new Array(100).fill(0);
let historyZ = new Array(100).fill(0);

// Proměnné pro výpočet frekvence
let lastValue = 0;
let crossCount = 0;
let lastFreqUpdate = Date.now();
let currentHz = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mřížka
    ctx.strokeStyle = '#113311';
    for(let i=1; i<5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * (canvas.height/5));
        ctx.lineTo(canvas.width, i * (canvas.height/5));
        ctx.stroke();
    }

    // Vykreslení Hz na plátno
    ctx.fillStyle = '#00ff41';
    ctx.font = '16px monospace';
    ctx.fillText(`Odhad frekvence: ${currentHz} Hz`, 10, 25);
    if(currentHz > 100) ctx.fillText(`⚠️ VYSOKÁ FREKVENCE (PÍSKÁNÍ)`, 10, 45);

    drawAxis(historyX, '#ff3e3e'); 
    drawAxis(historyY, '#00ff41'); 
    drawAxis(historyZ, '#3e3eff'); 

    requestAnimationFrame(draw);
}

function drawAxis(data, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i = 0; i < data.length; i++) {
        let x = (canvas.width / data.length) * i;
        let y = (canvas.height / 2) - (data[i] * 1.5); 
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function calculateFrequency(currentVal) {
    // Detekce průchodu nulou (změna znaménka/směru)
    if ((lastValue > 0 && currentVal <= 0) || (lastValue < 0 && currentVal >= 0)) {
        crossCount++;
    }
    lastValue = currentVal;

    // Každou vteřinu aktualizujeme Hz
    let now = Date.now();
    if (now - lastFreqUpdate > 1000) {
        currentHz = Math.round(crossCount / 2);
        crossCount = 0;
        lastFreqUpdate = now;
    }
}

startBtn.addEventListener('click', async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try { await DeviceOrientationEvent.requestPermission(); } catch (e) {}
    }

    if ('Magnetometer' in window) {
        try {
            const magSensor = new Magnetometer({frequency: 60});
            magSensor.addEventListener('reading', () => {
                let totalMag = Math.sqrt(magSensor.x**2 + magSensor.y**2 + magSensor.z**2);
                valDisplay.innerText = totalMag.toFixed(2);
                
                calculateFrequency(magSensor.z); // Počítáme Hz z osy Z
                
                historyX.push(magSensor.x); historyX.shift();
                historyY.push(magSensor.y); historyY.shift();
                historyZ.push(magSensor.z); historyZ.shift();
            });
            magSensor.start();
            startBtn.style.display = "none";
            draw();
        } catch (err) { activateBackupMode("Záložní režim zapnut."); }
    } else {
        activateBackupMode("Magnetometr API nenalezeno.");
    }
});

function activateBackupMode(msg) {
    warning.style.display = "block";
    warning.innerText = msg;
    window.addEventListener('deviceorientation', (event) => {
        let x = event.beta || 0; let y = event.gamma || 0; let z = event.alpha || 0;
        let total = Math.sqrt(x*x + y*y + z*z);
        valDisplay.innerText = total.toFixed(2);
        calculateFrequency(z);
        historyX.push(x); historyX.shift();
        historyY.push(y); historyY.shift();
        historyZ.push(z); historyZ.shift();
        startBtn.style.display = "none";
    });
    draw();
}
