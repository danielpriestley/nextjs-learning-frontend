import cookie from "cookie";

export function parseCookies(req) {
  console.log(req);
  return cookie.parse(req ? req.headers.cookie || "" : "");
}
