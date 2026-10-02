// Shared settings for the student and teacher pages.
window.QUEUE_CONFIG = {
  title: "Sanchez IT Essentials Class Song Queue",
  // Requests are relayed through ntfy.sh (free, no account). Messages are kept for ~12 hours,
  // and the teacher page saves everything it sees in the browser so nothing is lost after that.
  topic: "sanchez-itess-queue-e1df3d597f664331cca72e35",
  relay: "https://ntfy.sh",
  // How many songs one device can request per window.
  maxRequestsPerWindow: 3,
  windowMinutes: 30,
  // Client ID of the Spotify app made at developer.spotify.com (see README). Leave empty to
  // turn off one-click queueing; the teacher page then only shows "Open in Spotify".
  spotifyClientId: "38b1303d4c054778801072fe5bc40305",
};
