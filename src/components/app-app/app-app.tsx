import { Component, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import firebase from 'firebase/app';

@Component({
  tag: 'app-app',
})
export class AppApp {
  @Prop({ context: 'firebaseApp' }) private app!: firebase.app.App;
  @Prop() match!: MatchResults;
  @State() lhrs: string[] = [];

  componentWillLoad() {
    const user = this.app.auth().currentUser!;
    this.app.firestore().collection('users').doc(user.uid)
      .collection('apps').doc(this.match.params.id)
      .collection('lhrs').onSnapshot(snapshot => {
        this.lhrs = snapshot.docs.map(doc => doc.data().path);
      });
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
