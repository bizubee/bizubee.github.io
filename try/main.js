
import bizubee from 'rollup-plugin-bizubee';

var bzEditor, jsEditor;

const moduleCache = new Map();

const options = {
	getResolver() {
		return {
			resolveId(importee) {
				if (importee === 'main') {
					return 'main.bz';
				} else {
					return `${importee}.js`
				}
			},
			load(id) {
				if (id === 'main.bz') {
					return {code: bzEditor.getValue()};
				} else {
					if (moduleCache.has(id)) {
						return {code: moduleCache.get(id)};
					} else return new Promise((win, fail) => {
						const xhr = new XMLHttpRequest();

						xhr.onreadystatechange = () => {
							if (xhr.readyState === 4) {
								if (xhr.status === 200) {
									const code = xhr.responseText;
									moduleCache.set(id, code);
									win({code});
								} else {
									fail(new Error(
										`Request failed with status ${xhr.status}`
										));
								}
							}
						}

						xhr.open('GET', `modules/${id}`, true);
						xhr.send();
					});
				}
			}
		}
	}
};

function compile() {
	return rollup.rollup({
		entry: 'main',
		plugins: [bizubee(options)]
	}).catch(e => {
		console.log(e.stack);
	}).then(bundle => {
		return result = bundle.generate({});
	});
}

const actions = {
	compile() {
		return compile().then(result => {
			jsEditor.setValue(result.code);
		});
	},
	run() {
		compile().then(result => {
			const fn = new Function(result.code);
			fn();
		});
	}
};

let timeout;

function onChange() {
	if (timeout) {
		window.clearTimeout(timeout);
	}

	timeout = window.setTimeout(actions.compile, 1000);
}

window.onload = function(e) {
	bzEditor = CodeMirror(document.getElementById('bz-editor'), {
		value: Cookies.get('code') || '',
		mode: 'bizubee',
		theme: 'bizubee',
		lineNumbers: true
	});

	bzEditor.on('change', onChange);

	onChange();

	jsEditor = CodeMirror(document.getElementById('js-editor'), {
		mode: 'javascript',
		theme: 'elegant'
	});

	const query = document.querySelectorAll('#actions input[bind-to]');
	for (var i = 0; i < query.length; i++) {
		const action = query[i].getAttribute('bind-to');
		query[i].onclick = actions[action];
	}
}

window.onbeforeunload = function() {
	Cookies.set('code', bzEditor.getValue());
}

