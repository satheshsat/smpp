const smpp = require('smpp');

// Create the server
const server = smpp.createServer((session) => {
    session.on('error', (err) => {
        console.error('Session error:', err);
    });

    // Handle authentication (Bind)
    session.on('bind_transceiver', (pdu) => {
        // Pause session while checking credentials
        session.pause();
        
        const { system_id, password } = pdu;
        
        // Example check; replace with actual database lookup
        if (system_id === 'myUser' && password === 'myPass') {
            session.send(pdu.response());
            session.resume();
            console.log(`User ${system_id} authenticated.`);
        } else {
            session.send(pdu.response({ command_status: smpp.ESME_RBINDFAIL }));
            session.close();
        }
    });

    // Handle incoming SMS submission (Client sending to server)
    session.on('submit_sm', (pdu) => {
        const { destination_addr, short_message } = pdu;
        console.log(`Sending SMS to ${destination_addr}: ${short_message}`);
        
        // Acknowledge receipt to the client
        session.send(pdu.response({ message_id: 'unique-msg-id-123' }));
    });
});

// Start listening on the standard SMPP port
const PORT = 2775;
server.listen(PORT, () => {
    console.log(`SMPP server running on port ${PORT}`);
});
