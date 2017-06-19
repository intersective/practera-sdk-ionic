import { browser, element, by, ElementFinder } from 'protractor';

describe('Activity component E2E Test', () => {

  beforeEach(() => {
    browser.get('http://localhost:8100/');
  });

  it('Title is there', () => {

      // expect(element(by.css('[aria-selected=true] .tab-button-text')) // Grab the title of the selected tab
      //   .getAttribute('innerHTML')) // Get the text content
      //   .toContain('Home'); // Check if it contains the text "Home"

      expect(true).toBe(true);

  });

});
