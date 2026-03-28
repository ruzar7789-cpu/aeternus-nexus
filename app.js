const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const valDisplay = document.getElementById('val');
const startBtn = document.getElementById('startBtn');
const warning = document.getElementById('warning');

// Historie pro všechny tři osy
let historyX = new Array(100).fill(0);
let historyY = new Array(100).fill(0);
let historyZ = new Array(100).fill(0);

// Funkce pro vykreslování osciloskopu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Vykreslení mřížky na pozadí
    ctx.strokeStyle = '#113311';
    ctx.lineWidth = 1;
    for(let i=1; i<5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * (canvas.height/5));
        ctx.lineTo(canvas.width, i * (canvas.height/5));
        ctx.stroke();
    }

    // Vykreslení jednotlivých os (X=Červená, Y=Zelená, Z=Modrá)
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
        // Centrování grafu na střed plátna
        let y = (canvas.height / 2) - (data[i] * 1.5); 
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

startBtn.addEventListener('click', async () => {
    // 1. Žádost o oprávnění (nutné pro iOS a novější Androidy)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission !== 'granted') {
                alert("Pro fungování musíte povolit senzory v nastavení!");
                return;
            }
        } catch (e) { console.error(e); }
    }

    // 2. Aktivace plného Magnetometru (pokud je dostupný)
    if ('Magnetometer' in window) {
        try {
            const magSensor = new Magnetometer({frequency: 60});
            magSensor.addEventListener('reading', () => {
                // Výpočet celkové síly pro hlavní displej
                let totalMag = Math.sqrt(magSensor.x**2 + magSensor.y**2 + magSensor.z**2);
                valDisplay.innerText = totalMag.toFixed(2);
                
                // Ukládání surových dat z os
                historyX.push(magSensor.x); historyX.shift();
                historyY.push(magSensor.y); historyY.shift();
                historyZ.push(magSensor.z); historyZ.shift();
            });
            magSensor.start();
            startBtn.style.display = "none";
            draw();
        } catch (err) {
            activateBackupMode("Chyba senzoru: " + err.name);
        }
    } else {
        activateBackupMode("Magnetometer API nedostupné. Používám záložní režim.");
    }
});

function activateBackupMode(msg) {
    warning.style.display = "block";
    warning.innerText = msg;
    
    window.addEventListener('deviceorientation', (event) => {
        // Záložní režim využívá orientaci (Alpha, Beta, Gamma) k detekci změn
        let x = event.beta || 0;
        let y = event.gamma || 0;
        let z = event.alpha || 0;
        
        let total = Math.sqrt(x*x + y*y + z*z);
        valDisplay.innerText = total.toFixed(2);
        
        historyX.push(x); historyX.shift();
        historyY.push(y); historyY.shift();
        historyZ.push(z); historyZ.shift();
        
        startBtn.style.display = "none";
    });
    draw();
}
