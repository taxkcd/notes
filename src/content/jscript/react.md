# Top 20 React JS Interview Questions - 2025

## 1. What is React?

React is an open-source JavaScript library for building user interfaces, created by Facebook. It focuses on building component-based UIs for single-page applications.

**Key Features:**
- Component-based architecture
- Virtual DOM for efficient updates
- JSX syntax
- Unidirectional data flow
- Rich ecosystem and community

```jsx
function App() {
  return <h1>Hello, React!</h1>;
}
```

---

## 2. What is JSX?

JSX (JavaScript XML) is a syntax extension that allows you to write HTML-like code within JavaScript. It makes component structure more readable.

```jsx
// JSX
const element = <h1>Hello, {name}!</h1>;

// Compiles to
const element = React.createElement('h1', null, `Hello, ${name}!`);
```

**Key Points:**
- Not mandatory but widely used
- Requires transpilation (Babel)
- Expressions go inside curly braces `{}`
- Must return a single parent element

---

## 3. What is the Virtual DOM?

The Virtual DOM is a lightweight, in-memory representation of the actual DOM. React uses it to optimize UI updates by:

1. Creating a virtual copy of the DOM
2. Comparing it with the previous version (diffing)
3. Updating only changed elements in the real DOM (reconciliation)

**Benefits:**
- Faster updates
- Better performance
- Efficient batch updates

---

## 4. What is the difference between State and Props?

| **State** | **Props** |
|-----------|-----------|
| Managed within component | Passed from parent to child |
| Mutable (can change) | Immutable (read-only) |
| Owned by component | Owned by parent |
| Can be updated with `setState()` or `useState` | Cannot be modified by child |

```jsx
// Props example
function Child({ name }) {
  return <p>Hello, {name}!</p>;
}

function Parent() {
  return <Child name="John" />;
}

// State example
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## 5. What are React Hooks?

Hooks are functions that let you use state and other React features in functional components (introduced in React 16.8).

**Common Hooks:**
- `useState` - Manage state
- `useEffect` - Handle side effects
- `useContext` - Access context
- `useRef` - Reference DOM elements
- `useMemo` - Memoize expensive calculations
- `useCallback` - Memoize functions

```jsx
function Example() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## 6. Explain useState Hook

`useState` is a Hook that adds state to functional components. It returns an array with two elements: the current state value and a function to update it.

```jsx
function Counter() {
  // [currentValue, updaterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

---

## 7. Explain useEffect Hook

`useEffect` handles side effects in functional components (data fetching, subscriptions, DOM manipulation).

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  // Runs after every render
  useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
  }, [userId]); // Dependency array - runs only when userId changes
  
  return <div>{user?.name}</div>;
}

// Cleanup example
useEffect(() => {
  const subscription = subscribeToData();
  
  return () => {
    subscription.unsubscribe(); // Cleanup
  };
}, []);
```

**Dependency Array:**
- `[]` - Runs once on mount
- `[dep1, dep2]` - Runs when dependencies change
- No array - Runs after every render

---

## 8. What are Controlled vs Uncontrolled Components?

**Controlled Components:**
- Form data handled by React state
- Single source of truth
- Value controlled by React

```jsx
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value} 
      onChange={(e) => setValue(e.target.value)} 
    />
  );
}
```

**Uncontrolled Components:**
- Form data handled by DOM
- Use refs to access values

```jsx
function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return <input ref={inputRef} />;
}
```

---

## 9. What are Keys in React?

Keys are unique identifiers for list elements. They help React identify which items have changed, been added, or removed.

```jsx
// Bad - using index
{items.map((item, index) => 
  <li key={index}>{item.name}</li>
)}

// Good - using unique ID
{items.map(item => 
  <li key={item.id}>{item.name}</li>
)}
```

**Why Keys Matter:**
- Improve performance
- Prevent rendering issues
- Maintain component state correctly

---

## 10. What is Component Lifecycle?

React components have three main lifecycle phases:

**1. Mounting** - Component is created and inserted into DOM
**2. Updating** - Component re-renders due to state/props changes
**3. Unmounting** - Component is removed from DOM

**Class Component Lifecycle Methods:**
```jsx
class MyComponent extends React.Component {
  componentDidMount() {
    // After first render
  }
  
  componentDidUpdate(prevProps, prevState) {
    // After updates
  }
  
  componentWillUnmount() {
    // Before component removal
  }
  
  render() {
    return <div>Hello</div>;
  }
}
```

**Functional Component (with Hooks):**
```jsx
function MyComponent() {
  useEffect(() => {
    // componentDidMount
    return () => {
      // componentWillUnmount
    };
  }, []);
  
  useEffect(() => {
    // componentDidUpdate
  });
}
```

---

## 11. What are Higher-Order Components (HOC)?

A Higher-Order Component is a function that takes a component and returns a new enhanced component. It's a pattern for reusing component logic.

```jsx
// HOC that adds loading functionality
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <p>Loading...</p>;
    return <Component {...props} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);

function App() {
  const [loading, setLoading] = useState(true);
  return <UserListWithLoading isLoading={loading} users={users} />;
}
```

---

## 12. What is Context API?

Context provides a way to pass data through the component tree without passing props manually at every level.

```jsx
// Create context
const ThemeContext = React.createContext('light');

// Provider
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// Consumer (with useContext hook)
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

**When to Use:**
- Global state (theme, user data, language)
- Avoid prop drilling
- Share data across many components

---

## 13. What is React Router?

React Router is a library for handling navigation and routing in React applications.

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/123">User</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

// Accessing URL parameters
function User() {
  const { id } = useParams();
  return <h1>User ID: {id}</h1>;
}
```

---

## 14. What is Redux?

Redux is a state management library that provides a centralized store for application state.

**Core Concepts:**
- **Store** - Single source of truth
- **Actions** - Objects describing what happened
- **Reducers** - Pure functions that specify state changes

```jsx
// Action
const increment = () => ({ type: 'INCREMENT' });

// Reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

// Store
import { createStore } from 'redux';
const store = createStore(counterReducer);

// Component
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  
  return <button onClick={() => dispatch(increment())}>{count}</button>;
}
```

---

## 15. What are React Fragments?

Fragments let you group multiple elements without adding extra DOM nodes.

```jsx
// Without Fragment (adds extra div)
function Table() {
  return (
    <div>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </div>
  );
}

// With Fragment
function Table() {
  return (
    <>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </>
  );
}

// Or explicit syntax
function Table() {
  return (
    <React.Fragment>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </React.Fragment>
  );
}
```

---

## 16. What is useRef Hook?

`useRef` creates a mutable reference that persists across renders without causing re-renders.

**Use Cases:**
- Accessing DOM elements
- Storing mutable values
- Keeping previous values

```jsx
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}

// Storing previous value
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  });
  
  return <div>Now: {count}, Before: {prevCountRef.current}</div>;
}
```

---

## 17. What is useMemo Hook?

`useMemo` memoizes expensive computations and only recalculates when dependencies change.

```jsx
function ExpensiveComponent({ items, filter }) {
  // Without useMemo - recalculates on every render
  const filteredItems = items.filter(item => item.type === filter);
  
  // With useMemo - only recalculates when dependencies change
  const filteredItems = useMemo(
    () => items.filter(item => item.type === filter),
    [items, filter]
  );
  
  return <List items={filteredItems} />;
}
```

**When to Use:**
- Expensive calculations
- Prevent unnecessary re-renders
- Referential equality for dependencies

---

## 18. What is useCallback Hook?

`useCallback` memoizes functions to prevent unnecessary re-creation on every render.

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // Without useCallback - new function on every render
  const handleClick = () => setCount(count + 1);
  
  // With useCallback - same function reference
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <Child onClick={handleClick} />;
}

// Child only re-renders if onClick changes
const Child = React.memo(({ onClick }) => {
  return <button onClick={onClick}>Click Me</button>;
});
```

---

## 19. What is React.memo?

`React.memo` is a higher-order component that memoizes component output, preventing re-renders when props haven't changed.

```jsx
// Without memo - re-renders every time parent renders
function Child({ name }) {
  return <p>Hello, {name}!</p>;
}

// With memo - only re-renders if name changes
const Child = React.memo(function Child({ name }) {
  return <p>Hello, {name}!</p>;
});

// Custom comparison function
const Child = React.memo(
  function Child({ user }) {
    return <p>{user.name}</p>;
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
```

---

## 20. What are Error Boundaries?

Error Boundaries are React components that catch JavaScript errors in their child component tree, log errors, and display fallback UI.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

**Note:** Error Boundaries only work with class components (not functional components with hooks yet).

---

## Bonus Topics

### Lazy Loading
```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Custom Hooks


Custom hooks in React are reusable functions that let you extract component logic into standalone, shareable pieces. They're a way to organize and reuse stateful logic across multiple components without changing your component hierarchy.
The basics
Custom hooks are just JavaScript functions whose names start with "use" and that can call other hooks. Here's a simple example:
``` js
javascriptfunction useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return width;
}
```
Now any component can use this hook to get the current window width:

``` js
javascriptfunction MyComponent() {
  const width = useWindowWidth();
  return <div>Window width: {width}px</div>;
}
```
Why they're useful
Custom hooks let you avoid duplicating the same logic across components. Instead of copying and pasting the same useState and useEffect calls everywhere, you write the logic once in a custom hook and reuse it. They also make your components cleaner and easier to read since complex logic is moved into a separate, well-named function.
Key rules
Custom hooks follow the same rules as regular hooks: they can only be called at the top level of a component or another custom hook (not inside loops, conditions, or nested functions), and they must start with "use" so React can identify them as hooks.

#### Older example

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

---

## Quick Reference

**When to use what:**
- `useState` - Component-level state
- `useEffect` - Side effects, subscriptions, data fetching
- `useContext` - Global state, avoid prop drilling
- `useRef` - DOM access, persist values without re-render
- `useMemo` - Expensive calculations
- `useCallback` - Prevent function recreation
- `React.memo` - Prevent component re-renders
- Custom Hooks - Reusable stateful logic

**Performance Tips:**
1. Use React DevTools Profiler
2. Memoize expensive operations
3. Code splitting with lazy loading
4. Use production builds
5. Virtualize long lists
6. Avoid inline functions in JSX
7. Use keys correctly in lists