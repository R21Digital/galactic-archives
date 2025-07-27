const fs = require('fs');
jest.mock('axios');
const axios = require('axios');

const htmlSnippet = `
<li class="mw-changeslist-title"><a href="/wiki/Page1">Page 1</a></li>
<li class="mw-changeslist-title"><a href="/wiki/Page2">Page 2</a></li>
`;

const { fetchActivity, OUTPUT_PATH } = require('../scripts/fetchActivityLog.cjs');

beforeEach(() => {
  if (fs.existsSync(OUTPUT_PATH)) fs.unlinkSync(OUTPUT_PATH);
  axios.get.mockResolvedValue({ data: htmlSnippet });
});

test('fetchActivity writes expected JSON', async () => {
  await fetchActivity();
  const content = fs.readFileSync(OUTPUT_PATH, 'utf-8');
  const data = JSON.parse(content);
  expect(data).toEqual([
    {
      title: 'Page 1',
      link: 'https://swgr.org/wiki/Page1',
      timestamp: expect.any(String)
    },
    {
      title: 'Page 2',
      link: 'https://swgr.org/wiki/Page2',
      timestamp: expect.any(String)
    }
  ]);
});
