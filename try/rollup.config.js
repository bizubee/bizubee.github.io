import { readFileSync } from 'fs';
import nodeResolve from 'rollup-plugin-node-resolve';

const plugin = {
	load(id) {
		if (id === 'fs' || ~id.indexOf( 'fs.js' ) )
			return readFileSync( 'browser/fs.js', 'utf-8' );
		if (id === 'path' || ~id.indexOf( 'path.js' ) )
			return readFileSync( 'browser/path.js', 'utf-8' );
	}
};

export default {
    entry: 'main.js',
    dest: 'main.out.js',
    plugins: [plugin, nodeResolve({jsnext: true})]
}
