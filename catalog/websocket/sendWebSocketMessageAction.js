/**
 * Sends a payload message to the designated WebSocket URI
 *
 * @param uri       String representation of the WebSocket uri
 * @param payload   Message to send to the WebSocket
 * @return  Standard OpenWhisk success/error response
 */
function main(params) {
    if (!params.uri) {
        return whisk.error('You must specify a uri parameter.');
    }
    var uri = params.uri;

    console.log("URI param is " + params.uri);

    if (!params.payload) {
        return whisk.error('You must specify a payload parameter.');
    }
    var payload = params.payload;

    console.log("Payload param is " + params.payload);

    var WebSocket = require('ws');

    var connectionEstablished = false;
    var ws = new WebSocket(uri);

    var connectionTimeout = 30 * 1000; // 30 seconds

    setTimeout(function() {
        if (!connectionEstablished) {
            whisk.error('Did not establish websocket connection to ' + uri + ' in a timely manner.');
        }
    }, connectionTimeout);

    ws.on('open', function() {
        connectionEstablished = true;

        console.log("Sending payload: " + payload);
        ws.send(payload, function(error) {
            if (error) {
                console.log("Error received communicating with websocket: " + error);
                ws.close();
                whisk.error(error)
            } else {
                console.log("Send was successful.")
                ws.close();
                whisk.done({
                    'payload': payload
                });
            }
        });
    });

    ws.on('error', function(error) {
        console.log("Error communicating with websocket: " + error);
        ws.close();
        whisk.error(error);
    });

    return whisk.async();
}
