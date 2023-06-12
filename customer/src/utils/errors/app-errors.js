const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class BaseError extends Error {
  constructor(
    name,
    statusCode,
    description,
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

//API ERROR
class ApiError extends BaseError{
  constructor(description='API ERROR'){
     super('API INTERNAL ERROR',this.statusCode.INTERNAL_ERROR,description);
  }
}

//Validation error:
class ValidationError extends BaseError{
  constructor(description='BAD REQUEST'){
     super('BAD REQUEST',this.statusCode.BAD_REQUEST,description);
  }
}

//NOT FOUND
class NotFound extends BaseError{
  constructor(description='NOT FOUND'){
     super('NOT FOUND',this.statusCode.NOT_FOUND,description);
  }
}

//ACCESS DENIED
class AuthorizationError extends BaseError{
  constructor(description='AUTHORIZATION ERROR'){
     super('AUTHORIZATION ERROR',this.statusCode.UN_AUTHORISED,description);
  }
}

module.exports={
  ApiError,
  ValidationError,
  NotFound,
  AuthorizationError
}