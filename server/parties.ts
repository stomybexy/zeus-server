import {Parties} from 'collections/parties';

import {smartPublish} from './smart_publish'

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
    Counts.publish(this, 'numberOfParties',
        Parties.find(buildQuery.call(this, null, location)), { noReady: true });
    return {
        selector: buildQuery.call(this, null, location),
        options: options,
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