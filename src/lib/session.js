const KEY = 'cyanide-v4-session';

const DEFAULTS = { width: 500, height: 350, isMaximized: false };

function cascade(count) {
	const offset = (count % 8) * 30;
	return { x: 80 + offset, y: 60 + offset };
}

export function createWindow(type, count) {
	return {
		id: crypto.randomUUID(),
		type,
		...cascade(count),
		...DEFAULTS,
	};
}

export const Session = {
	load() {
		try {
			return JSON.parse(localStorage.getItem(KEY)) ?? [];
		} catch {
			return [];
		}
	},

	save(windows) {
		try {
			localStorage.setItem(KEY, JSON.stringify(windows));
		} catch {
			// storage quota exceeded (e.g. private browsing)
		}
	},

	clear() {
		localStorage.removeItem(KEY);
	},
};
