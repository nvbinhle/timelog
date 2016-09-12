import { TimeSheetProjectPage } from './app.po';

describe('time-sheet-project App', function() {
  let page: TimeSheetProjectPage;

  beforeEach(() => {
    page = new TimeSheetProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('TimeSheets works!');
  });
});
