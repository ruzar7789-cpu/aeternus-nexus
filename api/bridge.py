// OMNI-KEY CLOUD BRIDGE - VERZE 2.0 (OPRAVA AUTORIZACE)
export default function handler(req, res) {
  // Získání parametrů z požadavku Termuxu
  const { deviceId, action } = req.query;

  // TVÉ UNIKÁTNÍ ID Z VIDEA
  const MASTER_ID = "3c400ea8e35724d5";

  // LOGIKA OVĚŘENÍ - OPRAVA STAVU UNAUTHORIZED
  if (deviceId === MASTER_ID) {
    return res.status(200).json({
      status: "AUTHORIZED", 
      target: "CZ-1MV",
      command: "READY_FOR_COMMAND",
      timestamp: new Date().toISOString()
    });
  } else {
    // Pokud ID nesouhlasí, přístup je zamítnut
    return res.status(403).json({
      status: "DENIED",
      message: "Unknown Device ID"
    });
  }
}
