// API Bridge na Vercelu
let lockStatus = "locked"; 

export default function handler(req, res) {
    const { action, deviceId } = req.body || req.query;

    // 1. Termux pošle příkaz k otevření
    if (action === "trigger_ble_unlock") {
        lockStatus = "unlock_now";
        console.log(`[!] Remote trigger received for ${deviceId}`);
        return res.status(200).json({ status: "signal_sent_to_browser" });
    }

    // 2. Prohlížeč se neustále ptá: "Mám už otevřít?"
    if (action === "check_status") {
        const current = lockStatus;
        if (lockStatus === "unlock_now") lockStatus = "locked"; // Reset po přečtení
        return res.status(200).json({ command: current });
    }

    res.status(200).json({ status: "AUTHORIZED", deviceId });
}
