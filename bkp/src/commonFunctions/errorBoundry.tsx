import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props:string) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: any, info: any) {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    render() {
        return "";
    }
}

export { ErrorBoundary }