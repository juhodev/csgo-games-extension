class GameLoader {
	constructor() {
		this.players = [];
		this.games = [];
		this.loadCounter = 0;
		this.pagesToLoad = 1;
	}

	init() {
		this._loadMore();
	}

	findGames() {
		const allResults = document.getElementsByClassName(
			'csgo_scoreboard_inner_left',
		);

		for (const result of allResults) {
			const tBody = result.children[0];
			const trArray = tBody.children;

			// const map = trArray[0].childNodes[1];
			// const date = trArray[1].childNodes[1];
			// const waitTime = trArray[2].childNodes[1];
			// const matchDuration = trArray[3].childNodes[1];

			// const gameResult = { map, date, waitTime, matchDuration };
			// this.games.push(gameResult);
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
			firstChild;
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

				const playerProfile = {
					name,
					ping,
					kills,
					assists,
					deaths,
					mvps,
					hsp,
					score,
				};

				players.push(playerProfile);
			}

			this.players.push(players);
		}
	}

	_loadMore() {
		this.loadCounter++;
		document.getElementById('load_more_button').click();

		setTimeout(() => {
			if (this.loadCounter < this.pagesToLoad) {
				this._loadMore();
			} else {
				console.log('all loaded');
				this.findGames();
				this.findPlayers();
				console.log(this.games);
				console.log(this.players);
			}
		}, 2500);
	}
}

const gameLoader = new GameLoader();
gameLoader.init();
