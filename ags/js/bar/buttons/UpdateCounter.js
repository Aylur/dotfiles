import PanelButton from '../PanelButton.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { updates } from '../../variables.js';
import UpdateIcon from '../../misc/UpdateIcon.js';



export default () => {
  return PanelButton({
    content: Widget.Box({
      hexpand: false,
      className: 'updates counter',
      binds: [['tooltipText', updates, 'value', v => `${v} updates available`],],
      connections: [[updates, self => {
        self.toggleClassName('empty', updates.value == 0);
      }]],
      children: [
        UpdateIcon(),
        Widget.Label({
          binds: [['label', updates, 'value', value => String(value)],],
        }),
      ]
    })
  });
};
