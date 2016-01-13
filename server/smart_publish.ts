
export function smartPublish(name: string, pubFunc: Function) {
    Meteor.publish(name, function() {
        var self = this;
        var args = Array.prototype.slice.apply(arguments);
        var opt = pubFunc.apply(this, args);


        var cursor = opt.coll.find(opt.selector, opt.options)
        // console.log(opt.coll.find(opt.selector, opt.options).fetch());
        delete opt.coll;
        // console.log(opt.options);
        
        var pubId = EJSON.stringify({pub:name, args: args});
        this.added('pubReg', pubId, { args: { selector: opt.selector, options: opt.options , single: opt.single}, collName: cursor._getCollectionName() });

        var handle = cursor.observeChanges({
            added: function(id, fields) {
                self.added(cursor._getCollectionName(), id, fields);
            },
            changed: function(id, fields) {
                self.changed(cursor._getCollectionName(), id, fields);
            },
            removed: function(id) {
                self.removed(cursor._getCollectionName(), id);
            }
        });

        this.ready();

        this.onStop(() => {
            self.removed('pubReg', pubId);
            handle.stop();
        })

    });
};