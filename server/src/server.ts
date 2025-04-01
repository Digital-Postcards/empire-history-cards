import app from "./index";
import dbconnect from "./utils/dbconnect";
import { SERVER_CONFIG } from "./config";

// Connect to database
dbconnect();

// Start the server
app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`Server is running at http://localhost:${SERVER_CONFIG.PORT}`);
});
