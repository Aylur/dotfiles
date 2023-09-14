import icons from '../../icons.js';
import Brightness from '../../services/brightness.js';
const { Slider, Box, Icon } = ags.Widget;

const BrightnessSlider = () => Slider({
    drawValue: false,
    hexpand: true,
    connections: [
        [Brightness, slider => {
            slider.value = Brightness.screen;
        }],
    ],
    onChange: ({ value }) => Brightness.screen = value,
});

export default () => Box({
    className: 'slider',
    children: [
        Icon({
            icon: icons.brightness.indicator,
            className: 'icon',
            connections: [[Brightness, icon => {
                icon.tooltipText = `Screen Brightness ${Math.floor(Brightness.screen * 100)}%`;
            }]],
        }),
        BrightnessSlider(),
    ],
});
