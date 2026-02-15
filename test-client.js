    const smpp = require('smpp');
    const session = smpp.connect({
        //host: '139.59.38.57', // Replace with your SMPP server IP or hostname
		host: 'localhost',
        port: 2775, // Default SMPP port, adjust if different
        // auto_enquire_link_period: 10000, // Optional: for keeping connection alive
        // debug: true // Optional: for detailed logging
    });
	
	
	    session.on('connect', () => {
        console.log('Connected to SMPP server');
        session.bind_transceiver({
            system_id: 'YOUR_SYSTEM_ID', // Your system ID provided by the SMSC
            password: 'YOUR_PASSWORD', // Your password provided by the SMSC
            // Other optional parameters like interface_version, system_type, etc.
        }, (pdu) => {
            if (pdu.command_status === 0) {
				
				session.submit_sm({
			destination_addr: '918903860041',
			short_message: 'Hello World €$£'
		}, function(pdu) {
			if (pdu.command_status == 0) {
				// Message successfully sent
				console.log(pdu.message_id);
			}
		});
		session.unbind();
                console.log('Successfully bound to SMPP server');
            } else {
                console.error('Bind failed:', pdu.command_status);
            }
        });
		
		
    });