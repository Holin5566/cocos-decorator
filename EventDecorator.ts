/**
 * 劫持被裝飾的生命週期，讓節點監聽事件
 * @param name 事件名稱
 * @param lifeCycle  執行時機
 */
export function watchEvent(name: string, lifeCycle: "start" | "onEnable" = "start") {
    return function <T extends cc.Component>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = target[lifeCycle];
        const lisenter = descriptor.value;

        Object.defineProperty(target, lifeCycle, {
            value: function () {
                originalMethod?.apply(this);
                this.node.on(name, lisenter, this);
            },
            configurable: true,
            enumerable: true,
            writable: true,
        });
    };
}

/** 劫持被裝飾的方法，調用時移除節點上的監聽 */
export function removeEvent(name: string) {
    return function <T extends cc.Component>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = target[propertyKey];

        Object.defineProperty(target, propertyKey, {
            value: function () {
                originalMethod?.apply(this);
                this.node.off(name);
            },
            configurable: true,
            enumerable: true,
            writable: true,
        });
    };
}

/**
 * 在該節點發射事件  
 * 事件封包是裝飾對象的參數，如果有回傳值，則是回傳值
 */
export function emitEvent(name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: unknown[]) {
            let payload = await originalMethod?.call(this, args);
            this.node.emit(name, ...(payload || args));
        };
    };
}