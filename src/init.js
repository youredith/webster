import "dotenv/config";
import "./db";
import app from "./server";

export const GLOBAL_URL_HTTPS = "https://localhost:";
export const GLOBAL_URL_HTTP = "http://localhost:";
export const PORT = "4000";

const handleListening = () => console.log(`✅Server Listening on port ${PORT}🎉`);
app.listen(PORT, handleListening);