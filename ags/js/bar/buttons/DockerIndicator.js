import PanelButton from '../PanelButton.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from "../../icons.js";
import FontIcon from "../../misc/FontIcon.js";
import { docker } from "../../variables.js";

export default () => {
  return PanelButton({
    connections: [[docker, self => {
      self.visible = docker.value != 0;
    }]],
    content: Widget.Box({
      hexpand: false,
      className: 'counter docker',
      binds: [['tooltipText', docker, 'value', v => `${v} running dockers`],],
      connections: [[docker, self => {
        self.toggleClassName('empty', docker.value == 0);
      }]],
      children: [
        FontIcon(icons.docker),
        Widget.Label({
          binds: [['label', docker, 'value'],],
        }),
      ]
    })

  });
};
