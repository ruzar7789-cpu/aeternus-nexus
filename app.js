// Nahraď svůj starý app.js tímto kódem:

const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const valDisplay = document.getElementById('val');
const startBtn = document.getElementById('startBtn');
const warning = document.getElementById('warning');

let history = new Array(100).fill(0);

// Funkce pro vykreslování
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i = 0; i < history.length; i++) {
        let x = (canvas.width / history.length) * i;
        let y = canvas.height - (history[i] * 2); 
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    requestAnimationFrame(draw);
}

// KLÍČOVÁ ZMĚNA: Žádost o oprávnění
startBtn.addEventListener('click', async () => {
    // 1. Zkusíme DeviceOrientation (často "odemkne" i ostatní senzory)
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') {
            alert("Musíte povolit senzory pohybu v nastavení!");
            return;
        }
    }

    // 2. Aktivace Magnetometru
    if ('Magnetometer' in window) {
        try {
            const magSensor = new Magnetometer({frequency: 60});
            magSensor.addEventListener('reading', () => {
                let totalMag = Math.sqrt(magSensor.x**2 + magSensor.y**2 + magSensor.z**2);
                valDisplay.innerText = totalMag.toFixed(2);
                history.push(totalMag);
                history.shift();
            });
            magSensor.start();
            startBtn.style.display = "none";
            draw();
        } catch (err) {
            warning.style.display = "block";
            warning.innerText = "Chyba: " + err.name;
        }
    } else {
        // POSLEDNÍ MOŽNOST: Pokud Magnetometer API chybí, zkusíme DeviceOrientation
        window.addEventListener('deviceorientation', (event) => {
            // Simulace magnetického pole z náklonu (provizorní řešení)
            let val = Math.abs(event.alpha || 0) / 2; 
            valDisplay.innerText = val.toFixed(2);
            history.push(val);
            history.shift();
            startBtn.style.display = "none";
            draw();
        });
        warning.style.display = "block";
        warning.innerText = "Magnetometer API nedostupné. Používám záložní orientaci.";
    }
});
