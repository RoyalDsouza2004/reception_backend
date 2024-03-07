import { app } from "./app.js";

app.listen(4000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
});