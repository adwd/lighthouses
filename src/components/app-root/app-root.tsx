import { Component, Prop, State } from '@stencil/core';
import firebase from 'firebase/app';
import { Observable, Subscription } from 'rxjs';

@Component({
  tag: 'app-root',
})
export class AppRoot {
  @State() login: boolean | 'loading' = 'loading';
  @Prop({ context: 'firebaseApp' }) private app!: firebase.app.App;
  @Prop({ context: 'authState' }) private authState!: Observable<firebase.User>;

  private subscription = new Subscription();

  componentDidLoad() {
    const sub = this.authState.subscribe(user => this.login = !!user);
    this.subscription.add(sub);
  }

  componentDidUnload() {
    this.subscription.unsubscribe();
  }

  handleSignOut = () => {
    this.app.auth().signOut();
  }

  render() {
    return (
      <div>
        <div class='Subhead'>
          <div class='Subhead-heading'>Light houses</div>
        </div>
        {this.login === true ? (
          <button
            class='btn btn-large btn-outline-blue'
            type='button'
            onClick={this.handleSignOut}
          >
            Sign out
          </button>
        ) : null}

        <main>
          {this.login === 'loading' ? null : this.login ? (
            <stencil-router>
              <stencil-route-switch scrollTopOffset={0}>
                <stencil-route url='/' component='app-home' exact={true} />
              </stencil-route-switch>
            </stencil-router>
          ) : (
            <app-login></app-login>
          )}
        </main>
      </div>
    );
  }
}
