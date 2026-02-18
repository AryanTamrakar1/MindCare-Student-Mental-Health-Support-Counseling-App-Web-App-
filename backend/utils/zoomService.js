const axios = require("axios");

// This function gets a temporary access token from Zoom
const getZoomAccessToken = async () => {
  // Get the credentials
  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`,
  ).toString("base64");

  // Request the token from Zoom
  const response = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {},
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    },
  );

  // Return the token
  return response.data.access_token;
};

// This function creates a Zoom meeting and returns the links
const createZoomMeeting = async (
  date,
  timeSlot,
  studentName,
  counselorName,
) => {
  // First get the access token
  const token = await getZoomAccessToken();

  // Create the meeting on Zoom
  const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic: `MindCare Session - ${studentName} & ${counselorName}`,
      type: 2,
      start_time: new Date().toISOString(),
      duration: 60,
      settings: {
        waiting_room: true,
        join_before_host: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // Return the meeting details we need
  return {
    meetingId: response.data.id.toString(),
    joinLink: response.data.join_url, // Student uses this
    startLink: response.data.start_url, // Counselor uses this
  };
};

module.exports = { createZoomMeeting };
