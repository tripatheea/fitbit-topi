/*
 * Entry point for the companion app
 */
// Import the messaging module
import * as messaging from "messaging";

var update_url = "https://explrr.com/topi/update/index.php";
var status_url = "https://explrr.com/topi/status/index.php";

function fetchLightStatus() {
  fetch(status_url)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    returnLightStatus(myJson);
  });
}

function toggleLights() {
  
  fetch(status_url)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    var currentLightStatus = myJson;
    var data = "status=" + Math.abs(myJson - 1);
    
    fetch(update_url, {
      method: 'post',
      body: data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function(response) {
      console.log(response);
      returnLightStatus(Math.abs(myJson - 1));
    });
  });
}

function returnLightStatus(data) {
  console.log("Sending data back to device" + data);
  
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "toggle") {
    toggleLights();
  }
  else if (evt.data && evt.data.command == "get") {
    fetchLightStatus();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}