const smpp = require('smpp');

// 1. Establish session to your SMPP server
const session = smpp.connect({
    url: 'smpp://localhost:2775',
    auto_reconnect: true
});

// 2. Authenticate (Bind) with the server
session.bind_transceiver({
    system_id: 'myUser',
    password: 'myPass'
}, (pdu) => {
    if (pdu.command_status === smpp.ESME_ROK) {
        console.log('Successfully bound to SMPP server.');
        
        // 3. Send the SMS once authenticated
        sendSMS();
    } else {
        console.error('Authentication failed. Status code:', pdu.command_status);
    }
});

function sendSMS() {
    session.submit_sm({
        source_addr: 'MyCompany',        // Sender ID (Alphanumeric or shortcode)
        source_addr_ton: 5,              // Type of Number (5 = Alphanumeric)
        source_addr_npi: 0,              // Numbering Plan Indicator
        destination_addr: '918903860041',   // Target mobile number (with country code)
        dest_addr_ton: 1,                // Type of Number (1 = International)
        dest_addr_npi: 1,                // Numbering Plan Indicator (1 = E.164)
        short_message: 'Hello! This is a test message from my Node.js SMPP server.'
    }, (pdu) => {
        if (pdu.command_status === smpp.ESME_ROK) {
            console.log('SMS sent successfully! Message ID:', pdu.message_id);
        } else {
            console.error('Failed to send SMS. Status code:', pdu.command_status);
        }
    });
}
