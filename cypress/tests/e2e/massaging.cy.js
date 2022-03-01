describe('Messaging', () => {
  it('Survey', () => {
    cy.viewport(1440, 1024);
    // Cypress intercept url '/capture' and return a mock response
    cy.intercept(
      'https://dev-k8s.treetracker.org/messaging/message?author_handle=admin',
      {
        messages: [
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'admin', type: 'user' },
            id: '1b8b227b-9f20-488d-9593-8436c57c631c',
            parent_message_id: '9b5779c8-04e2-43d3-856e-4b5b69da51a2',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: [
                {
                  prompt: 'What time do you plant?',
                  choices: ['Morning', 'Afternoon', 'Night'],
                },
                {
                  prompt: 'What time do you Water?',
                  choices: ['one', 'two', 'three'],
                },
                {
                  prompt: 'How many trees have you planted?',
                  choices: ['1-3', '4-6', '6-9'],
                },
              ],
              response: null,
              answers: null,
            },
            title: null,
            to: [{ recipient: 'handle1', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '969a6321-f9e6-482e-9e2f-440fddbdf2ac',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Morning', 'two', '4-6'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '2dd50d11-2493-48a4-80b0-7eaf840e8c31',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Morning', 'two', '6-9'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: 'c8603bac-0b9a-4a51-a6a1-a9b192a8dace',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Afternoon', 'two', '6-9'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '969a6321-f9e6-482e-9e2f-440fddbdf2ac',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Afternoon', 'two', '6-9'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '95d17a04-2e8f-4a14-a373-d1db260d030a',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Afternoon', 'two', '6-9'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '807a5fbe-53b1-4604-bb57-358397374e02',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Afternoon', 'two', '6-9'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '34b30d7f-91fe-44ed-8a77-f80512b8d918',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Afternoon', 'two', '6-9'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '20c2ac1f-5b63-402d-9d04-040d47553747',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Afternoon', 'three', '1-3'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '3867903c-31c1-42b6-8df5-ee8b41bcea7d',
            parent_message_id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
            subject: 'Survey',
            survey: {
              id: '0af421fb-a2d2-4927-bc0d-5816685093b0',
              questions: null,
              response: true,
              answers: ['Night', 'one', '1-3'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'admin', type: 'user' },
            id: '1b8b227b-9f20-488d-9593-8436c57c631c',
            parent_message_id: '9b5779c8-04e2-43d3-856e-4b5b69da51a2',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: [
                {
                  prompt: 'What direction?',
                  choices: ['North ', 'South', 'East'],
                },
                {
                  prompt: 'What time do you Water?',
                  choices: ['one', 'two', 'three'],
                },
                {
                  prompt: 'How many captures?',
                  choices: ['1-3', '4-6', '6-9'],
                },
              ],
              response: null,
              answers: null,
            },
            title: null,
            to: [{ recipient: 'handle2', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: 'f3213a37-6868-4113-ae61-648a1913fea9',
            parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: null,
              response: true,
              answers: ['North', 'one', '1-3'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '8ac0585d-d174-4f13-8705-c1b3c881228c',
            parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: null,
              response: true,
              answers: ['South', 'two', '4-6'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle2', type: 'user' },
            id: '7f0fd873-92dc-4e2c-adf5-2d5f9d6eb101',
            parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: null,
              response: true,
              answers: ['North', 'one', '1-3'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle2', type: 'user' },
            id: 'asdf9ac5-aaa7-4147-8274-25dca0d09329',
            parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: null,
              response: true,
              answers: ['East', 'three', '6-9'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: 'f3213a37-6868-4113-asdf-648a1913fea9',
            parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: null,
              response: true,
              answers: ['North', 'one', '1-3'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle1', type: 'user' },
            id: '8ac0585d-d174-asdf-8705-c1b3c881228c',
            parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: null,
              response: true,
              answers: ['South', 'two', '4-6'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle2', type: 'user' },
            id: '7f0fasdf-92dc-4e2c-adf5-2d5f9d6eb101',
            parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: null,
              response: true,
              answers: ['North', 'one', '1-3'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
          {
            body: 'Something',
            composed_at: '2022-02-20T23:00:40.499Z',
            from: { author: 'handle2', type: 'user' },
            id: '53849ac5-aaa7-4147-8274-25dcasdf329',
            parent_message_id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
            subject: 'Survey',
            survey: {
              id: '290a8323-7ebb-4ca5-934e-5801e2df1190',
              questions: null,
              response: true,
              answers: ['East', 'three', '6-9'],
            },
            title: null,
            to: [{ recipient: 'admin', type: 'user' }],
            video_link: null,
          },
        ],
      },
    );
    cy.intercept(
      'https://dev-k8s.treetracker.org/messaging/survey/3867903c-31c1-42b6-8df5-ee8b41bcea7d',
      {
        id: '3867903c-31c1-42b6-8df5-ee8b41bcea7d',
        title: 'Survey 1',
        questions: [
          { prompt: 'What direction?', choices: ['North ', 'South', 'East'] },
          {
            prompt: 'What time do you Water?',
            choices: ['one', 'two', 'three'],
          },
          { prompt: 'How many captures?', choices: ['1-3', '4-6', '6-9'] },
        ],
        responses: [
          {
            labels: ['North', 'South', 'East'],
            datasets: [
              {
                label: '-',
                data: [23, 100, 12],
              },
            ],
          },
          {
            labels: ['one', 'two', 'three'],
            datasets: [
              {
                label: '-',
                data: [12, 213, 231],
              },
            ],
          },
          {
            labels: ['1-3', '4-6', '6-9'],
            datasets: [
              {
                label: '-',
                data: [23, 100, 12],
              },
            ],
          },
        ],
      },
    );
    cy.intercept(
      'https://dev-k8s.treetracker.org/messaging/survey/53849ac5-aaa7-4147-8274-25dcasdf329',
      {
        id: '53849ac5-aaa7-4147-8274-25dcasdf329',
        title: 'Survey 2',
        questions: [
          {
            prompt: 'Question 1?',
            choices: ['Answer 1', 'Answer 2', 'Answer 3'],
          },
          {
            prompt: 'Question 2?',
            choices: ['Answer 1', 'Answer 2', 'Answer 3'],
          },
          {
            prompt: 'Question 3?',
            choices: ['Answer 1', 'Answer 2', 'Answer 3'],
          },
        ],
        responses: [
          {
            labels: ['Answer 1', 'Answer 2', 'Answer 3'],
            datasets: [
              {
                label: '-',
                data: [100, 10, 40],
              },
            ],
          },
          {
            labels: ['Answer 1', 'Answer 2', 'Answer 3'],
            datasets: [
              {
                label: '-',
                data: [23, 23, 26],
              },
            ],
          },
          {
            labels: ['Answer 1', 'Answer 2', 'Answer 3'],
            datasets: [
              {
                label: '-',
                data: [10, 10, 12],
              },
            ],
          },
        ],
      },
    );

    cy.visit('http://localhost:3001/login');
    cy.get('#userName').type('admin');
    cy.get('#password').type('8pzPdcZAG6&Q');
    cy.contains(/log/i).click();
    cy.contains(/inbox/i).click();
    cy.contains('Survey 1');
    cy.contains('290a8323-7ebb-4ca5-934e-5801e2df1190').click();
  });
});
