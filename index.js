#!/usr/bin/env node
const Jimp = require("jimp");
const ttf = require("./ttf");
const sharp = require("sharp");
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
  }).argv;

const imageSize = 2160;
const message = process.argv[process.argv.length - 1];
const width = 1800;
const fontSize = 196;
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
  const colors =
    bgColor === "black" || !bgColor
      ? { bg: "./blacksquare.jpg", font: "#FFFFFF" }
      : { bg: "./whitesquare.jpg", font: "#000" };
  const image = await new Jimp(2160, 2160, bgColor);
  const text = await ttf(
    message,
    width,
    height,
    "./fonts/montserrat/Montserrat-ExtraBold.ttf",
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
