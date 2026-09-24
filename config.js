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
};
