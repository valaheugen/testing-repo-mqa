import { Locator, Page } from 'playwright';
import { BaseFormComponent } from './BaseFormComponent';

export class NoLabelsFormComponent extends BaseFormComponent {
  readonly recipientsInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;

  constructor(page: Page) {
    super(page, 'no-labels-form-card');
    this.recipientsInput = this.card.getByTestId('recipients-input');
    this.subjectInput = this.card.getByTestId('subject-input');
    this.messageTextarea = this.card.getByTestId('message-textarea');
  }

  async fillRecipients(value: string) {
    await this.recipientsInput.fill(value);
  }

  async fillSubject(value: string) {
    await this.subjectInput.fill(value);
  }

  async fillMessage(value: string) {
    await this.messageTextarea.fill(value);
  }
}
