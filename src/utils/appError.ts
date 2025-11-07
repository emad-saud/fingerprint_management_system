class AppError extends Error {
  public readonly status: string;
  public readonly statusCode?: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = this.statusCode >= 500 ? "fail" : "error";
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
