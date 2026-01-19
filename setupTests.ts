// Global test setup for Jest
import '@testing-library/jest-dom';
const mock = jest.fn();
console.log = mock as any;
console.info = mock as any;
console.warn = mock as any;
console.error = mock as any;
console.debug = mock as any;
