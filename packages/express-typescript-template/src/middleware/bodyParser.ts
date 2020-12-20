import express from "express";
import bodyParser from "body-parser";

export default function (app: express.Application): void {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(bodyParser.raw());
}
