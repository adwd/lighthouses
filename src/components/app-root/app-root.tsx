import { Component, State } from '@stencil/core';
import firebase from 'firebase/app';
import 'firebase/auth'
import { env } from'../../env';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {
  @State() loginStatus = false;
  app: firebase.app.App;

  componentDidLoad() {
    var config = {
      apiKey: env.FIREBASE_API_KEY,
      authDomain: "light-houses.firebaseapp.com",
      databaseURL: "https://light-houses.firebaseio.com",
      projectId: "light-houses",
      storageBucket: "",
      messagingSenderId: "354496450286"
    };
    this.app = firebase.initializeApp(config);

    // var provider = new firebase.auth.GithubAuthProvider();
    this.app.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.loginStatus = true;
      }
      console.log(user);
    });
  }

  handleSignIn = () => {
    const provider = new firebase.auth.GithubAuthProvider();
    console.log(this.app);
    this.app.auth().signInWithPopup(provider);
  }

  render() {
    return (
      <div>
        <div class="Subhead">
          <div class="Subhead-heading">Light houses</div>
        </div>

        <main>
          {this.loginStatus ? (
            <stencil-router>
              <stencil-route-switch scrollTopOffset={0}>
                <stencil-route url='/' component='app-home' exact={true} />
              </stencil-route-switch>
            </stencil-router>
        ) : (
          <div>
            <p>
              <button class="btn btn-large btn-outline-blue" type="button" onClick={this.handleSignIn}>Sign in with GitHub</button>
            </p>
          </div>
        )}
        </main>
      </div>
    );
  }
}
