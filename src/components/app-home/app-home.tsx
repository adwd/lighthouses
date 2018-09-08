import { Component } from '@stencil/core';

@Component({
  tag: 'app-home',
  scoped: true,
})
export class AppHome {
  render() {
    return (
      <div class='header'>
        <app-apps></app-apps>
      </div>
    );
  }
}
