import { MprisPlayerProxy, DBusProxy } from './dbus.js'
import { PlayerIcons, PREFERRED_PLAYER, MEDIA_CACHE_PATH, MkDirectory } from "./main.js";
import { GObject, Gio, GLib } from './lib.js'

function _lengthStr(length) {
    let min = Math.floor(length / 60);
    let sec0 = Math.floor(length % 60) < 10 ? "0" : "";
    let sec = Math.floor(length % 60);
    return `${min}:${sec0}${sec}`;
}

function _getName(busName) {
    return busName
        .substring(23)
        .split('.')
        [0];
}

const MprisPlayer = GObject.registerClass({
    Signals: { 'changed' : {}, 'closed': {}, 'ready': {} }
},
class MprisPlayer extends GObject.Object {
    constructor(busName) {
        super();
        
        this._proxy = new MprisPlayerProxy(Gio.DBus.session, busName,
            '/org/mpris/MediaPlayer2',
            this._onPlayerProxyReady.bind(this));

        this._busName = busName;
        this._name = _getName(busName);
        this._playerIcon = PlayerIcons?.[this._name] || PlayerIcons.deafult || '';
        this._trackArtists = [];
        this._trackTitle = '';
        this._trackCoverUrl = '';
        this._coverPath = '';
        this._playBackStatus = '';
        this._canGoNext = false;
        this._canGoPrev = false; 
        this._canPlay = false;
        this._shuffle = false;
        this._loopStatus = '';
        this._volume = -1;
        this._length = -1;
        this._position = -1;
    }

    close() {
        this._proxy.disconnect(this._playerBinding1);
        this._proxy.disconnect(this._playerBinding2);
        this._proxy = null;

        this.emit('closed');
    }

    _onPlayerProxyReady() {
        this._playerBinding1 = this._proxy.connect('notify::g-name-owner', () => {
            if (!this._proxy.g_name_owner)
                this.close();
        })
        this._playerBinding2 = this._proxy.connect(
            'g-properties-changed', () => {
                this._updateState();
                this._cacheCoverArt();
                this.emit('changed');
            }
        );
        if (!this._proxy.g_name_owner)
            this.close();

        this._updateState();
        this._cacheCoverArt();
        this.emit('ready');
    }

    _updateState() {
        let metadata = {};
        for (let prop in this._proxy.Metadata)
            metadata[prop] = this._proxy.Metadata[prop].deep_unpack();

        this._trackArtists = metadata['xesam:artist'];
        if (!Array.isArray(this._trackArtists) ||
            !this._trackArtists.every(artist => typeof artist === 'string'))
            this._trackArtists =  ["Unknown artist"];
        
        this._trackTitle = metadata['xesam:title'];
        if (typeof this._trackTitle !== 'string')
            this._trackTitle = "Unknown title";
        
        this._trackCoverUrl = metadata['mpris:artUrl'];
        if (typeof this._trackCoverUrl !== 'string')
            this._trackCoverUrl = '';
        
        this._length = metadata['mpris:length'];
        if (typeof this._length !== 'number')
            this._length = -1;
        else
            this._length = Number.parseInt(`${this._length}`.substring(0, 3));

        this._position = this._proxy.Position;
        if (typeof this._position !== 'number')
            this._position = -1;
        else
            this._position = this._position/1000000;
        
        this._playBackStatus = this._proxy.PlaybackStatus;
        this._canGoNext = this._proxy.CanGoNext;
        this._canGoPrev = this._proxy.CanGoPrevious;
        this._canPlay = this._proxy.CanPlay;

        this._shuffle = this._proxy.Shuffle;
        if (typeof this._shuffle !== 'boolean') {
            this._shuffle = null;
        }
        this._loopStatus = this._proxy.LoopStatus;
        if (typeof this._loopStatus !== 'string') {
            this._loopStatus = null;
        }
        this._volume = this._proxy.Volume;
        if(typeof this._volume !== 'number'){
            this._volume = -1;
        }
    }

    _cacheCoverArt(){
        this._coverPath = MEDIA_CACHE_PATH + `${this._trackArtists.join(', ')}_${this._trackTitle}`
            .replace(/[\,\*\?\"\<\>\|\#\:\?\/\']/g, '');

        if(this._trackCoverUrl === '')  return;
        if(this._coverPath === '_') return;
        if(GLib.file_test(this._coverPath, GLib.FileTest.EXISTS)) return;
        
        MkDirectory();

        // Gio.File.new_for_uri(this._trackCoverUrl).copy_async(
        //     Gio.File.new_for_path(this._coverPath),
        //     Gio.FileCopyFlags.OVERWRITE,
        //     GLib.PRIORITY_DEFAULT,
        //     null,
        //     null,
        //     (source, result) => {
        //         try { source.copy_finish(result) }
        //         catch (e) { log(`failed to cache ${this._coverPath}`, e) }
        //     }
        // );

        try {
            Gio.File.new_for_uri(this._trackCoverUrl).copy(
                Gio.File.new_for_path(this._coverPath),
                Gio.FileCopyFlags.OVERWRITE,
                null, null
            );
        } catch(e) {
            log(`failed to cache ${this._coverPath}`, e);
        };
    }

    get json() {
        return {
            busName:   this._busName, //busName
            name:      _getName(this._busName),
            icon:      this._playerIcon,
            artist:    this._trackArtists.join(', '),
            title:     this._trackTitle,
            cover:     this._coverPath,
            status:    this._playBackStatus,
            canNext:   this._canGoNext,
            canPrev:   this._canGoPrev,
            canPlay:   this._canPlay,
            shuffle:   this._shuffle,
            loop:      this._loopStatus,
            volume:    this._volume*100,
            length:    this._length,
            lengthStr: _lengthStr(this._length),
            position: this._position,
        };
    }
});

export const Media = GObject.registerClass({
    Signals: { 'sync': {}, 'positions': {} }
},
class Media extends GObject.Object{
    _init() {
        super._init();

        this._json = {};
        this._positions = {};
        this._players = new Map();
        this._proxy = new DBusProxy(Gio.DBus.session,
                                    'org.freedesktop.DBus',
                                    '/org/freedesktop/DBus',
                                    this._onProxyReady.bind(this));
    }

    get json() { return this._json }
    get positions() { return this._positions }

    _addPlayer(busName) {
        if (this._players.get(busName))
            return;

        let player = new MprisPlayer(busName);
        player.connect('closed', () => {
            this._players.delete(busName);
            this._sync();
        });
        player.connect('changed', this._sync.bind(this));
        player.connect('ready', this._sync.bind(this));
        this._players.set(busName, player);
    }

    _onProxyReady() {
        this._proxy.ListNamesRemote(([names]) => {
            names.forEach(name => {
                if (name.startsWith('org.mpris.MediaPlayer2.'))
                    this._addPlayer(name);
            });
        });
        this._proxy.connectSignal(
            'NameOwnerChanged',
            this._onNameOwnerChanged.bind(this)
        );
        this._sync();
    }

    _onNameOwnerChanged(proxy, sender, [name, oldOwner, newOwner]) {
        if (!name.startsWith('org.mpris.MediaPlayer2.'))
            return;

        if (newOwner && !oldOwner)
            this._addPlayer(name);
    }

    _sync(){
        let preferred = null; 
        let players = [];
        for (const [_, player] of this._players) {
            if(player.json.busName.includes(PREFERRED_PLAYER))
                preferred = player.json
            
            players.push(player.json);
        }

        if(this._players.size === 1)
            preferred = players[0];

        this._json = {
            preferred,
            players
        }
        this.emit('sync');
    }

    getPositions(){
        if(this._players.size === 0) return;
        let playersReady = 0;
        let positions = {};
        for (const [busName, _] of this._players) {
            new MprisPlayer(busName).connect('ready', mpris => {
                positions[mpris.json.name] = {
                    length: mpris.json.length,
                    lengthStr: _lengthStr(mpris.json.length),
                    position: mpris.json.position,
                    positionStr: _lengthStr(mpris.json.position)
                };
                playersReady++

                if(playersReady === this._players.size) {
                    this._positions = positions;
                    this.emit('positions');
                }

                mpris.close();
            })
        }
        return true;
    }
})
