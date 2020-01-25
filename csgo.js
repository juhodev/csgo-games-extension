class GameLoader {
	constructor() {
		this.players = [];
		this.games = [];
		this.loadCounter = 0;
		this.pagesToLoad = 1;
	}

	init(cb) {
		this._loadMore(cb);
	}

	findGames() {
		const allResults = document.getElementsByClassName(
			'csgo_scoreboard_inner_left',
		);

		for (const result of allResults) {
			const tBody = result.children[0];
			const trArray = tBody.children;

			const map = trArray[0].childNodes[1].firstChild.textContent;
			const date = trArray[1].childNodes[1].firstChild.textContent;
			const waitTime = trArray[2].childNodes[1].firstChild.textContent;
			const matchDuration =
				trArray[3].childNodes[1].firstChild.textContent;

			const gameResult = { map, date, waitTime, matchDuration };

			Object.keys(gameResult).forEach(key => {
				gameResult[key] = gameResult[key].replace(/\n|\t/g, '');
			});

			this.games.push(gameResult);
		}
	}

	findPlayers() {
		const allScoreboards = document.getElementsByClassName(
			'csgo_scoreboard_inner_right',
		);

		for (const scoreboard of allScoreboards) {
			const players = [];
			const tBody = scoreboard.children[0];
			const trArray = tBody.children;
			// trArray.shift();

			for (const tr of trArray) {
				const thInsideTrArray = tr.children;
				if (thInsideTrArray.length <= 1) continue;

				const playerNicknameEllipsis = thInsideTrArray[0].children[1];
				if (playerNicknameEllipsis === undefined) continue;

				const name =
					playerNicknameEllipsis.firstChild.firstChild.textContent;
				const ping = thInsideTrArray[1].firstChild.textContent;
				const kills = thInsideTrArray[2].firstChild.textContent;
				const assists = thInsideTrArray[3].firstChild.textContent;
				const deaths = thInsideTrArray[4].firstChild.textContent;
				const mvps = thInsideTrArray[5].firstChild.textContent;
				const hsp = thInsideTrArray[6].firstChild.textContent;
				const score = thInsideTrArray[7].firstChild.textContent;

				// Holy fucking shit this looks awful
				const playerProfile = {
					name,
					ping: parseInt(ping),
					kills: parseInt(kills),
					assists: parseInt(assists),
					deaths: parseInt(deaths),
					mvps: mvps.includes('★')
						? mvps.substr(mvps.length - 1, mvps.length) !== '★'
							? parseInt(
									mvps.substr(mvps.length - 1, mvps.length),
							  )
							: 0
						: 0,
					hsp: parseInt(hsp.replace('%', '')),
					score: parseInt(score),
				};

				players.push(playerProfile);
			}

			this.players.push(players);
		}
	}

	combineData() {
		if (this.games.length !== this.players.length) {
			window.alert(`this.games.length doesn't equal this.players.length`);
			return;
		}

		const newGameArray = [];
		for (let i = 0; i < this.games.length; i++) {
			const combinedData = {
				game: this.games[i],
				players: this.players[i],
			};

			newGameArray.push(combinedData);
		}

		return newGameArray;
	}

	_loadMore(cb) {
		this.loadCounter++;
		document.getElementById('load_more_button').click();

		setTimeout(() => {
			if (this.loadCounter < this.pagesToLoad) {
				this._loadMore(cb);
			} else {
				console.log('all loaded');
				this.findGames();
				this.findPlayers();
				console.log(this.games);
				console.log(this.players);
				cb(this.combineData());
			}
		}, 2500);
	}
}

const gameLoader = new GameLoader();
gameLoader.init(data => {
});
