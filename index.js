#!/usr/bin/env node
const Jimp = require("jimp");
const sharp = require("sharp");
const path = require("path");
const fontsMap = require("./fonts-map");
const ttf = require("./ttf");
const argv = require("yargs")
  .option("resize", {
    alias: "r"
  })
  .option("bgColor", {
    alias: "b",
    default: "black"
  })
  .option("color", {
    alias: "c",
    default: "white"
  })
  .option("message", {
    alias: "m"
  })
  .option("fontsize", {
    alias: "s",
    default: 200
  })
  .option("fontfamily", {
    alias: "f",
    default: "montserrat"
  }).argv;

const imageSize = 2160;
const message = argv.message;
const width = 1800;
const fontSize = parseInt(argv.fontsize, 10);
const lines = Math.ceil((message.length * fontSize) / width);
const height = lines * 1.1 * fontSize;
const marginX = (imageSize - width) / 2;
const marginY = (imageSize - height) / 2;

const wob = async ({
  message,
  width,
  height,
  marginX,
  marginY,
  resize,
  bgColor
}) => {
  const image = await new Jimp(2160, 2160, bgColor);
  const text = await ttf(
    message,
    width,
    height,
    path.join(__dirname, "fonts", fontsMap[argv.fontfamily]),
    fontSize,
    argv.color
  );
  image.composite(text, marginX, marginY);
  const file = message.replace(/[^a-z0-9+]+/gi, "") + ".jpg";
  await image.writeAsync(message.replace(/[^a-z0-9+]+/gi, "") + ".jpg");
  if (resize) {
    await sharp(file)
      .resize(resize)
      .toFile(file.replace(".jpg", resize.toString() + ".jpg"));
  }
};

(async () => {
  if (!argv.message) {
    console.log("No messsage provided.");
    process.exit();
  }

  console.log(`Using font: ${argv.fontfamily}`);

  await wob({
    message: argv.message,
    width,
    height,
    marginX,
    marginY,
    resize: argv.resize && parseInt(argv.resize, 10),
    bgColor: argv.bgColor
  });
})();
