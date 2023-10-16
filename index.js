import { spawn } from "child_process";
import fs from "fs";

const API_TOKEN = process.env._CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env._CLOUDFLARE_ACCOUNT_ID;

const whisper = async (file) => {
	const res = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/openai/whisper`,
		{
			headers: { Authorization: `Bearer ${API_TOKEN}` },
			body: file,
			method: "POST",
		}
	);
	return await res.json();
};

const child = spawn("arecord -f S16_LE output.wav", { shell: true });
setTimeout(() => {
	child.kill();
	fs.readFile("output.wav", async (err, data) => {
		if (err) {
			console.error("Error reading the file:", err);
			return;
		}
		const arrayBuffer = data.buffer;
		console.log(
			(await whisper(arrayBuffer)).result.text.replace(/^ /, "").toLowerCase()
		);
	});
}, 5000);
