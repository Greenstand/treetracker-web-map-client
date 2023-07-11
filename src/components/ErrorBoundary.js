import * as React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {

      super(props)
      this.state = { hasError: false }

    }

    static getDerivedStateFromError(error) {

      return { hasError: true }

    }

    componentDidCatch(error, errorInfo) {

      console.log({ error, errorInfo })

    }

    render() {
      const newState = this.state
      if (newState.hasError) {
        // You can render any custom fallback UI
        return (
          <div>
            <h2>Oops, there is an error!</h2>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again?
            </button>
          </div>
        )
      }
      const newProps = this.props
      return newProps.children
    }
  }
   
  export default ErrorBoundary