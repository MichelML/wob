#!/usr/bin/env node
const Jimp = require("jimp");
const sharp = require("sharp");
const path = require("path");
const fontsMap = require("./fonts-map");
const ttf = require("./ttf");
const argv = require("yargs")
.option("resize", {
	alias: "r",
	type: "number",
	describe: "Resize picture to nxn pixels"
})
.option("bgColor", {
	alias: "b",
	type: "string",
	default: "black",
	describe: "CSS/Hex value of the background"
})
.option("color", {
	alias: "c",
	type: "string",
	default: "white",
	describe: "CSS/Hex value of the font"
})
.option("message", {
	alias: "m",
	type: "string",
	default: "",
	describe: "Message"
})
.option("fontsize", {
	alias: "s",
	type: "number",
	default: 200,
	describe: "Font size in pixels"
})
.option("fontfamily", {
	alias: "f",
	type: "string",
	choices: ["anton", "comfortaa", "karla", "roboto", "montserrat"],
	default: "montserrat",
	describe: "Font-family"
})
.help()
.argv;

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

	console.log(`
			Message: ${argv.message}
			Font color: ${argv.color}
			Font size: ${argv.fontsize}
			Font family: ${argv.fontfamily}
			Background color: ${argv.bgColor}
			Resize: ${argv.resize || "none"}
			`);

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
