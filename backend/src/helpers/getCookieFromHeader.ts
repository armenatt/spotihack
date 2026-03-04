export const getCookieFromHeader = (cookies: string, cookieName: string) => {
  const authenticationCookieStartIndex = cookies.indexOf(cookieName + '=');
  const endIndex =
    cookies
      .replace(cookieName + '=', '')
      .slice(authenticationCookieStartIndex)
      .indexOf(';') || cookies.length;

  const result = cookies
    .slice(authenticationCookieStartIndex)
    .replace(cookieName + '=', '')
    .slice(0, endIndex);
  return result;
};
