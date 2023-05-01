// 紀錄使用過的 state 名稱，全局共用
const _stateNameSet: Set<string> = new Set;
/**
 * 設定狀態，狀態改變時會通知選取該狀態的方法  
 * 所有實例共用一個狀態，  
 * 只有 old !== new 時才會通知
 */
export function initState(name: string) {
    return function <T extends cc.Component>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) {
        let _val: any = null;

        // 劫持屬性，變化時發射事件
        Object.defineProperty(target, propertyKey, {
            get() {
                return _val;
            },
            set(value) {
                if (value === _val) {
                    return;
                }
                cc.systemEvent.emit(`_state_${name}_change_`, value);
                _val = value;
            }
        });

        // start 階段第一次賦值
        const originalOnLoad = target["start"];
        Object.defineProperty(target, "start", {
            value: function () {
                if (_val) {
                    // 避免有複數實例時，onLoad 重複賦值
                    return;
                }
                if (_stateNameSet.has(name)) {
                    throw new Error(`state name ${name} is already used`);
                }
                _val = this[propertyKey];
                originalOnLoad?.call(this);
            },
            configurable: true,
            enumerable: true,
            writable: true,
        });

        // onDestory 階段清理變數
        const originalOnDestory = target["onDestory"];
        Object.defineProperty(target, "onDestory", {
            value: function () {
                originalOnDestory?.call(this);
                _val = null;
                _stateNameSet.delete(name);
            },
            configurable: true,
            enumerable: true,
            writable: true,
        });
    };
}

/** 
 * 選取狀態
 * ```
 * // 裝飾對象
 * private onStateNotify(state: any, from: cc.Component) {
 *   // do something on state change
 * }
 * ```
 */
export function selectState(name: string) {
    return function <T extends cc.Component>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const listener = descriptor.value;

        // onLoad 階段監聽 state 變化
        const originalOnLoad = target["onLoad"];
        Object.defineProperty(target, "onLoad", {
            value: function () {
                originalOnLoad?.call(this);
                cc.systemEvent.on(`_state_${name}_change_`, listener, this);
            },
            configurable: true,
            enumerable: true,
            writable: true,
        });

        // onDestory 階段移除監聽 state 變化
        const originalOnDestory = target["onDestory"];
        Object.defineProperty(target, "onDestory", {
            value: function () {
                originalOnDestory?.call(this);
                cc.systemEvent.off(`_state_${name}_change_`, listener, this);
            },
            configurable: true,
            enumerable: true,
            writable: true,
        });
    };
}