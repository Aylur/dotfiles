import App from 'resource:///com/github/Aylur/ags/app.js';

const expectedVersion = '1.5.1';
let config = {};

if (pkg.version === expectedVersion) {
    config = (await import('./js/main.js')).default;
}
else {
    print('your ags version is ' + pkg.version);
    print('my config uses the git branch which is ' + expectedVersion);
    print('update ags to the current git version');
    App.connect('config-parsed', app => app.Quit());
}

export default config;
