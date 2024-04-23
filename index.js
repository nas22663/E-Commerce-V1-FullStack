import express from "express";
import { config } from "dotenv";
import { initiateApp } from "./Server/src/initiate-app.js";

config({ path: "/Server/config/dev.config.env" });

const app = express();

initiateApp(app, express);
