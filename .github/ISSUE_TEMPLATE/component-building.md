---
name: Component building
about: This issue is about building components.
title: ''
labels: MaterialUI, react
assignees: ''
---

---

Some hints for building components:

- This kind of issue is about creating a new component, it might not need to mount it in the whole app, to know how to create a component separately, please check the tutorial below.
- Design resource: https://www.figma.com/file/XdYFdjlsHvxehlrkPVYq0l/Greenstand-Webmap?node-id=2497%3A11584
- A tutorial of how to use the Cypress component tool to build components:
  https://github.com/Greenstand/treetracker-wallet-web#how-to-build-a-component
- We are using MaterialUI to build the app: https://material-ui.com/
- Please mount the component with `import { mountWithTheme as mount } from '../../models/test-utils';` to get our theme imported.
- Please use MaterialUI `theme.spacing(x)` as possible as we can, so the component is more responsive
- When you are ready to raise PR for the component, please attach the screenshot of the component for review.
- Please read our [readme](https://github.com/Greenstand/treetracker-web-map-client#treetracker-web) for more information/guide/tutorial.
- Here is [an engineering book](https://greenstand.gitbook.io/engineering/) in Greenstand.
- To know more about our organization, visit our [website](https://greenstand.org).
- If you want to join the slack community (some resources need the community member's permission), please leave your email address.
- More issues in this project: https://github.com/orgs/Greenstand/projects/26
