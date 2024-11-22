function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getExpirationTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  return now;
}

module.exports = { generateOTP, getExpirationTime };
