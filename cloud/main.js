const axios = require('axios');

Parse.Cloud.define("songs", async (request) => {
	const { data: raw } = await axios.get('https://chiasenhac.vn/nhac-hot/vietnam.html');

	const r_song = /<div class="tool d-table-cell text-right">(.|\r|\n)*?<a.*?href="(.*?)"((.|\r|\n)*?)addPlaylistTable\('(.*?)', '(.*?)', '(.*?)', '(.*?)'\)/gm;

	let id = 0;

	const songs = [];
	do {
		let rel = r_song.exec(raw);
		if (!rel)
			break;

		songs.push({
			id: id++,
			url: rel[2],
			name: rel[5],
			singer: rel[7]
		}); 
	} while(true);

  return songs;
});

Parse.Cloud.define("getsong", async (request) => {
	const url = request.params.url;
	const { data: raw } = await axios.get(url);

	const r_source = /"file": "(.*?)"/gm;
	const source = r_source.exec(raw)[1];

	const r_subtitle = /class="rabbit-lyrics">((.|\r|\n)*?)<\/div>/gm;

	const subtitle = (r_subtitle.exec(raw) || [])[1] || '';
	return {
		url,
		source,
		subtitle
	};
});