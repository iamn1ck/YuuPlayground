export class PriorityQueue<T> {
  private readonly isMinimum: boolean;

  private readonly priorityQueue: [number, T][] = [];


  /**
   * Creates an ordered array to track data from small to large, or vice versa
   * @param isMinimum defaults to true, meaning smaller numbers come first
   */
  constructor(isMinimum: boolean = true) {
    this.isMinimum = isMinimum;
  }

  public insert(numPos: number, value: T) {
    let index = this.priorityQueue.findIndex(([num, val]) => (this.isMinimum ? (num <= numPos) : (numPos <= num)), 0);

    if (index === -1) {
      index = this.priorityQueue.length;
    }

    this.priorityQueue.splice(index, 0, [numPos, value]);
  }

  public getNext(): [number, T] | undefined {
    if (this.priorityQueue.length > 0) {
      return this.priorityQueue[this.priorityQueue.length - 1];
    }
    else {
      return undefined;
    }
  }

  public removeNext(): [number, T] | undefined {
    if (this.priorityQueue.length > 0) {
      return this.priorityQueue.pop();
    }
    else {
      return undefined;
    }
  }

  public clear() {
    this.priorityQueue.length = 0;
  }

  public getLength(): number {
    return this.priorityQueue.length;
  }
}