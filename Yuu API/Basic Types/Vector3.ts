

const vector3Epsilon = 0.000001;


export class Vector3 {
  public x: number;
  public y: number;
  public z: number;


  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }


  add(vector: Vector3): Vector3 {
    return new Vector3(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z
    );
  }

  subtract(vector: Vector3): Vector3 {
    return new Vector3(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z
    );
  }

  multiply(scalar: number): Vector3 {
    return new Vector3(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    );
  }

  divide(scalar: number): Vector3 {
    if (scalar === 0) throw new Error("Division by zero");
    return new Vector3(
      this.x / scalar,
      this.y / scalar,
      this.z / scalar
    );
  }

  normalize(): Vector3 {
    const mag = this.magnitude();
    if (mag === 0) throw new Error("Cannot normalize zero vector");
    return this.divide(mag);
  }

  magnitude(): number {
    return Math.sqrt(this.dot(this));
  }

  distanceTo(vector: Vector3): number {
    return this.subtract(vector).magnitude();
  }

  equals(vector: Vector3, epsilon: number = vector3Epsilon): boolean {
    return Math.abs(this.x - vector.x) < epsilon &&
      Math.abs(this.y - vector.y) < epsilon &&
      Math.abs(this.z - vector.z) < epsilon;
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  negate(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  dot(vector: Vector3): number {
    return this.x * vector.x +
      this.y * vector.y +
      this.z * vector.z;
  }

  cross(vector: Vector3): Vector3 {
    return new Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }

  lerp(v2: Vector3, percent: number): Vector3 {
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    return new Vector3(
      this.x + (v2.x - this.x) * percent,
      this.y + (v2.y - this.y) * percent,
      this.z + (v2.z - this.z) * percent
    );
  }

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  toString(): string {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
  }


  static get zero(): Vector3 { return new Vector3(0, 0, 0); }
  static get one(): Vector3 { return new Vector3(1, 1, 1); }

  static get up(): Vector3 { return new Vector3(0, 1, 0); }
  static get down(): Vector3 { return new Vector3(0, -1, 0); }
  static get forward(): Vector3 { return new Vector3(0, 0, -1); }
  static get back(): Vector3 { return new Vector3(0, 0, 1); }
  static get left(): Vector3 { return new Vector3(-1, 0, 0); }
  static get right(): Vector3 { return new Vector3(1, 0, 0); }

  static add(v1: Vector3, v2: Vector3): Vector3 { return v1.add(v2); }
  static subtract(v1: Vector3, v2: Vector3): Vector3 { return v1.subtract(v2); }
  static multiply(v1: Vector3, scalar: number): Vector3 { return v1.multiply(scalar); }
  static divide(v1: Vector3, scalar: number): Vector3 { return v1.divide(scalar); }

  static normalize(vector: Vector3): Vector3 { return vector.normalize(); }
  static magnitude(vector: Vector3): number { return vector.magnitude(); }
  static distance(v1: Vector3, v2: Vector3): number { return v1.distanceTo(v2); }
  static equals(v1: Vector3, v2: Vector3, epsilon: number = vector3Epsilon): boolean { return v1.equals(v2, epsilon); }

  static clone(vector: Vector3): Vector3 { return vector.clone(); }
  static negate(vector: Vector3): Vector3 { return vector.negate(); }

  static dot(v1: Vector3, v2: Vector3): number { return v1.dot(v2); }
  static cross(v1: Vector3, v2: Vector3): Vector3 { return v1.cross(v2); }
  static lerp(v1: Vector3, v2: Vector3, percent: number): Vector3 { return v1.lerp(v2, percent); }

  static toArray(vector: Vector3): number[] { return vector.toArray(); }
  static toString(vector: Vector3): string { return vector.toString(); }


  addInPlace(vector: Vector3): this {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }

  subtractInPlace(vector: Vector3): this {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }

  multiplyInPlace(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  divideInPlace(scalar: number): this {
    if (scalar === 0) throw new Error("Division by zero");
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  normalizeInPlace(): this {
    const mag = this.magnitude();
    if (mag === 0) throw new Error("Cannot normalize zero vector");
    return this.divideInPlace(mag);
  }

  negateInPlace(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
}
