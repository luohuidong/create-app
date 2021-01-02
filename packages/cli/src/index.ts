import path from "path";
import CopyTemplate from "./CopyTemplate";

const copyTemplate = new CopyTemplate(
  "https://api.github.com/repos/luohuidong/app-template/tarball/",
  path.resolve(__dirname, "../tmp")
);

copyTemplate.copy();
