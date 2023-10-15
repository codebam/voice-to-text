import mic from "mic";
import fs from "fs";

const API_TOKEN = process.env._CLOUDFLARE_GLOBAL_API_TOKEN;
const ACCOUNT_ID = process.env._CLOUDFLARE_ACCOUNT_ID;
const ACCOUNT_EMAIL = process.env._CLOUDFLARE_ACCOUNT_EMAIL;

const whisper = async (file) => {
	const res = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/openai/whisper`,
		{
			headers: {
				"Content-Type": "application/json",
				"X-Auth-Email": ACCOUNT_EMAIL,
				"X-Auth-Key": API_TOKEN,
			},
			body: file,
			method: "POST",
		}
	);
	return await res.json();
};

const micInstance = mic({
	rate: "16000",
	channels: "1",
});
const micInputStream = micInstance.getAudioStream();
const outputFileStream = fs.WriteStream("output.wav");
micInputStream.pipe(outputFileStream);
micInstance.start();
setTimeout(() => {
	micInstance.stop();
	fs.readFile("output.wav", async (err, data) => {
		if (err) {
			console.error("Error reading the file:", err);
			return;
		}
		const arrayBuffer = data.buffer;
		console.log((await whisper(arrayBuffer)).result.text.replace(/^ /, ""));
	});
}, 5000);