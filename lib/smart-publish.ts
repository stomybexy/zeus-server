export function smartPublish(name: string, pubFunc: Function) {
    if (Meteor.isServer) {
        Meteor.publish(name, function() {
            var self = this;
            var args = Array.prototype.slice.apply(arguments);

            var opt = pubFunc.apply(this, args);

            var cursor =opt.coll.find(opt.selector || {}, {
                sort: opt.sort,
                skip: opt.skip,
                limit: opt.limit,
                fields: opt.fields,
                transform: opt.transform
            });

            return cursor;

        });
    }
    var meth = {};
    meth[name] = function() {
        var args = Array.prototype.slice.apply(arguments);
        var opt = pubFunc.apply(this, args);
        // delete opt.skip;
        // delete opt.limit;
        opt.collName = opt.coll._name;
        delete opt.coll;

        return opt;
    }
    Meteor.methods(meth);

};