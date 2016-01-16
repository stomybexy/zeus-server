import {MeteorComponent} from 'angular2-meteor';
import {PubReg} from 'client/collections/pub-reg';



export class SmartMeteorComponent extends MeteorComponent {



    constructor() {
        super();
    }

    smartSubscribe(name: string, ...rest): Meteor.SubscriptionHandle {

        return super.subscribe.call(this, name, ...rest, () => {
            var self = this

            super.call.call(self, name, ...rest, (err, opt) => {

                if (!opt || !opt.collName) {
                    return;
                }
                if (opt.single) {
                    this._zone.run(() => {
                        this[name] = Mongo.Collection.get(opt.collName).findOne(opt.selector || {}, {
                            sort: opt.sort,
                            // skip: opt.skip,
                            // limit: opt.limit,
                            fields: opt.fields,
                            transform: opt.transform
                        });
                    })

                    // console.log(this[name]);
                } else {
                    this._zone.run(() => {
                        this[name] = Mongo.Collection.get(opt.collName).find(opt.selector || {}, {
                            sort: opt.sort,
                            // skip: opt.skip,
                            // limit: opt.limit,
                            fields: opt.fields,
                            transform: opt.transform
                        });
                    })

                    // console.log(this[name]);

                }
            });

        }, true);


    }
    smartPageSubscribe(name: string, pageOptions, ...rest) {
        this.autorun(() => {
            var pageOptions = pageOptions || {}
            let options = {
                limit: this[pageOptions.pageSizeProp || 'pageSize'],
                skip: (this[pageOptions.curPageProp || 'curPage'].get() - 1) * this[pageOptions.pageSizeProp || 'pageSize'],
                sort: this[pageOptions.sortProp || 'sort'].get()
            };

            this.smartSubscribe(name, options, ...rest);

        });
    }

}