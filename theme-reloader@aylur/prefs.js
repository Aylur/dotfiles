const { Adw, Gtk, GObject, Gdk, GdkPixbuf } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// https://gitlab.com/arcmenu/ArcMenu
const HotkeyDialog = GObject.registerClass({
    Signals: {
        'response': { param_types: [GObject.TYPE_INT] },
    },
},
class HotkeyDialog extends Gtk.Window {
    _init(window) {
        this.keyEventController = new Gtk.EventControllerKey();

        super._init({
            modal: true,
            title: 'Set Custom Hotkey',
            transient_for: window
        });
        let vbox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 20,
            homogeneous: false,
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
            hexpand: true,
            halign: Gtk.Align.FILL
        });
        this.set_child(vbox);
        this._createLayout(vbox);
        this.add_controller(this.keyEventController);
        this.set_size_request(500, 250);
    }

    _createLayout(vbox) {
        let hotkeyKey = '';

        let modFrame = new Adw.PreferencesGroup()
        let modRow = new Adw.ActionRow({
            title: 'Choose Modifiers'
        });

        let buttonBox = new Gtk.Box({
            hexpand: true,
            halign: Gtk.Align.END,
            spacing: 5
        });
        modRow.add_suffix(buttonBox);
        let ctrlButton = new Gtk.ToggleButton({
            label: 'Ctrl',
            valign: Gtk.Align.CENTER
        });
        let superButton = new Gtk.ToggleButton({
            label: 'Super',
            valign: Gtk.Align.CENTER
        });
        let shiftButton = new Gtk.ToggleButton({
            label: 'Shift',
            valign: Gtk.Align.CENTER
        });
        let altButton = new Gtk.ToggleButton({
            label: 'Alt',
            valign: Gtk.Align.CENTER
        });
        ctrlButton.connect('toggled', () => {
            this.resultsText="";
            if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";
            if(superButton.get_active()) this.resultsText += "<Super>";
            if(shiftButton.get_active()) this.resultsText += "<Shift>";
            if(altButton.get_active()) this.resultsText += "<Alt>";
            this.resultsText += hotkeyKey;
            resultsWidget.accelerator =  this.resultsText;
            applyButton.set_sensitive(true);
        });
        superButton.connect('toggled', () => {
            this.resultsText="";
            if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";
            if(superButton.get_active()) this.resultsText += "<Super>";
            if(shiftButton.get_active()) this.resultsText += "<Shift>";
            if(altButton.get_active()) this.resultsText += "<Alt>";
            this.resultsText += hotkeyKey;
            resultsWidget.accelerator =  this.resultsText;
            applyButton.set_sensitive(true);
        });
        shiftButton.connect('toggled', () => {
            this.resultsText="";
            if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";
            if(superButton.get_active()) this.resultsText += "<Super>";
            if(shiftButton.get_active()) this.resultsText += "<Shift>";
            if(altButton.get_active()) this.resultsText += "<Alt>";
            this.resultsText += hotkeyKey;
            resultsWidget.accelerator =  this.resultsText;
            applyButton.set_sensitive(true);
        });
        altButton.connect('toggled', () => {
            this.resultsText="";
            if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";
            if(superButton.get_active()) this.resultsText += "<Super>";
            if(shiftButton.get_active()) this.resultsText += "<Shift>";
            if(altButton.get_active()) this.resultsText += "<Alt>";
            this.resultsText += hotkeyKey;
            resultsWidget.accelerator =  this.resultsText;
            applyButton.set_sensitive(true);
        });
        buttonBox.append(ctrlButton);
        buttonBox.append(superButton);
        buttonBox.append(shiftButton);
        buttonBox.append(altButton);
        modFrame.add(modRow);
        vbox.append(modFrame);

        let keyFrame = new Adw.PreferencesGroup();
        let keyLabel = new Gtk.Label({
            label: 'Press any key',
            use_markup: true,
            xalign: .5,
            hexpand: true,
            halign: Gtk.Align.CENTER
        });
        vbox.append(keyLabel);

        let pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_size(Me.path + '/media/keyboard-symbolic.svg', 256, 72);
        let keyboardImage = Gtk.Picture.new_for_pixbuf(pixbuf);
        keyboardImage.hexpand = true;
        keyboardImage.vexpand = true;
        keyboardImage.halign = Gtk.Align.CENTER;
        keyboardImage.valign = Gtk.Align.CENTER;
        vbox.append(keyboardImage);

        let resultsRow = new Adw.ActionRow({
            title: 'New Hotkey'
        });
        let resultsWidget = new Gtk.ShortcutsShortcut({
            hexpand: true,
            halign: Gtk.Align.END
        });
        resultsRow.add_suffix(resultsWidget);
        keyFrame.add(resultsRow);

        let applyButton = new Gtk.Button({
            label: 'Apply',
            halign: Gtk.Align.END,
            css_classes: ['suggested-action']
        });
        applyButton.connect('clicked', () => {
            this.emit("response", Gtk.ResponseType.APPLY);
        });
        applyButton.set_sensitive(false);

        this.keyEventController.connect('key-released', (controller, keyval, keycode, state) =>  {
            this.resultsText = "";
            let key = keyval;
            hotkeyKey = Gtk.accelerator_name(key, 0);
            if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";
            if(superButton.get_active()) this.resultsText += "<Super>";
            if(shiftButton.get_active()) this.resultsText += "<Shift>";
            if(altButton.get_active()) this.resultsText += "<Alt>";
            this.resultsText += Gtk.accelerator_name(key,0);
            resultsWidget.accelerator =  this.resultsText;
            applyButton.set_sensitive(true);
        });

        vbox.append(keyFrame);
        vbox.append(applyButton);
    }
});

function init(){}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();

    let page = new Adw.PreferencesPage();
    let group = new Adw.PreferencesGroup({ title: 'Shortcut' });
    let row = new Adw.ActionRow({ title: 'Shortcut Hotkey' });
    let indicator = new Gtk.ShortcutsShortcut({ valign: Gtk.Align.CENTER });
    indicator.accelerator = settings.get_strv('shortcut').toString();
    let btn = new Gtk.Button({
        label: 'Set Hotkey',
        valign: Gtk.Align.CENTER,
    });
    btn.connect('clicked', () => {
        let dialog = new HotkeyDialog(window);
        dialog.show();
        dialog.connect('response', (_w, response) => {
            if(response === Gtk.ResponseType.APPLY) {
                settings.set_strv('shortcut', [dialog.resultsText]);
                indicator.accelerator = dialog.resultsText;
            }
            dialog.destroy();
        });
    });
    row.add_suffix(indicator);
    row.add_suffix(btn);
    group.add(row);
    page.add(group);
    window.add(page);
}