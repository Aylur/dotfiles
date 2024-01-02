import PanelButton from '../PanelButton.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import MailIcon from '../../misc/MailIcon.js';
import { mailcounter } from '../../variables.js';


export default () => {
  return PanelButton({
    content: Widget.Box({
      hexpand: false,
      className: 'counter mail',
      binds: [['tooltipText', mailcounter, 'value', v => `${v} unread emails`],],
      connections: [[mailcounter, self => {
        self.toggleClassName('empty', mailcounter.value == 0);
      }]],
      children: [
        MailIcon(),
        Widget.Label({
          binds: [['label', mailcounter, 'value'],],
        }),
      ]
    })

  });
};
