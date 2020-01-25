console.log('popup.js');

document.getElementById('load-button').onclick = () => {
	browser.tabs
		.executeScript({ file: 'csgo.js' })
		.catch(e => console.error(e));
};

browser.runtime.onMessage.addListener(message => {
	console.log('message', message);
	const playerStatsDiv = createDiv('stats');
	console.log(playerStatsDiv);
	let currentRow = createDiv('row');

	Object.keys(message).forEach(key => {
		const playerDiv = createDiv('playerDiv');
		const playerData = message[key];
		const averages = playerData.averages;
		const nameRow = createDiv('row');
		addText(nameRow, key, 'player-name');
		playerDiv.appendChild(nameRow);

		Object.keys(averages).forEach(averageKey => {
			addText(
				currentRow,
				`${formatText(averageKey)}: ${Math.round(
					averages[averageKey],
				)}`,
			);
			console.log('adding text to', currentRow);

			if (currentRow.children.length === 2) {
				playerDiv.appendChild(currentRow);
				currentRow = createDiv('row');
			}
		});

		if (currentRow.children.length > 0) {
			playerDiv.appendChild(currentRow);
			currentRow = createDiv('row');
		}

		playerStatsDiv.appendChild(playerDiv);

		const moreThanXKills = playerData.moreThanXKills;
		const killsDiv = createDiv('morethanxkills');

		Object.keys(moreThanXKills).forEach(key => {
			console.log(key, moreThanXKills[key]);
			addText(
				killsDiv,
				`More than ${key} kills: ${moreThanXKills[key]} times`,
			);
		});

		playerDiv.appendChild(killsDiv);
	});

	document.getElementById('container').appendChild(playerStatsDiv);
});

function createDiv(name) {
	const div = document.createElement('div');
	div.className = name;
	return div;
}

function addText(div, text, name) {
	const span = document.createElement('span');
	span.textContent = text;
	if (name !== undefined) {
		span.className = name;
	}
	div.appendChild(span);
}

function formatText(text) {
	switch (text) {
		case 'kills':
			return 'Kills';

		case 'assists':
			return 'Assists';

		case 'deaths':
			return 'Deaths';

		case 'mvps':
			return 'MVPs';

		case 'ping':
			return 'Ping';

		case 'hsp':
			return 'HS%';

		case 'score':
			return 'Score';
	}
}
