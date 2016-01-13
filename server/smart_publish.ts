
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
        this.added('pubReg', pubId, { args: { selector: opt.selector, options:{
            sort: opt.options.sort
        } , single: opt.single}, collName: cursor._getCollectionName() });

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

export function smartPublish2(name: string, pubFunc: Function){
     Meteor.publish(name, function(){
        var self = this;
        var args = Array.prototype.slice.apply(arguments);
        var pubId = EJSON.stringify({pub:name, args: args});
        var cursor = pubFunc.apply(this, args);
        var h = cursor.observeChanges({
            added: function(id, fields){
                self.added('pubReg', pubId + id, {pubId: pubId, docId: id, collName: cursor._getCollectionName()});
                self.added(cursor._getCollectionName(), id, fields);
            },
            changed: function(id, fields){
                self.changed(cursor._getCollectionName(), id, fields);
            },
            removed: function(id){
                self.removed('pubReg', pubId +id);
                self.removed(cursor._getCollectionName(),id);
                
            }
        });
        
        self.ready();
        self.onStop(function(){
            h.stop();
            
        });

       });
};