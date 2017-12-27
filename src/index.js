import dva from 'dva';
import './index.css';
import browserHistory from 'history/createBrowserHistory';

// 1. Initialize
const app = dva({
  history: browserHistory(),
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
