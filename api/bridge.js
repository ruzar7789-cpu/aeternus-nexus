// API Bridge na Vercelu - Finální verze pro Marcela
// Používáme globální objekt pro simulaci paměti v rámci jedné instance
let lockStatus = "locked"; 

export default function handler(req, res) {
    // Podpora pro JSON body (z Termuxu) i Query params (z prohlížeče)
    const data = req.method === 'POST' ? req.body : req.query;
    const { action, deviceId } = data;

    // 1. PŘÍJEM Z TERMUXU (Volba 3)
    if (action === "trigger_ble_unlock") {
        lockStatus = "unlock_now";
        console.log(`[!] Remote trigger received for: ${deviceId}`);
        return res.status(200).json({ 
            status: "signal_sent_to_browser",
            command: "DEPLOYED" 
        });
    }

    // 2. DOTAZ Z PROHLÍŽEČE (Viewer u boxu)
    if (action === "check_status") {
        const current = lockStatus;
        if (lockStatus === "unlock_now") {
            lockStatus = "locked"; // Reset po úspěšném předání
        }
        return res.status(200).json({ command: current });
    }

    // 3. ZÁKLADNÍ AUTORIZACE (Volba 1 v Termuxu)
    res.status(200).json({ 
        status: "AUTHORIZED", 
        deviceId: deviceId || "3c400ea8e35724d5",
        target: "CZ-1MV"
    });
}
