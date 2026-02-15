    const smpp = require('smpp');

    // Create an SMPP server instance
    const server = smpp.createServer({ debug: true }, (session) => {
        console.log('Client connected!');

        session.on('connect', () => {
            console.log('Session connected');
        });

        session.on('close', () => {
            console.log('Session closed');
        });

        session.on('error', (error) => {
            console.error('Session error:', error);
        });

        // Handle bind_transceiver requests
        session.on('bind_transceiver', (pdu) => {
            console.log('Bind Transceiver request received:', pdu);
            // Authenticate the client (e.g., check system_id and password)
            if (pdu.system_id === 'YOUR_SYSTEM_ID' && pdu.password === 'YOUR_PASSWORD') {
                session.send(pdu.response()); // Send successful bind response
                console.log('Client bound successfully!');
            } else {
                session.send(pdu.response({ command_status: smpp.errors.ESME_RBINDFAIL })); // Send bind failure response
                console.log('Bind failed: Invalid credentials.');
            }
        });

        // Handle submit_sm requests (incoming SMS from client)
        session.on('submit_sm', (pdu) => {
            console.log('Submit SM received:', pdu);
            // Process the incoming message (e.g., store in a database, forward)
            // You can also send a delivery receipt (deliver_sm) back to the client later
            session.send(pdu.response()); // Acknowledge the submit_sm
        });

        // Handle deliver_sm requests (delivery receipts from client or incoming MO messages)
        session.on('deliver_sm', (pdu) => {
            console.log('Deliver SM received:', pdu);
            // Process delivery receipt or incoming MO message
            session.send(pdu.response()); // Acknowledge the deliver_sm
        });

        // Handle enquire_link requests (keep-alive messages)
        session.on('enquire_link', (pdu) => {
            console.log('Enquire Link received.');
            session.send(pdu.response()); // Respond to keep the session alive
        });

        // Handle unbind requests
        session.on('unbind', (pdu) => {
            console.log('Unbind request received.');
            session.send(pdu.response()); // Acknowledge unbind
            session.close();
        });
    });

    // Start listening on a specific port
    server.listen(2775, () => {
        console.log('SMPP Server listening on port 2775');
    });