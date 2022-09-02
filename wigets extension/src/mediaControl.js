'use strict';

const { GObject, St, Clutter } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { Media, Player } = Me.imports.mediaPlayer;

const MediaControl = GObject.registerClass(
class MediaControl extends PanelMenu.Button{
    _init(){
        super._init(0.5, 'Media Control', false);

        this.media = new Media();
        this.media.connect('updated',
            () => this.sync() );

        this.panelLabel = new St.Label({
            text: 'artist - title',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.add_child(this.panelLabel);

        this.playerBin = new St.Bin();
        this.menu.box.add_child(this.playerBin);

        this.sync();
    }
    sync(){
        let player = this.media.getFavPlayer();
        if(player){
            this.panelLabel.text = player._trackArtists.join(', ')+' - '+player._trackTitle;
            this.player = new Player(player._busName);
            this.player.style_class = 'mc-menu';
            this.playerBin.set_child(this.player);
            this.show();
        }else{
            this.player = null;
            this.hide();
        }
    }
});

class Extension{
    constructor(){}
    enable(){
        this.mediaControl = new MediaControl();
        Main.panel.addToStatusArea('Media Controller', this.mediaControl, 0, 'center');
    }
    disable(){
        Main.panel._centerBox.remove_child(this.mediaControl);
        this.mediaControl.destroy();
        this.mediaControl = null;
    }
}

let extension;

var enable = () => {
    extension = new Extension();
    extension.enable();
}
var disable = () => {
    extension.disable();
    extension = null;
}