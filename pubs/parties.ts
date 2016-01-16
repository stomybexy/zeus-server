import {smartPublish} from 'lib/smart-publish';
import {Parties} from 'collections/parties';

function buildQuery(partyId?: string, location?: string): Object {
    var isAvailable = {
        $or: [
            { public: true },
            {
                $and: [
                    { owner: this.userId },
                    { owner: { $exists: true } }
                ]
            }
        ]
    };

    let searchRegEx = { '$regex': '.*' + (location || '') + '.*', '$options': 'i' };

    if (partyId) {
        return { $and: [{ _id: partyId }, isAvailable] };
    }

    return { $and: [{ location: searchRegEx }, isAvailable] };
}

smartPublish('parties', function(options, location) {
    if (Meteor.isServer && this.added) {
        Counts.publish(this, 'numberOfParties',
            Parties.find(buildQuery.call(this, null, location)), { noReady: true });
    }
    return {
        selector: buildQuery.call(this, null, location),
        sort: options.sort,
        skip: options.skip,
        limit: options.limit,
        fields: options.fields,
        transform: options.transform,
        coll: Parties,
        single: false
    };
});

smartPublish('party', function(partyId) {
    return {
        selector: buildQuery.call(this, partyId),
        coll: Parties,
        single: true
    };

});
