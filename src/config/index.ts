import dotenv from "dotenv";

dotenv.config();

  
export default {
    NODE_ENV: process.env.NODE_ENV,
 port: process.env.PORT,
 db_url: process.env.DB_URL,
 bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
 jwt_access_secret: process.env.JWT_ACCESS_SECRET,

}