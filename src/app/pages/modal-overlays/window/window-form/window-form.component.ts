import { Component } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';

@Component({
  template: `
    <form class="form" data-testid="window-form-modal">
      <label for="subject">Subject:</label>
      <input nbInput id="subject" type="text" data-testid="window-form-subject-input">

      <label class="text-label" for="text">Text:</label>
      <textarea nbInput id="text" data-testid="window-form-text-input"></textarea>
    </form>
  `,
  styleUrls: ['window-form.component.scss'],
})
export class WindowFormComponent {
  constructor(public windowRef: NbWindowRef) {}

  close() {
    this.windowRef.close();
  }
}
