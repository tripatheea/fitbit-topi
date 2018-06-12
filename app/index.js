/*
 * Entry point for the watch app
 */
import document from "document";
// Import the messaging module
import * as messaging from "messaging";

let lightButton = document.getElementById("light-button");

function toggleLight() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'toggle'
    });
  }
}

function getLightStatus() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'get'
    });
  }
}


function updateLightIcon(data) {
  if (data == 0) {
    var button_text = "On";
    var button_image = "off.png";
    var button_color = "fb-white";
  }
  else if (data == 1) {
    var button_text = "Off";
    var button_image = "on.png";
    var button_color = "fb-green";
  }
  
  lightButton.text = button_text;
  lightButton.image = button_image;
  lightButton.style.fill = button_color;
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  getLightStatus();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if ((evt.data == 0) || (evt.data == 1)) {
    updateLightIcon(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}


getLightStatus();

lightButton.onclick = function(evt) {
  toggleLight();
}
