const prefix = '';

export default {
  register: `${prefix}/user/signup`,
  login: `${prefix}/user/login`,
  logout: `${prefix}/user/logout`,
  updateUser: `${prefix}/user`,
  isSessionActive: `${prefix}/user/isLoggedIn`,
  addTrack: `${prefix}/track`,
  getAllTracks: `${prefix}/tracks`,
};
