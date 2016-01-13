import {Component, View} from 'angular2/core';

import {RouteParams} from 'angular2/router';

import {Parties} from 'collections/parties';

import {RouterLink} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

import {RequireUser} from 'meteor-accounts';

import {PubReg} from 'client/collections/pub-reg'

import {SmartMeteorComponent} from 'client/lib/smart-meteor-component';


@Component({
    selector: 'party-details'
})
@View({
    templateUrl: '/client/party-details/party-details.html',
    directives: [RouterLink]
})
@RequireUser()
export class PartyDetails extends SmartMeteorComponent {
    party: Party;
    constructor(params: RouteParams) {
        super();
        var partyId = params.get('partyId');
        this.smartSubscribe('party', partyId);
        // this.subscribe('party', partyId, () => {
        //     this.party = Parties.findOne(partyId);
        //     console.log(PubReg.find().fetch());
        // }, true);

    }
    saveParty(party) {
        Parties.update(party._id, {
            $set: {
                name: party.name,
                description: party.description,
                location: party.location
            }
        });
    }
}