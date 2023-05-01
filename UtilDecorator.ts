/** n 秒後執行，重複觸發則重新計時(防抖) */
export function debounce(delay: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let wraperMap: { [uuid: string]: (() => void); } = {};

        descriptor.value = function (...args: unknown[]) {
            if (wraperMap[this.uuid]) {
                this.unschedule(wraperMap[this.uuid]);
            }

            wraperMap[this.uuid] = function () {
                originalMethod?.call(this, args);
                delete wraperMap[this.uuid];
            };

            this.scheduleOnce(wraperMap[this.uuid], delay);
        };
    };
};

/** n 秒後執行，計時中不重複觸發(節流) */
export function throttle(delay: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod: (...args: unknown[]) => void = descriptor.value;
        let wraperMap: { [uuid: string]: (() => void); } = {};

        descriptor.value = function (...args: unknown[]) {
            if (wraperMap[this.uuid]) {
                return;
            }

            wraperMap[this.uuid] = function () {
                originalMethod?.call(this, args);
                delete wraperMap[this.uuid];
            };

            this.scheduleOnce(wraperMap[this.uuid], delay);
        };
    };
}