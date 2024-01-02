import options from '../../options.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';

const disk = (/** @type {string} */ mount) => {
  const mountpoint = Variable(0, {
    poll: [options.systemFetchInterval, ['bash', '-c', `df -hl | grep ${mount} | awk '{print $5+0}'`]],
  })
  return mountpoint;
};

export default (/** @type {string} */ mount, /** @type {string} */ title, /** @type {string} */ icon) => {
  let used = disk(mount)

  return PanelButton({
    class_name: 'disk-bar',
    content: Widget.Box({
      binds: [['tooltipText', used, 'value', v => `${title}: ${v}% used`]],
      className: `system-resources-box ${mount}`,
      hexpand: false,
      connections: [[used, widget => {
        widget.toggleClassName('high', used.value > 90);
      }]],
      children: [
        Widget.Icon({
          icon: icons.system[icon],
        }),
        Widget.ProgressBar({
          vpack: 'center',
          binds: [
            ['value', used, 'value', v => v / 100],
          ],
        }),
      ]
    }),
  });
};
