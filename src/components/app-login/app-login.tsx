import { Component, Prop } from '@stencil/core';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  tag: 'app-login',
})
export class AppLogin {
  @Prop({ context: 'firebaseApp' }) private app!: firebase.app.App;

  handleSignIn = () => {
    const provider = new firebase.auth.GithubAuthProvider();
    this.app.auth().signInWithPopup(provider);
  }

  render() {
    return (
      <div>
        <p>
          <button
            class='btn btn-large btn-outline-blue'
            type='button'
            onClick={this.handleSignIn}
          >
            Sign in with GitHub
          </button>
        </p>
      </div>
    );
  }
}
