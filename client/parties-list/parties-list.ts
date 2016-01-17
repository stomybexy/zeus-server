import {Component, View} from 'angular2/core';

import {bootstrap, MeteorComponent } from 'angular2-meteor';

import {Parties} from 'collections/parties';

import {PartiesForm} from 'client/parties-form/parties-form';

import {RouterLink} from 'angular2/router';

import {AccountsUI} from 'meteor-accounts-ui';

import {PubReg} from 'client/collections/pub-reg'

import {PaginationService, PaginatePipe, PaginationControlsCpm} from 'ng2-pagination';

import {SmartMeteorComponent} from 'client/lib/smart-meteor-component';

@Component({
    selector: 'parties-list',
    viewProviders: [PaginationService]
})
@View({
    templateUrl: '/client/parties-list/parties-list.html',
    directives: [PartiesForm, RouterLink, AccountsUI, PaginationControlsCpm],
    pipes: [PaginatePipe]
})
export class PartiesList extends SmartMeteorComponent {
    parties: Mongo.Cursor<Party>;
    parties3: Mongo.Cursor<Party>;

    pageSize: number = 10;
    curPage: ReactiveVar<number> = new ReactiveVar<number>(1);
    sort: ReactiveVar<Object> = new ReactiveVar<Object>({
        name: 1
    });
    partiesSize: number = 0;
    location: ReactiveVar<string> = new ReactiveVar<string>(null);

    constructor() {
        super();
        // this.autorun(() => {
        //     let options = {
        //         limit: this.pageSize,
        //         skip: (this.curPage.get() - 1) * this.pageSize,
        //         sort: this.sort.get()
        //     }


        this.autorun(() => this.smartPageSubscribe('parties', {}, this.location.get()));
        this.smartSubscribe({ name: 'parties2', varName: 'parties3' });
            
        // this.smartSubscribe('parties', options2, this.location.get());
            
        // this.subscribe('parties', options, this.location.get(), () => {
        //     this.parties = Parties.find({}, { sort: { name: this.nameOrder.get() } });

        // }, true);
        // });

        this.autorun(() => {
            this.partiesSize = Counts.get('numberOfParties');
        }, true);
    }

    removeParty(party) {
        Parties.remove(party._id);
    }


    onPageChanged(page: number) {
        this.curPage.set(page);
    }

    changeSortOrder(nameOrder) {
        this.sort.set({ name: parseInt(nameOrder) });
    }

    search(value) {
        this.curPage.set(1);
        this.location.set(value);
    }
}