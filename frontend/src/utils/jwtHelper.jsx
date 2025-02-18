import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default decodeToken;