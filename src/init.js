import "dotenv/config";
import "./db";
import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`✅Server Listening on port ${PORT}🎉`);
app.listen(4000, handleListening);