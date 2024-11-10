import app from "./index";
import dbconnect from "./utils/dbconnect";

const PORT = process.env.PORT || 3002;

// connect to database
dbconnect();

// start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});