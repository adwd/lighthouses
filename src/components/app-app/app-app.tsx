import { Component, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import firebase from 'firebase/app';
import { lhrCollection } from '../../fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  tag: 'app-app',
})
export class AppApp {
  @Prop({ context: 'firebaseApp' }) private app!: firebase.app.App;
  @Prop() match!: MatchResults;
  @State() lhrs: string[] = [];

  sub = new Subscription();

  componentWillLoad() {
    const user = this.app.auth().currentUser!;
    const s = lhrCollection(this.app.firestore(), user.uid, this.match.params.id)
      .subscribe(snapshot => {
        this.lhrs = snapshot.map(doc => doc.data().path);
      });
    this.sub.add(s);
  }

  componentDidUnload() {
    this.sub.unsubscribe();
  }

  render() {
    return (
      <div>
        <div class='Box Box--condensed'>
          <div class='Box-header'>
            <h3 class='Box-title'>
              Lighthouse Reports
            </h3>
          </div>
          {/* <div class="Box-body">
            Box body
          </div> */}
          <ul>
            {this.lhrs.map(lhr => (
              <li class='Box-row'>{lhr}</li>
            ))}
          </ul>
          <div class='Box-footer'>
            {this.lhrs.length} reports
          </div>
        </div>
      </div>
    );
  }
}
