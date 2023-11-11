import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import GLib from 'gi://GLib';
import options from './options.js';

const intval = options.systemFetchInterval;

export const uptime = Variable('', {
    poll: [60_000, 'cat /proc/uptime', line => {
        const uptime = Number.parseInt(line.split('.')[0]) / 60;
        if (uptime > 18 * 60)
            return 'Go Sleep';

        const h = Math.floor(uptime / 60);
        const s = Math.floor(uptime % 60);
        return `${h}:${s < 10 ? '0' + s : s}`;
    }],
});

export const distro = GLib.get_os_info('ID');

export const distroIcon = (() => {
    switch (distro) {
        case 'fedora': return '';
        case 'arch': return '';
        case 'nixos': return '';
        case 'debian': return '';
        case 'opensuse-tumbleweed': return '';
        case 'ubuntu': return '';
        case 'endeavouros': return '';
        default: return '';
    }
})();

/** @type {function([string, string] | string[]): number} */
const divide = ([total, free]) => Number.parseInt(free) / Number.parseInt(total);

export const cpu = Variable(0, {
    poll: [intval, 'top -b -n 1', out => divide(['100', out.split('\n')
        .find(line => line.includes('Cpu(s)'))
        ?.split(/\s+/)[1]
        .replace(',', '.') || '0'])],
});

export const ram = Variable(0, {
    poll: [intval, 'free', out => divide(out.split('\n')
        .find(line => line.includes('Mem:'))
        ?.split(/\s+/)
        .splice(1, 2) || ['1', '1'])],
});

export const temp = Variable(0, {
    poll: [intval, 'cat ' + options.temperature, n => {
        return Number.parseInt(n) / 100_000;
    }],
});
