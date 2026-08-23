import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Components here portal into document.body. Without an explicit cleanup a
// menu or dialog left by one test is still mounted for the next, and queries
// start matching the wrong element.
afterEach(cleanup);
