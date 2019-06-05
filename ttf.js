const im = require("gm").subClass({ imageMagick: true });
const jimp = require("jimp");

module.exports = async (msg, x, y, path, size, HexColor) => {
	if (!x || !y) {
		throw new Error("[ttfFont][ALERT] Error: X or Z is not specified !");
	}
	if (!path || path === undefined) {
		throw new Error(
				"[ttfFont][ALERT] Error: Path is not specified or is undefined !"
				);
	}
	if (!size || size === undefined) {
		throw new Error(
				"[ttfFont][ALERT] Error: Size is not specified or is undefined !"
				);
	}
	if (!HexColor || HexColor === undefined) {
		throw new Error(
				"[ttfFont][ALERT] Error: HexColor is not specified or is undefined !"
				);
	}

	return new Promise(async (resolve, reject) => {
		let img = im(x, y).command("convert"); //width, height
		img.font(path, size); //path, Font size
		img.out("-fill").out(HexColor); //HexaColor important!
		img.out("-background").out("transparent");
		img.out("-gravity").out("west");
		img.out(`caption:${msg}`); //Text
		img.setFormat("png").toBuffer(async function(err, buffer) {
			if (err) throw reject(`[ttfFont][ALERT] ${err} !`);
			await resolve(buffer);
		});
	}).then(async buffer => {
		return await jimp.read(buffer);
	});
};
