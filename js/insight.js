---
title: react打怪笔记
date: 2018-12-19 16:39:01
categories: React
---

## 介绍
本文用于记录在学习react中的记录。

#### Tips:
+ 当组件的props或state有变化，执行render函数。
+ 无论是使用函数或是类来声明一个组件，它决不能修改它自己的props


## 无状态函数式组件 (stateless functional component)
例:

```js
<!--this-->
function Welcome(props) {
    return <p>hello, {props.name}</p>;
}

<!--or ES6-->
const Welcome = ({ name }) => {
    return <p>hello, {props.name}</p>;
}

const element = <Welcome name="Timbok" />

ReactDom.render(
    element,
    document.getElementById('root'),
)
```


#### 无生命周期方法
函数式组件，有时也被称为无状态组件，没有任何生命周期方法，意味着每次上层组件树状态发生变更时它们都会重新渲染，这就是因为缺少 `shouldComponentUpdate` 方法导致的。这也同样意味着您不能定义某些基于组件挂载和卸载的行为。

#### 没有 this 和 ref
更有趣的是您在函数式组件中既不能使用 `this`关键字或访问到 `ref`。对于习惯了严格意义上的类或面向对象风格的人来说，这很让他们惊讶。这也是使用函数最大的争论点。
另一个有趣的事实就是您仍然可以访问到 context，如果您将 context 定义为函数的一个 props。

#### 避免常见陷阱
在编写无状态函数式组件时，您需要避免某些特定的模式。避免在函数式组件中定义函数，这是因为每一次函数式组件被调用的时候，一个新的函数都会被创建。

```js
const Functional = ({...}) => {
  const handleSomething = e => path(['event', 'target'], e)
  return (
    // ...
  )
}
```

这个问题很容易解决，您可以将这个函数作为 props 传递进去，或者将它定义在组件外面。

```js
const handleSomething = e => path(['event', 'target'], e)
const Functional = ({...}) => // ...
```

## 生命周期

### 概况

![react生命周期图解](http://m.qpic.cn/psb?/V14EjDJy3GW84h/Qp6cCD2iqIpGqvaVv1eWWki34FR0oMbdQ3TDB9N4fk8!/b/dFMBAAAAAAAA&bo=2AS7AgAAAAADB0c!&rf=viewer_4)

[生命周期演示](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

#### 1.初始化

在组件初始化阶段会执行
> 1. constructor
> 2. static getDerivedStateFromProps()
> 3. componentWillMount() / UNSAFE_componentWillMount()
> 4. render()
> 5. componentDidMount()

#### 2.更新阶段
`props`或`state`的改变可能会引起组件的更新，组件重新渲染的过程中会调用以下方法：

> 1. componentWillReceiveProps() / UNSAFE_componentWillReceiveProps()
> 2. static getDerivedStateFromProps()
> 3. shouldComponentUpdate()
> 4. componentWillUpdate() / UNSAFE_componentWillUpdate()
> 5. render()
> 6. getSnapshotBeforeUpdate()
> 7. componentDidUpdate()

#### 3.卸载阶段
> 1. componentWillUnmount()

#### 4.错误处理

> 1. componentDidCatch()

### 详解

### 1.constructor(props)
react组件的构造函数在挂载之前被调用。在实现`React.Component`构造函数时，需要先在添加其他内容前，调用`super(props)`，用来将父组件传来的`props`绑定到这个类中，使用`this.props`将会得到。

官方建议不要在`constructor`引入任何具有副作用和订阅功能的代码，这些应当在`componentDidMount()`中写入。

`constructor`中应当做些初始化的动作，如：初始化`state`，将事件处理函数绑定到类实例上，但也不要使用`setState()`。如果没有必要初始化state或绑定方法，则不需要构造`constructor`，或者把这个组件换成纯函数写法。

当然也可以利用`props`初始化`state`，在之后修改`state`不会对props造成任何修改，但仍然建议大家提升状态到父组件中，或使用`redux`统一进行状态管理。

```js
constructor(props) {
  super(props);
  this.state = {
    color: props.initialColor
  };
}
```
### 2.static getDerivedStateFromProps(nextProps, prevState)
`getDerivedStateFromProps`在组件实例化后，和接受新的`props`后被调用。他返回一个对象来更新状态，或者返回null表示新的props不需要任何state的更新。

如果是由于父组件的props更改，所带来的重新渲染，也会触发此方法。

调用`steState()`不会触发`getDerivedStateFromProps()`。

### 3. componentWillMount() / UNSAFE_componentWillMount()
`componentWillMount()`将在react未来版本中被弃用。`UNSAFE_componentWillMount()`在组件挂载前被调用，在这个方法中调用`setState()`不会起作用，是由于他在`render()`前被调用。

为了避免副作用和其他的订阅，官方都建议使用`componentDidMount()`代替。这个方法是用于在服务器渲染上的唯一方法。

### 4.render()
`render()`方法是必需的。当他被调用时，他将计算`this.props`和`this.state`，并返回以下一种类型：
1. React元素。通过jsx创建，既可以是dom元素，也可以是用户自定义的组件。
2. 字符串或数字。他们将会以文本节点形式渲染到dom中。
3. Portals。react 16版本中提出的新的解决方案，可以使组件脱离父组件层级直接挂载在DOM树的任何位置。
4. `null`，什么也不渲染
5. 布尔值。也是什么都不渲染，通常后跟组件进行判断。

当返回`null`,`false`,`ReactDOM.findDOMNode(this)`将会返回null，什么都不会渲染。

`render()`方法必须是一个纯函数，他不应该改变`state`，也不能直接和浏览器进行交互，应该将事件放在其他生命周期函数中。
如果`shouldComponentUpdate()`返回`false`，`render()`不会被调用。
#### Fragments
你也可以在`render()`中使用数组，如：(*不要忘记给每个数组元素添加key，防止出现警告*)
```jsx
render() {
  return [
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```
换一种写法，可以不写key（v16++）
```jsx
render() {
  return (
    <React.Fragment>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </React.Fragment>
  );
}
```

官方实例: 

```js
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

### 5.componentWillReceiveProps()/UNSAFE_componentWillReceiveProps(nextProps)
官方建议使用`getDerivedStateFromProps`函数代替`componentWillReceiveProps()`。当组件挂载后，接收到新的`props`后会被调用。如果需要更新`state`来响应`props`的更改，则可以进行`this.props`和`nextProps`的比较，并在此方法中使用`this.setState()`。

如果父组件会让这个组件重新渲染，即使`props`没有改变，也会调用这个方法。

react不会在组件初始化props时调用这个方法。调用`this.setState`也不会触发。

### 6.shouldComponentUpdate(nextProps, nextState)
调用`shouldComponentUpdate`使react知道，组件的输出是否受`state`和`props`的影响。默认每个状态的更改都会重新渲染，大多数情况下应该保持这个默认行为。

在渲染新的`props`或`state`前，`shouldComponentUpdate`会被调用。默认为`true`。这个方法不会在初始化时被调用，也不会在`forceUpdate()`时被调用。返回`false`不会阻止子组件在`state`更改时重新渲染。

如果`shouldComponentUpdate()`返回`false`，`componentwillupdate`,`render`和`componentDidUpdate`不会被调用。
> 在未来版本，shouldComponentUpdate()将会作为一个提示而不是严格的指令，返回false仍然可能导致组件的重新渲染。
官方并不建议在`shouldComponentUpdate()`中进行深度查询或使用`JSON.stringify()`，他效率非常低，并且损伤性能。

### 7.UNSAFE_componentWillUpdate(nextProps, nextState)
在渲染新的`state`或`props`时，`UNSAFE_componentWillUpdate`会被调用，将此作为在更新发生之前进行准备的机会。这个方法不会在初始化时被调用。

*不能在这里使用this.setState()*，也不能做会触发视图更新的操作。如果需要更新`state`或`props`，调用`getDerivedStateFromProps`。

### 8.getSnapshotBeforeUpdate()
在react `render()`后的输出被渲染到DOM之前被调用。它使您的组件能够在它们被潜在更改之前捕获当前值（如滚动位置）。这个生命周期返回的任何值都将作为参数传递给componentDidUpdate（）。
### 9.componentDidUpdate(prevProps, prevState, snapshot)
在更新发生后立即调用`componentDidUpdate()`。此方法不用于初始渲染。当组件更新时，