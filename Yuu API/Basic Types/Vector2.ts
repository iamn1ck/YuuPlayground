

const vector2Epsilon = 0.000001;


export class Vector2 {
  public x: number;
  public y: number;


  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }


  add(vector: Vector2): Vector2 {
    return new Vector2(
      this.x + vector.x,
      this.y + vector.y,
    );
  }

  subtract(vector: Vector2): Vector2 {
    return new Vector2(
      this.x - vector.x,
      this.y - vector.y,
    );
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(
      this.x * scalar,
      this.y * scalar,
    );
  }

  divide(scalar: number): Vector2 {
    if (scalar === 0) throw new Error("Division by zero");
    return new Vector2(
      this.x / scalar,
      this.y / scalar,
    );
  }

  normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) throw new Error("Cannot normalize zero vector");
    return this.divide(mag);
  }

  magnitude(): number {
    return Math.sqrt(this.dot(this));
  }

  equals(vector: Vector2, epsilon: number = vector2Epsilon): boolean {
    return Math.abs(this.x - vector.x) < epsilon && Math.abs(this.y - vector.y) < epsilon;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  negate(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  dot(vector: Vector2): number {
    return this.x * vector.x +
      this.y * vector.y;
  }

  lerp(v2: Vector2, t: number): Vector2 {
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    return new Vector2(
      this.x + (v2.x - this.x) * t,
      this.y + (v2.y - this.y) * t
    );
  }

  toArray(): number[] {
    return [this.x, this.y];
  }

  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }


  static get zero(): Vector2 { return new Vector2(0, 0); }
  static get one(): Vector2 { return new Vector2(1, 1); }

  static add(v1: Vector2, v2: Vector2): Vector2 { return v1.add(v2); }
  static subtract(v1: Vector2, v2: Vector2): Vector2 { return v1.subtract(v2); }
  static multiply(v1: Vector2, scalar: number): Vector2 { return v1.multiply(scalar); }
  static divide(v1: Vector2, scalar: number): Vector2 { return v1.divide(scalar); }

  static normalize(vector: Vector2): Vector2 { return vector.normalize(); }
  static magnitude(vector: Vector2): number { return vector.magnitude(); }
  static equals(v1: Vector2, v2: Vector2, epsilon: number = vector2Epsilon): boolean { return v1.equals(v2, epsilon); }

  static clone(vector: Vector2): Vector2 { return vector.clone(); }
  static negate(vector: Vector2): Vector2 { return vector.negate(); }

  static dot(v1: Vector2, v2: Vector2): number { return v1.dot(v2); }
  static lerp(v1: Vector2, v2: Vector2, t: number): Vector2 { return v1.lerp(v2, t); }

  static toArray(vector: Vector2): number[] { return vector.toArray(); }
  static toString(vector: Vector2): string { return vector.toString(); }


  addInPlace(vector: Vector2): this {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  subtractInPlace(vector: Vector2): this {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  multiplyInPlace(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  divideInPlace(scalar: number): this {
    if (scalar === 0) throw new Error("Division by zero");
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  normalizeInPlace(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) throw new Error("Cannot normalize zero vector");
    this.divideInPlace(mag);
    return this;
  }

  negateInPlace(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * Useful for getting coordinates along a line, only works with whole numbers
   * @param a pos to start from
   * @param b pos to end at
   * @returns Vector2 array of coordinates
   */
  static getBresenhamLineCoords(a: Vector2, b: Vector2): Vector2[] {
    const coords: Vector2[] = [];

    let x1 = Math.round(a.x);
    let y1 = Math.round(a.y);
    const x2 = Math.round(b.x);
    const y2 = Math.round(b.y);

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;

    let err = dx - dy;

    while (true) {
      coords.push(new Vector2(x1, y1));

      if (x1 === x2 && y1 === y2) break;

      const e2 = 2 * err;

      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }

      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }

    return coords;
  }
}
