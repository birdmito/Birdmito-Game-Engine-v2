import { System } from "./System";

export class EventSystem extends System {
    eventListeners: { [key: string]: Function[] };

    constructor() {
        super();
        this.eventListeners = {};
    }

    addEventListener(eventName: string, callback) {
        if (!this.eventListeners[eventName]) {
          this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
      }

      removeEventListener(eventName: string, callback) {
        const listeners = this.eventListeners[eventName];
        if (listeners) {
          this.eventListeners[eventName] = listeners.filter(
            (listener) => listener !== callback
          );
        }
      }

      dispatchEvent(eventName: string, eventData) {
        const listeners = this.eventListeners[eventName];
        if (listeners) {
          listeners.forEach((listener) => {
            listener(eventData);
          });
        }
      }
      
}