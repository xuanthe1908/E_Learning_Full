import jwtDecode, { JwtPayload } from "jwt-decode";

interface Payload {
  email: string;
  Id: string;
  role: string;
}
interface DecodedToken extends JwtPayload {
  exp: number;
  iat: number;
  payload: Payload;
}

const decodeJwtToken = (jwtToken: string): DecodedToken | null => {
  // Return null if token is empty or invalid
  if (!jwtToken || jwtToken.trim() === "" || jwtToken === "null" || jwtToken === "undefined") {
    return null;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(jwtToken);
    return decodedToken;
  } catch (error) {
    // Silently fail - don't log errors for invalid/empty tokens
    // This is expected when user is not logged in
    return null;
  }
};

export default decodeJwtToken;






















