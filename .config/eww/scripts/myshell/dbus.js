import { Gio } from './lib.js'

export const MprisPlayerProxy = Gio.DBusProxy.makeProxyWrapper(
`<node>
    <interface name="org.mpris.MediaPlayer2.Player">
        <property name='CanControl' type='b' access='read' />
        <property name='CanGoNext' type='b' access='read' />
        <property name='CanGoPrevious' type='b' access='read' />
        <property name='CanPlay' type='b' access='read' />
        <property name='CanPause' type='b' access='read' />
        <property name='Metadata' type='a{sv}' access='read' />
        <property name='PlaybackStatus' type='s' access='read' />
        <property name='Shuffle' type='b' access='readwrite' />
        <property name='LoopStatus' type='s' access='readwrite' />
        <property name='Volume' type='d' access='readwrite' />
        <property name="Position" type="x" access="read"/>
    </interface>
</node>`
);

export const DBusProxy = Gio.DBusProxy.makeProxyWrapper(
`<node>
    <interface name="org.freedesktop.DBus">
        <method name="ListNames">
            <arg type="as" direction="out" name="names"/>
        </method>
        <signal name="NameOwnerChanged">
            <arg type="s" direction="out" name="name"/>
            <arg type="s" direction="out" name="oldOwner"/>
            <arg type="s" direction="out" name="newOwner"/>
        </signal>
    </interface>
</node>`
);

export const PowerManagerProxy = Gio.DBusProxy.makeProxyWrapper(
`<node>
    <interface name="org.freedesktop.UPower.Device">
        <property name="State" type="u" access="read"/>
        <property name="Percentage" type="d" access="read"/>
        <property name="IsPresent" type="b" access="read"/>
    </interface>
</node>`
);

export const NotificationIFace = 
`<node>
    <interface name="org.freedesktop.Notifications">
        <property name="DoNotDisturb" type="b" access="read" />
        <method name="ToggleDND" />
        <method name="Clear" />
        <method name="DismissNotification">
            <arg type="u" direction="in" name="id"/>
        </method>
        <method name="Notify">
            <arg type="s" direction="in"/>
            <arg type="u" direction="in"/>
            <arg type="s" direction="in"/>
            <arg type="s" direction="in"/>
            <arg type="s" direction="in"/>
            <arg type="as" direction="in"/>
            <arg type="a{sv}" direction="in"/>
            <arg type="i" direction="in"/>
            <arg type="u" direction="out"/>
        </method>
        <method name="CloseNotification">
            <arg type="u" direction="in" name="id"/>
        </method>
        <method name="GetCapabilities">
            <arg type="as" direction="out"/>
        </method>
        <method name="GetServerInformation">
            <arg type="s" direction="out"/>
            <arg type="s" direction="out"/>
            <arg type="s" direction="out"/>
            <arg type="s" direction="out"/>
        </method>
        <method name="InvokeAction">
            <arg type="u" direction="in" name="id" />
            <arg type="s" direction="in" name="reason" />
        </method>
        <signal name="NotificationClosed">
            <arg type="u"/>
            <arg type="u"/>
        </signal>
        <signal name="ActionInvoked">
            <arg type="u"/>
            <arg type="s"/>
        </signal>
    </interface>
</node>`;

export const BluetoothIFace = 
`<node>
    <interface name="com.github.aylur.bluetooth">
        <method name="Toggle" />
    </interface>
</node>`

export const ApplicationsIFace = 
`<node>
    <interface name="com.github.aylur.applications">
        <method name="Query">
            <arg type="s" direction="in" />
        </method>
    </interface>
</node>`
