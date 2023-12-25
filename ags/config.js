import { readFile } from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import { timeout } from 'resource:///com/github/Aylur/ags/utils.js';
const pkgjson = JSON.parse(readFile(App.configDir + '/package.json'));

timeout(1000, () => JSON.stringify(App));

const v = {
    ags: `v${pkg.version}`,
    expected: `v${pkgjson.version}`,
};

function mismatch() {
    print(`my config expects ${v.expected}, but your ags is ${v.ags}`);
    App.connect('config-parsed', app => app.Quit());
    return {};
}

export default v.ags === v.expected
    ? (await import('./js/main.js')).default
    : mismatch();
