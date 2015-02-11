define([
    'rivets',
    'backbone'
], function (rivets, B) {

    var Model = B.Model,
        Collection = B.Collection;

    function getterSetter(obj, keypath, value) {
        if (!(obj instanceof Model)) {
            if (arguments.length === 3) {
                obj[keypath] = value;
                return;
            }

            value = obj[keypath];
        } else {
            if (arguments.length === 3) {
                obj.set(keypath, value);
                return;
            }

            value = obj.get(keypath);
        }

        if (value instanceof Collection) {
            return value.models;
        }

        return value;
    }

    function onOffFactory(action) {
        return function (obj, keypath, callback) {
            var value;

            if (!(obj instanceof Model)) {
                value = obj[keypath];
            } else {
                value = obj.get(keypath);
                obj[action]('change:' + keypath, callback);
            }

            if (value instanceof Collection) {
                value[action]('add remove reset sort', callback);
            }
        };
    }

    rivets.adapters[':'] = {
        observe: onOffFactory('on'),
        unobserve: onOffFactory('off'),
        get: getterSetter,
        set: getterSetter
    };

    return rivets;

});