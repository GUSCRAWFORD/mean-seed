export const TS = ()=>
    `🕓  ${new Date().toLocaleString('en-US')}`;

export class Timer {
    private startTime = new Date();
    private stopTime;
    stop() {
        this.stopTime = new Date();
    }
    get started() {
        return this.startTime.toLocaleString('en-US');
    }
    get stopped() {
        if (!this.stopTime) return null;
        return this.stopTime.toLocaleString('en-US');
    }
    get ms() {
        if (!this.stopTime) return null;
        return this.stopTime.valueOf() - this.startTime.valueOf();
    }
}