export class TimeSheetProjectPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('TimeSheets-root h1')).getText();
  }
}
