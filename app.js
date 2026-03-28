const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const valDisplay = document.getElementById('val');
const startBtn = document.getElementById('startBtn');
const warning = document.getElementById('warning');

let history = new Array(100).fill(0);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for(let i = 0; i < history.length; i++) {
        let x = (canvas.width / history.length) * i;
        let y = canvas.height - (history[i] * 2); // Měřítko citlivosti
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    requestAnimationFrame(draw);
}

startBtn.addEventListener('click', async () => {
    if (typeof Magnetometer !== "undefined") {
        try {
            const magSensor = new Magnetometer({frequency: 60});
            magSensor.addEventListener('reading', () => {
                // Výpočet celkové síly pole (vektorový součet)
                let totalMag = Math.sqrt(magSensor.x**2 + magSensor.y**2 + magSensor.z**2);
                valDisplay.innerText = totalMag.toFixed(2);
                history.push(totalMag);
                history.shift();
                
                if(totalMag > 100) valDisplay.style.color = "#ff3e3e";
                else valDisplay.style.color = "#00ff41";
            });
            magSensor.start();
            document.getElementById('status').innerText = "Status: SKENOVÁNÍ AKTIVNÍ";
            startBtn.style.display = "none";
            draw();
        } catch (err) {
            warning.style.display = "block";
            console.error(err);
        }
    } else {
        warning.style.display = "block";
        warning.innerText = "Tento prohlížeč nebo zařízení nepodporuje Generic Sensor API.";
    }
});
