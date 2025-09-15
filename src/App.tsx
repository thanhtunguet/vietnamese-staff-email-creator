import EmailCreator from './components/EmailCreator';

function App() {
  return (
    <div className="app-container">
      <div className="main-wrapper">
        <div className="header-section">
          <h1 className="header-title">
            Vietnamese Staff Email Creator
          </h1>
          <p className="header-subtitle">
            Convert Vietnamese names from Excel files to email usernames
          </p>
        </div>
        
        <EmailCreator />
      </div>
    </div>
  )
}

export default App
