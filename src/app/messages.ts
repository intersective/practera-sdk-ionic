export const generalVariableMessages = {
  helpMail: {
    "email": "help@support.com"
  }
}
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
    "mismatch": "Oops... The link to log you in appears to be broken. Please login by typing your email and password."
  },
  Events: {
    bookEvents: {
      "book": "Whoops, booking of an event has failed, please try again later."
    },
    cancelBooking: {
      "cancel": "Whoops, we could not cancel your booking for this event, please try again later."
    },
    events: {
      "empty": "Whoops... no event has been setup ..."
    },
    filter: {
      "empty": "There are no scheduled events available. Please check back later.",
      "noBookings": `You have no bookings. Tap on "Browse" and book an event now to enhance your skills.`,
      "noAttended": "You have not attended any events yet."
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
      "mismatch": "You must enter matching passwords. Please Try again."
    },
    minlength: {
      "minlength": "The minimum length allowed for a password is 8 characters."
    }
  },
  Registration: {
    mismatch: {
      "mismatch": "The passwords you have entered do not match each other. Please enter the same password."
    },
    error: {
      "error": "Sorry, something has gone wrong in processing your registration. Please try again or contact " // after the "contact", the content will be a variable, please check with Registration/model.ts file to view detail
    },
    invalidUser: {
      "account": "Whoops... You do not have a account. To have one set up please contact " // after the "contact", the content will be a variable, please check with Registration/model.ts file to view detail
    },
    noPassword: {
      "password": "Whoops... Sorry, we have been unable to register you. You must enter a valid password."
    },
    alreadyRegistered: {
      "registered": "You have already registered. Please type the email address and password you registered with to login."
    },
    verifyFailed: {
      "verifyfailed": "Sorry, verification failed, please resend your email and password."
    }
  },
  ResetPassword: {
    resetLoginFailed: {
      "failed": "Whoops, we were unable to reset your password. Please try again."
    },
    invalidLink: {
      "invalid": "Oops... The log in link is broken. You will be redirected to the login page. Try again with your username and password."
    }
  },
  TermConditions: {
    disagreement: {
      "noAccepted": "You must agree to the Terms and Conditions."
    },
    verifyFailed: {
      "verifyfailed": "Oops... Registration verification has failed. Please try again later."
    }
  }
}