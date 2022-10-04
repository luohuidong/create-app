import express from "express";
import morgan from "morgan";

export default function (app: express.Application): void {
  app.use(morgan("dev"));
}
