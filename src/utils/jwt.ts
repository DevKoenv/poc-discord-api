import { EncryptJWT, jwtDecrypt } from "jose";
import { jwtConfig } from "../config";
import Logger from "./logger";

const generateEncryptedToken = (payload: any) => {
  try {
    return new EncryptJWT(payload)
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
      .encrypt(Buffer.from(jwtConfig.jwt_secret, "hex"));
  } catch (error) {
    Logger.error('Error generating encrypted token:', error);
    // throw error;
    return null;
  }
};

const decodeToken = async (token: string) => {
  try {
    return await jwtDecrypt(token, Buffer.from(jwtConfig.jwt_secret, "hex"));
  } catch (error) {
    Logger.error('Error decoding token:', error);
    // throw error;
    return null;
  }
};

export { generateEncryptedToken, decodeToken };