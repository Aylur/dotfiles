export const uptime = ags.Variable(0, {
    poll: [1000, ['bash', '-c', "uptime | awk '{print $3}' | tr ',' ' '"]],
});

export const distro = ags.Utils.exec('bash -c "cat /etc/os-release | grep \'^ID\' | head -n 1 | cut -d \'=\' -f2"')
    .toLowerCase();

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
