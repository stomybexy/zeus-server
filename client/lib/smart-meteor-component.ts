import {MeteorComponent} from 'angular2-meteor';
import {PubReg} from 'client/collections/pub-reg';



export class SmartMeteorComponent extends MeteorComponent {



    constructor() {
        super();
    }

    smartSubscribe(name: string, ...rest): Meteor.SubscriptionHandle {
       
            return super.subscribe.call(this, name,...rest, () => {
                var pubId = EJSON.stringify({pub: name, args: rest});
                console.log(PubReg.find({}).fetch());
                var opt = PubReg.findOne(pubId);
                if (!opt || !opt.args) {
                    return;
                }
                console.log(opt);
                if (opt.args.single) {
                    this[name] = Meteor.connection._mongo_livedata_collections[opt.collName].findOne(opt.args.selector || {}, opt.args.options || {});
                    // console.log(this[name]);
                } else {
                    this[name] = Meteor.connection._mongo_livedata_collections[opt.collName].find(opt.args.selector || {}, opt.args.options || {});

                }
            }, true);


    }

}