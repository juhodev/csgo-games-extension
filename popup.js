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
		addText(nameRow, `Player ${key}`);
		playerStatsDiv.appendChild(nameRow);

		Object.keys(averages).forEach(averageKey => {
			addText(
				currentRow,
				`${averageKey}: ${Math.round(averages[averageKey])}`,
			);
			console.log('adding text to', currentRow);

			if (currentRow.children.length === 2) {
				playerStatsDiv.appendChild(currentRow);
				currentRow = createDiv('row');
			}
		});

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

		playerStatsDiv.appendChild(killsDiv);
	});

	document.getElementById('container').appendChild(playerStatsDiv);
});

function createDiv(name) {
	const div = document.createElement('div');
	div.className = name;
	return div;
}

function addText(div, text) {
	const span = document.createElement('span');
	span.textContent = text;
	div.appendChild(span);
}
