import {loadParties} from './load_parties';
import 'pubs/parties';
 
Meteor.startup(loadParties);