module.exports.config = {
	name: "joinNoti",
	eventType: ["log:subscribe"],
	version: "1.0.4",
	credits: "Mirai Team",
	description: "Thông báo bot hoặc người vào nhóm",
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, Users }) {
	const { join } = global.nodemodule["path"];
	const { threadID } = event;
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		api.changeNickname(`▷ ${global.config.PREFIX} ◁ • ${(!global.config.BOTNAME) ? "Made by Binee" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
		return api.sendMessage(`╭──────╮\n100%✎Kết nối thành công✅\n╰──────╯\n●▬▬▬▬๑⇩⇩๑▬▬▬▬●\n➔Lệnh「! 」\nAdmin《....》.\n ●▬▬▬▬๑۩۩๑▬▬▬▬●`, threadID);
	}
	else {
		try {
			const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
			let { threadName, participantIDs } = await api.getThreadInfo(threadID);

			const threadData = global.data.threadData.get(parseInt(threadID)) || {};
			const path = join(__dirname, "cache", "joinMp4");
			const pathGif = join(path, `hi.mp4`);

			var mentions = [], nameArray = [], memLength = [], i = 0;
			
			for (id in event.logMessageData.addedParticipants) {
				const userName = event.logMessageData.addedParticipants[id].fullName;
				nameArray.push(userName);
				mentions.push({ tag: userName, id });
				memLength.push(participantIDs.length - i++);

				if (!global.data.allUserID.includes(id)) {
					await Users.createData(id, { name: userName, data: {} });
					global.data.userName.set(id, userName);
					global.data.allUserID.push(id);
				}
			}
			memLength.sort((a, b) => a - b);
			
			(typeof threadData.customJoin == "undefined") ? msg = "⚡️ᴀɴʜ ᴇᴍ ʀᴀ đóɴ ᴛʜàɴʜ ᴠɪêɴ ᴍớɪ ɴè, đâʏ ʟà {name}⚡️\n\n⚡️ 𝟷 ʜảᴏ ʜáɴ đã ʙướᴄ ᴠàᴏ {threadName}⚡️\n\n⚡️{name} , {type} ʟà ᴠị ʜảᴏ ʜáɴ ᴛʜứ {soThanhVien} ᴠᴜɪ ʟòɴɢ đọᴄ ɴʜữɴɢ đɪềᴜ ʟệɴʜ sᴀᴜ đâʏ ɴʜé : \n✪Dùng lệnh !setname (tên cần đổi)\n✪Giới thiệu họ tên ,năm sinh, nơi ở.\n ✪ Từ giờ bạn sẽ là 1 vị huynh đài ở đây!" : msg = threadData.customJoin;
			msg = msg
			.replace(/\{name}/g, nameArray.join(', '))
			.replace(/\{type}/g, (memLength.length > 1) ?  'các bạn' : 'bạn')
			.replace(/\{soThanhVien}/g, memLength.join(', '))
			.replace(/\{threadName}/g, threadName);

			if (existsSync(path)) mkdirSync(path, { recursive: true });

			if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
			else formPush = { body: msg, mentions }

			return api.sendMessage(formPush, threadID);
		} catch (e) { return console.log(e) };
	}
}
