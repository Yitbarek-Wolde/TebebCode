import React from 'react';
import LoginPage from './components/login';
import ProblemListEditor from './components/problemEditor';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <ProblemListEditor />
      )}
    </>
  );
}

export default App;
