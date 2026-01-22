import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught:', error);
        console.error('Error Info:', errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Log to external service (Sentry, etc.)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View className="flex-1 bg-white justify-center items-center p-4">
                    <View className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
                        <Text className="text-red-700 text-2xl font-bold mb-2">
                            Oops! Something went wrong
                        </Text>
                        <Text className="text-red-600 text-base mb-4">
                            We're sorry for the inconvenience. The app encountered an unexpected error.
                        </Text>
                        
                        {__DEV__ && this.state.error && (
                            <View className="bg-red-100 p-3 rounded mb-4 mb-4">
                                <Text className="text-red-700 font-mono text-xs">
                                    {this.state.error.toString()}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={this.handleReset}
                            className="bg-red-500 rounded-lg py-3 px-6"
                        >
                            <Text className="text-white text-center font-semibold">
                                Try Again
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.handleReset();
                                // Navigate to home
                            }}
                            className="bg-gray-300 rounded-lg py-3 px-6 mt-3"
                        >
                            <Text className="text-gray-700 text-center font-semibold">
                                Go to Home
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {__DEV__ && (
                        <View className="mt-8 w-full">
                            <Text className="text-gray-600 font-bold mb-2">
                                Stack Trace (Development Only):
                            </Text>
                            <View className="bg-gray-100 p-3 rounded">
                                <Text className="text-gray-700 font-mono text-xs">
                                    {this.state.errorInfo?.componentStack}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
