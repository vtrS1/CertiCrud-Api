import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import db from "./models";
import routes from "./routes";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Conexão estabelecida com sucesso.");
  } catch (error) {
    console.log("Error runing app: ", error);
  }
});
