export const sessionOptions = {
  cookieName: 'admin_session',
  password: process.env.SESSION_PASSWORD || "replace_this_with_a_random_string_at_least_32_chars_long",
  cookieOptions: {
    httpOnly: true,                          // JS on the page can't read the cookie
    secure: process.env.USE_HTTPS === 'true', // only sent over HTTPS in production
    sameSite: 'lax',                          // CSRF mitigation for cross-site requests
    maxAge: 30 * 60,                          // 30 minutes, in seconds (iron-session wants seconds here)
  },
};

// Shape of session.* fields we rely on throughout the app:
// {
//   csrfToken, formRenderedAt, loginPageVisited,   -> set on GET /login (pre-auth)
//   userId, username, isAuthenticated, loginAt,     -> set on successful login
//   ip, newDeviceFlag, lastActivity
// }
