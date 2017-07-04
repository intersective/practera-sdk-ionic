export const loadingMessages = {
  Login: {
    "login": "Logging in ..."
  },
  LoadingSpinner: {
    "loading": "Loading ..."
  },
  Logout: {
    "logout": "See you next time"
  },
  SendingEmail: {
    "send": "Sending email to us ..." 
  },
  SentMessage: { // the reason why this message has been divided into two parts, because of we have a variable (${this.email}) in the middle of message
    "partOne": "We have sent an email to",
    "partTwo": "with a link to log into the system - please check your inbox. If you haven't received an email in a few minutes please check the address you entered and your spam folder."
  },
  SuccessRegistration: {
    "successRegistration": "Your password has been successfully set. You will now be logged in."
  },
  SuccessResetPassword: {
    "successResetPassword": "Password has been changed successfully. Logging in now."
  },
  VerifyUser: {
    "verify": "Verifying user identity ..."
  }
}
export const errMessages = {
  Activities: {
    activities: {
      "empty": "Whoops... no activity has been setup ..."
    },
    achievements: {
      "empty": "Whoops... no achievement has been setup ..."
    },
    assessments: {
      "empty": "Whoops... no assessment has been setup ..."
    }
  },
  DirectLink: {
    "mismatch": "Oops... An error occurred. Please login by typing email and password."
  },
  Events: {
    bookEvents: {
      "book": "Whoops, book event process is failed, please try again later."
    },
    cancelBooking: {
      "cancel": "Whoops, cancel booking event process is failed, please try again later."
    },
    events: {
      "empty": "Whoops... no event has been setup ..."
    }
  },
  General: {
    loading: {
      "load": "Whoops, a connection error occurred. Please try again later."
    },
    empty: {
      "empty": "Whoops... no data has been setup ..."
    }
  },
  Login: {
    "login": "Oops... Invalid email or password, please type it again."
  },
  PasswordValidation: {
    mismatch: {
      "mismatch": "Password mismatch ..."
    },
    minlength: {
      "minlength": "Password minimum length is 8 characters ..."
    }
  },
  Registration: {
    mismatch: {
      "match": "The passwords entered do not match."
    },
    error: {
      "error": "Sorry, something went wrong. Please contact " // after the "contact", the content will be a variable, please check with Registration/model.ts file to view detail
    },
    invalidUser: {
      "account": "Whoops... Account not found. Please contact " // after the "contact", the content will be a variable, please check with Registration/model.ts file to view detail
    },
    noPassword: {
      "password": "Whoopes... Unable to register, invalid password."
    },
    alreadyRegistered: {
      "registered": "This account has already registered. Please type your registered email and password to login."
    }
  },
  ResetPassword: {
    resetLoginFailed: {
      "failed": "Whoops, login failed, please go to login page to sign in."
    },
    invalidLink: {
      "invalid": "Oops... an error occurred, please try again. In 5 seconds you will return to the login page ..."
    }
  }
}