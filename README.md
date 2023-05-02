# **cocos-decorator**
## **EventDecorator** 
### `@watchEvent(eventName, lifeCycle)`
- ```eventName``` : string

    監聽事件的名稱(cocos 內建事件 or 自定義)
- ```lifeCycle?``` : "start" | "onEnable" = "start"

    觸發綁定的生命週期，預設 start
    

原始寫法
```javascript
start () {
    this.node.on(
        cc.Node.EventType.TOUCH_START, 
        this.onClicked, 
        this
    );    
}

private onClicked() {
    console.log("on clicked!")
}
```
使用裝飾器
```javascript
@watchEvent(cc.Node.EventType.TOUCH_START)
private onClicked() {
    console.log("on clicked with decorator!")
}
```
---
### `@removeEvent(eventName)`
- ```eventName``` : string

原始寫法
```javascript
onDestroy () {
    this.node.off(
        cc.Node.EventType.TOUCH_START, 
        this.onClicked, 
        this
    );    
}
```
使用裝飾器
```javascript
@removeEvent(cc.Node.EventType.TOUCH_START)
onDestroy () {
    // do something
}
```


## **StateDecorator**
### `@initState(stateName)`
- ```stateName``` : string
    
    狀態的名稱
> 當狀態改變時會發射事件，通知發生變化，使用上需要注意以下 
> 1. 一個類別可以有複數狀態
> 2. 但狀態會被所有實例共用
> 3. 無法監聽物件屬性變動

原始寫法
```javascript
private _foo: number = 0;
get foo(): number { return this._foo };
set foo(val) {
    cc.systemEvent.emit(
        "_state_foo_change_", 
        val, 
        this
    );
    this._foo = val;
}
```
使用裝飾器
```javascript
@initState("stateFoo") // 自訂義
public foo: number = 0;
```
---
### `@selectState(stateName)`
- ```stateName``` : string

   使用到的狀態名稱
  
原始寫法
```javascript
onLoad() {
    cc.systemEvent.on(
        "_state_foo_change_",
        this.onFooChange,
        this
    );
    // ..do something
}

onDestroy() {
    // ..do something
    cc.systemEvent.off(
        "_state_foo_change_",
        this.onFooChange,
        this
    );
}

private onFooChange(foo: number, from: cc.Component) {
    console.log(from); // 被改變狀態的腳本
    console.log(foo); // 改變後的狀態
}
```
使用裝飾器
```javascript
@selectState("stateFoo")
onFooChange(foo: number, from: cc.Component) {
    console.log(from); // 被改變狀態的腳本
    console.log(foo); // 改變後的狀態
}
```
@debounce 
---
### `@debounce(delay)`
- ```delay``` : number

原始寫法
```javascript
```
使用裝飾器
```javascript
```
@throttle 
---
### `@throttle(delay)`
- ```delay``` : number

原始寫法
```javascript
```
使用裝飾器
```javascript
```
