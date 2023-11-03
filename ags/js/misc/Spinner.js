import Gtk from 'gi://Gtk';
import { Widget } from '../imports.js';

export default props => Widget.Spinner({
    ...props,
    active: true,
});
