import { Component, Prop, State } from '@stencil/core';
import '@stencil/router';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  scoped: true,
})
export class AppRoot {
  @State() login: boolean | 'loading' = 'loading';
  @Prop({ context: 'firebaseApp' }) private app!: firebase.app.App;
  @Prop({ context: 'authState' }) private authState!: Observable<firebase.User>;

  private subscription = new Subscription();

  componentDidLoad = () => {
    const sub = this.authState.pipe(
      tap(user => {
        if (user) {
          const doc = this.app.firestore().collection('users').doc(user.uid);
          doc.set({
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
          });
        }
      }),
    ).subscribe(user => this.login = !!user);
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
        <div class='Subhead header'>
          <div class='Subhead-heading'>Light houses</div>
          <div class='Subhead-actions'>
          {this.login === true ? (
            <button
              class='btn btn-sm'
              type='button'
              onClick={this.handleSignOut}
            >
              Sign out
            </button>
          ) : null}
          </div>
        </div>

        <div class='col-10 p-2 mx-auto'>
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
      </div>
    );
  }
}
