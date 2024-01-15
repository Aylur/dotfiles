import { readFile } from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import GLib from 'gi://GLib';
const pkgjson = JSON.parse(readFile(App.configDir + '/package.json'));

const SKIP_CHECK = 'AGS_SKIP_V_CHECK';

const v = {
    ags: `v${pkg.version}`,
    expected: `v${pkgjson.version}`,
    check: !GLib.getenv(SKIP_CHECK),
};

function mismatch() {
    print(`my config expects ${v.expected}, but your ags is ${v.ags}`);
    print(`to skip the check run "${SKIP_CHECK}=true ags"`);
    App.connect('config-parsed', app => app.Quit());
    return {};
}

export default v.ags === v.expected || !v.check
    ? (await import('./js/main.js')).default
    : mismatch();
