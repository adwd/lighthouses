import { Component, Prop, State } from '@stencil/core';
import 'firebase/auth';
import 'firebase/firestore';
import { appCollection, addApp, deleteApp } from '../../fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  tag: 'app-apps',
})
export class AppApps {
  @State() newAppURL = '';
  @State() apps: { id: string, url: string }[] = [];
  @Prop({ context: 'firebaseApp' }) private app!: firebase.app.App;

  sub = new Subscription();
  
  componentWillLoad() {
    const user = this.app.auth().currentUser!;
    const s = appCollection(this.app.firestore(), user.uid)
      .subscribe(snapshots => {
        this.apps = snapshots.map(doc => ({ id: doc.id, url: doc.data().url }));
      });
    this.sub.add(s);
  }

  componentDidUnload() {
    this.sub.unsubscribe();
  }

  handleChange = (event: any) => {
    this.newAppURL = event.target.value;
  }

  handleSubmit = async (ev: Event) => {
    ev.preventDefault();
    const user = this.app.auth().currentUser!;
    await addApp(this.app.firestore(), user.uid, this.newAppURL);
  }

  handleRemove = (appId: string) => {
    const user = this.app.auth().currentUser!;
    deleteApp(this.app.firestore(), user.uid, appId);
  }

  render() {
    return (
      <div>
        <nav class='UnderlineNav' aria-label='Foo bar'>
          <div class='UnderlineNav-body'>
            <a href='#url' class='UnderlineNav-item selected'>Apps</a>
            {/* <a href="#url" class="UnderlineNav-item">Item 2</a>
            <a href="#url" class="UnderlineNav-item">Item 3</a>
            <a href="#url" class="UnderlineNav-item">Item 4</a> */}
          </div>
        </nav>
        <div class='Box'>
          <div class='Box-body'>
            <form onSubmit={this.handleSubmit}>
              <div class='input-group'>
                <input class='form-control' id='new-app-url' type='url' required aria-label='new app URL'
                  placeholder='https://example.com/your-app' value={this.newAppURL} onInput={this.handleChange}>
                </input>
                <span class='input-group-button'>
                  <button class='btn btn-primary' type='submit'>Add app</button>
                </span>
              </div>
            </form>
          </div>
          {this.apps.map(app => (
            <div class='Box-row Box-row--hover-blue d-flex flex-items-center'>
              <h3 class='Box-title overflow-hidden flex-auto'>
                <stencil-route-link url={`/apps/${app.id}`}>{app.url}</stencil-route-link>
              </h3>
              <button class='btn btn-sm' onClick={() => this.handleRemove(app.id)}>
                Remove
              </button>
            </div>
          ))}
          <div class='Box-footer'>
            {this.apps.length} apps
          </div>
        </div>
      </div>
    );
  }
}
