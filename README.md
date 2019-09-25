<h1 align="center">
  <br>
	<img width="128" src="media/logo.png" alt="Rice">
  <br>
  <br>
  <br>
</h1>

> 📦 out-of-box micro-frontends solution

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

- Full Documentation
  - [Motivation](./docs/motivation.md)
  - [Principle](./docs/principle.md)

# 🍩 🎉 😊 Let's eat some food

## Runtime Core

### Define App component

```javascript
import { connect } from "@arice/core";
import UserInfo from "./UserInfo";
import effects from "./effects";

function App({ dispatch, provide }) {
  provide({
    greet: name => {
      alert(`hello, ${name}`);
    }
  });

  return <UserInfo onLogin={name => dispatch("greet", name)} />;
}

export default connect({ effects })(App);
```

### Define UserInfo component

```javascript
import { connect } from "@arice/core";
import effects from "./effects";

function UserInfo({ dispatch, provide }) {
  provide({
    setTitle: title => {
      document.title = title;
    }
  });

  return <UserInfoCom />;
}

export default connect({ effects })(UserInfo);
```

### Add effects

```javascript
// effects.js
export default ({ $, inject }) => {
  // use component
  const app = inject("@component/App");
  const userInfo = inject("@component/UserInfo");

  // use module
  const xView = inject('@module/xView');

  $("greet").subscribe(name => {
    app.greet(name);
    userInfo.setTitle(name);

    xView.$open();
  });
};
```

### Start

```javascript
import Rice from "@arice/core";
import XView from '@arice/x-view'
import App from "./App.jsx";

const app = Rice();

app.module('xView', XView);
app.load(() => <App />);

app.start("#container");
```
