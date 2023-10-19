export default {
    // if this player is running this will be shown on panel
    preferredMpris: 'spotify',

    // number of workspaces shown on panel and overview
    // set to 0 to make it dynamic
    workspaces: 7,

    battaryBar: {
        // wether to show percentage by deafult
        showPercentage: false,

        // at what percentages should the battery-bar change color
        low: 30,
        medium: 50,
    },

    // path to read temperature from
    temperature: '/sys/class/thermal/thermal_zone0/temp',

    // at what intervals should cpu, ram, temperature refresh
    systemFetchInterval: 5000,

    // the slide down animation on quicksettings and dashboard
    windowAnimationDuration: 250,

    // keyboard id for brightnessctl
    brightnessctlKBD: 'asus::kbd_backlight',

    dock: {
        iconSize: 56,
        pinnedApps: [
            'firefox',
            'org.wezfurlong.wezterm',
            'org.gnome.Nautilus',
            'org.gnome.Calendar',
            'obsidian',
            'transmission-gtk',
            'caprine',
            'teams-for-linux',
            'discord',
            'spotify',
            'com.usebottles.bottles',
            'org.gnome.Software',
        ],
    },

    substitutions: {
        icons: [
            ['transmission-gtk', 'transmission'],
            ['blueberry.py', 'bluetooth'],
            ['org.wezfurlong.wezterm', 'folder-code'],
            ['com.raggesilver.BlackBox', 'folder-code'],
            ['Caprine', 'facebook-messenger'],
            ['', 'preferences-desktop-display'],
        ],
        titles: [
            ['transmission-gtk', 'Transmission'],
            ['com.obsproject.Studio', 'OBS'],
            ['com.usebottles.bottles', 'Bottles'],
            ['com.github.wwmm.easyeffects', 'Easy Effects'],
            ['org.gnome.TextEditor', 'Text Editor'],
            ['org.gnome.design.IconLibrary', 'Icon Library'],
            ['blueberry.py', 'Blueberry'],
            ['org.wezfurlong.wezterm', 'Wezterm'],
            ['com.raggesilver.BlackBox', 'BlackBox'],
            ['firefox', 'Firefox'],
            ['org.gnome.Nautilus', 'Files'],
            ['libreoffice-writer', 'Writer'],
            ['', 'Desktop'],
        ],
    },
};
