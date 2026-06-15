import { PriorityQueue } from "./Basic Types/PriorityQueue";


const startPQ = new PriorityQueue<() => void>(true);


/**
 * Queues a function to be called on start
 * @param func the function to be called
 * @param priority the priority, lower is higher and is executed sooner
 */
export function registerStart(func: () => void, priority: number = 99) {
  startPQ.insert(priority, func);
}


let hasBeenRun = false;

export function runStart() {
  if (!hasBeenRun) {
    hasBeenRun = true;

    while (startPQ.getLength() > 0) {
      const nextItem = startPQ.removeNext();

      if (nextItem) {
        nextItem[1]();
      }
    }
  }
  else {
    console.log('runStart has already been run.');
  }
}