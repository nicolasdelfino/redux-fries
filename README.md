# redux-fries 🍟

[![Build Status](https://travis-ci.org/nicolasdelfino/redux-fries.svg?branch=master)](https://travis-ci.org/nicolasdelfino/redux-fries)

> "Greasy middleware for subscribing to actions and creating tasty side-effects in your code"

#### codesandbox demo
https://codesandbox.io/s/pY5My9A5y
#### INSTALL
```javascript
yarn add redux-fries
```
#### REASON
Found the need when working on a legacy project that mixed the imperative / declarative paradigmns. Considered somewhat of an anti-pattern on a pure React project so use with care.
#### SUBSCRIBE
```javascript
import { subscribe, unsubscribe } from 'redux-fries'
```
Pass the action key to subscribe and the callback that you want fired when that action dispatches.
```javascript
const localSub = subscribe('SOME_ACTION', callback)
```
```javascript
const callback = state => console.log(state) // e.g { subscribed:true }
```
#### UNSUBSCRIBE
The const localSub now holds the unique id returned from subscribe, this id consists of the key argument plus a unique identifier, e.g **'SOME_ACTION_#1'**
To unsubscribe you just call the unsubscribe method with the unique id as the argument
```javascript
unsubscribe(localSub)
```
