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
				this.findGames();
				this.findPlayers();
				cb(this.combineData());
			}
		}, 2500);
	}
}

class Statistics {
	constructor(games, interestingPlayers) {
		this.games = games;
		this.interestingPlayers = interestingPlayers;
	}

	getGamesPlayed(player) {
		return this.games.filter(
			game => game.players.find(p => p.name === player) !== undefined,
		);
	}

	getStats() {
		const interestingAverages = {};

		for (const player of this.interestingPlayers) {
			const games = this.getGamesPlayed(player);
			const playerStats = this.getPlayerStats(player, games);

			const averages = this.getPlayerAverages(playerStats);
			const moreThanXKills = this.getGamesWithMoreThanXKills(playerStats);

			interestingAverages[player] = { averages, moreThanXKills };
		}

		return interestingAverages;
	}

	getPlayerStats(player, games) {
		return games.map(game => game.players.find(p => p.name === player));
	}

	getPlayerAverages(stats) {
		const playerTotals = {
			kills: 0,
			assists: 0,
			deaths: 0,
			mvps: 0,
			ping: 0,
			hsp: 0,
			score: 0,
		};

		for (const stat of stats) {
			Object.keys(playerTotals).forEach(key => {
				playerTotals[key] += stat[key];
			});
		}

		const averages = {};

		Object.keys(playerTotals).forEach(totalKey => {
			averages[totalKey] = playerTotals[totalKey] / stats.length;
		});

		return averages;
	}

	getGamesWithMoreThanXKills(stats) {
		const moreThan = {
			0: 0,
			10: 0,
			20: 0,
			30: 0,
			40: 0,
		};

		for (const stat of stats) {
			Object.keys(moreThan).forEach(key => {
				if (stat.kills > key) {
					moreThan[key]++;
				}
			});
		}

		return moreThan;
	}
}

(() => {
	const gameLoader = new GameLoader();
	gameLoader.init(data => {
		const statistics = new Statistics(data, [
			'joo',
		]);
		const stats = statistics.getStats();
		console.log('stats', stats);
		browser.runtime.sendMessage(stats);
	});
})();
