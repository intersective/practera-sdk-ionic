export class Default {
  public helpline = '';

  public notifications = {
    congratulations: {
      id: 1,
      type: 'modal',
      title: 'Congratulations!',
      notification_icon: '/img/status/tick.png',
      description: 'You have unlocked an activity',
      score: '+100 points',
      button_label: 'Got it!',
      button_link: 'app.score'
    },
    my_score: {
      id: 8,
      type: 'modal',
      title: 'My Score',
      notification_icon: '',
      description: 'By completing activities, you will collect points.<br>These points are used to unlock your rewards.',
      score: '',
      button_label: 'Get More Points!',
      button_link: 'app.activities'
    },
    profile_picture: {
      id: 9,
      type: 'modal',
      title: 'Profile Picture',
      notification_icon: '',
      description: 'You can easily connect your LinkedIn account by pressing the \Link Now\ button below.',
      score: '',
      button_label: 'Link Now!',
      button_link: 'app.activities'
    },
    gallery_locked: {
      id: 10,
      type: 'modal',
      title: 'Gallery Locked',
      notification_icon: '/img/status/cross.png',
      description: 'To unlock the Selfie Gallery, you will need to connect your LinkedIn account.',
      score: '',
      button_label: 'Got it!',
      button_link: 'app.activities',
      is_hide_close: true,
      is_history_back: true
    },
    session_ticket: {
      id: 11,
      type: 'modal',
      title: 'Session ticket',
      notification_icon: '',
      description: 'Thank you for registering for the session. This ticket guarantees you a spot in the location. Please have the ticket showing on your screen when you enter the room.<br><br>The ticket expires 5 minutes prior to start of the session. Make sure you arrive before that time!',
      score: '',
      button_label: 'Got it!',
      button_link: 'app.ticket'
    },
    gallery: {
    	id: 12,
    	image_url: '',
    },
    do_activity: {
    	id: 13,
    	type: 'modal',
      title: 'Selfie Activity',
      notification_icon: '',
      description: 'Oops.. Look like missed this one. Please navigate to the activity and submit your selfie or press button below to redirect to the section.',
      score: '',
      button_label: 'Got it!',
      button_link: ''
    },
    level_locked: {
        id: 14,
        type: 'modal',
        title: 'Level Locked',
        notification_icon: '/img/status/cross.png',
        description: 'To unlock the next level, you need to submit your team decision and personal reflection of the previous level.<br><br>Once the team submission has been reviewed, you will unlock your customised next level',
        score: '',
        button_label: 'Got it!',
        button_link: ''
    },
    team_required: {
        id: 15,
        type: 'modal',
        title: 'Team Required',
        notification_icon: '/img/status/cross.png',
        description: 'To unlock the app, you need to join a team.',
        score: '',
        button_label: 'Got it!',
        button_link: ''
    },
    unable_to_login: {
        id: 51,
        type: 'popup',
        title: 'Unable to login',
        description: 'Please make sure you have entered the correct email and password.'
    },
    completed_activity: {
        id: 52,
        type: 'alert',
        title: 'Thank you!',
        description: 'You have completed this activity already.'
    },
    expired_activity: {
        id: 53,
        type: 'alert',
        title: 'This activity has expired!',
        description: 'Please try to keep tabs on all the upcoming activities.'
    },
    not_active_activity: {
        id: 54,
        type: 'alert',
        title: 'This activity is not active.',
        description: 'You will be able to check in to this activity after your session has started. Make sure you complete the check-in during your session.'
    },
    unable_book_session: {
        id: 55,
        type: 'alert',
        title: 'Unable to book session',
        description: 'Please try to book the session again.'
    },
    success_submission: {
        id: 56,
        type: 'alert',
        title: 'Submission Successful!',
        description: 'Thank you, submission received!'
    },
    incomplete_submission: {
        id: 57,
        type: 'alert',
        title: 'Incomplete submission',
        description: 'You must answer all questions in order to submit.'
    },
    failed_submission: {
        id: 58,
        type: 'alert',
        title: 'Unable to submit',
        description: 'Please try to resubmit again later.'
    },
    incorrect_entries: {
        id: 59,
        type: 'alert',
        title: 'Missing Info',
        description: 'You need both an email and password to log in.'
    },
    incorrect_email_entry: {
        id: 60,
        type: 'alert',
        title: 'Email not found',
        description: 'We could not find that email in the system.'
    },
    unable_login: {
        id: 61,
        type: 'alert',
        title: 'Unable to login',
        description: 'Please try again later or contact ' + this.helpline + '.'
    },
    reset_password_check_inbox: {
        id: 62,
        type: 'alert',
        title: 'Info',
        description: 'Please check your inbox. We have send you a confirmation email to change your login password.'
    },
    reset_password_unable_send_email: {
        id: 63,
        type: 'alert',
        title: 'Error',
        description: 'Unable to send confirmation email to change your login password.'
    },
    unregistered: {
        id: 64,
        type: 'alert',
        title: 'Invalid Login Details',
        description: 'You need to register first! Your private invitation is in your email inbox (check your spam folder!) or click "forgot password" below to resend.'
    },
    incorrect_credentials: {
        id: 65,
        type: 'alert',
        title: 'Invalid Login Details',
        description: 'Either your email or password is incorrect. Try "Forgot Password" below!'
    },
    confirm_unlink_linkedin: {
        id: 71,
        type: 'confirm',
        title: 'Confirm unlink LinkedIn profile',
        description: 'Are you sure you want to unlink your account from your LinkedIn profile?'
    },
    confirm_change_password: {
        id: 72,
        type: 'confirm',
        title: 'Change password',
        description: 'Are you sure you want to change password?'
    },
    not_active_activity_session: {
        id: 73,
        type: 'alert',
        title: 'Unable to book yet',
        description: 'You will be able to book a seat for this activity 2 weeks prior to the first session'
    },
    session_not_found: {
        id: 74,
        type: 'alert',
        title: 'Unable to load sessions',
        description: 'Please try to access the sessions again.'
    },
    not_started_survey: {
        id: 75,
        type: 'alert',
        title: 'Not started survey',
        description: 'This survey is not started.'
    },
    login_error: {
        id: 76,
        type: 'alert',
        title: 'Session Expired',
        description: 'Account session has expired, please login again.'
    },
    linkedin_failed: {
        id: 77,
        type: 'alert',
        title: 'Unable to link LinkedIn profile',
        description: 'Please try to connect LinkedIn account again later.'
    },
    linkedin_exists: {
        id: 78,
        type: 'alert',
        title: 'Unable to link LinkedIn profile',
        description: 'This profile was linked to another account.'
    },
    refresh_error: {
        id: 79,
        type: 'alert',
        title: 'Glitch in the Matrix',
        description: 'If things look funny just reload your browser.'
    },
    confirm_submission: {
        id: 80,
        type: 'confirm',
        title: 'Confirm submission',
        description: 'Are you sure that you wish to submit? All submissions are final. No resubmissions will be accepted.'
    },
    unable_switch_program: {
        id: 81,
        type: 'alert',
        title: 'Program not ready',
        description: 'You haven\'t have access to next program yet.'
    },
    no_photo_in_gallery: {
        id: 82,
        type: 'modal',
        title: 'Empty gallery',
        notification_icon: '',
        description: 'No photo in your gallery. Please done your check-in activity and visit again.',
        score: '',
        button_label: 'Go to activities',
        button_link: 'app.activities'
    },
    unable_post_chat: {
        id: 83,
        type: 'alert',
        title: 'Unable to submit new message',
        description: 'Something is wrong, please try submitting again later.'
    },
    unable_join_team: {
        id: 84,
        type: 'alert',
        title: 'Unable to join team',
        description: 'Please try to join the team again later.'
    },
    feature_coming_soon: {
        id: 85,
        type: 'alert',
        title: 'Feature coming soon',
        description: 'This feature is still under development... Thanks for your patient.'
    },
    check_in_required: {
        id: 86,
        type: 'popup',
        title: 'No check-in yet',
        description: 'You need to complete check-in.'
    },
    unexpected_enrolment: {
        id: 87,
        type: 'alert',
        title: 'Unexpected enrolment detected',
        description: 'There is a problem with your enrolment. If problem persist, please contact ' + this.helpline + '.'
    },
    required_linkedin: {
        id: 88,
        type: 'alert',
        title: 'No LinkedIn account found',
        description: 'You need link to your LinkedIn account before your continue.'
    },
    login_please_wait: {
        id: 89,
        type: 'popup',
        title: 'Please wait',
        description: 'Please wait 2 minutes before attempting to reset your password again.'
    },
    login_not_registered: {
        id: 90,
        type: 'popup',
        title: 'No Registration',
        description: 'You are not registered in the system. Please contact your program coordinator.'
    },
    login_not_found: {
        id: 91,
        type: 'popup',
        title: 'Invalid email address',
        description: 'Unable to find that email address.'
    },
    login_password_changed: {
        id: 92,
        type: 'popup',
        title: 'Success',
        description: 'Your password was successfully changed. Please log in.'
    },
    element_locked: {
        id: 94,
        type: 'modal',
        title: 'Element Locked',
        notification_icon: '/img/status/cross.png',
        description: 'This part of the app is still locked. You can unlock elements by engaging with the app and completing all tasks.',
        score: '',
        button_label: 'Got it!',
        button_link: ''
    },
    pending_review: {
        id: 95,
        type: 'modal',
        title: 'Pending Review',
        notification_icon: '/img/status/cross.png',
        description: 'Your submission has been received and an industry expert will provide feedback shortly. Based on weather or not your argument was convincing, you will unlock your custom path which is different to other teams!',
        score: '',
        button_label: 'Got it!',
        button_link: ''
    },
    team_submission: {
      id: 102,
      type: 'modal',
      title: 'Team Submission',
      notification_icon: '',
      description: 'Thank you for your team submission! Each team member will receive an email once the submission has been reviewed by an industry expert.<br><br>Please let your team members know and enjoy the rest of the program!',
      score: '',
      button_label: 'Got it!',
      button_link: 'p2.overview'
    },
    score_change: {
      id: 103,
      type: 'modal',
      title: 'You Earned Points',
      notification_icon: '',
      description: 'You have earned more points since you last logged on! You have earned the following additional points!',
      score: 'xxx points',
      button_label: 'Got it!',
      button_link: 'p2.home'
    },
    p2_100_points: {
      id: 104,
      type: 'modal',
      title: 'Congratulations!',
      notification_icon: '/img/status/tick.png',
      description: 'You have completed an activity! You are one step closer to the next gem - keep up the good work!',
      score: '+100 points',
      button_label: 'See Score',
      button_link: 'p2.home',
    },
    p2_add_points: {
      id: 105,
      type: 'modal',
      title: 'Congratulations!',
      notification_icon: '/img/status/tick.png',
      description: 'You have completed an activity! You are one step closer to the next gem - keep up the good work!',
      score: '+200 points',
      button_label: 'See Score',
      button_link: 'p2.home'
    },
    submission_exist: {
      id: 106,
      type: 'popup',
      title: 'Activity Complete',
      description: 'You have already completed this activity.'
    },
    team_submission_exist: {
      id: 107,
      type: 'popup',
      title: 'Team Activity Complete',
      description: 'One of your team members has already completed this team activity.'
    },
    linkedin_profile_fail: {
        id: 108,
        type: 'popup',
        title: 'Missing Profile Picture',
        description: 'You must have a profile picture in your LinkedIn account to complete this task. Please update your LinkedIn profile.'
    },
    unexpected_error: {
        id: 109,
        type: 'alert',
        title: 'Glitch in the Matrix',
        description: 'An unexpected error occured. Please try to refresh your browser.'
    },
    bad_connection: {
        id: 110,
        type: 'alert',
        title: 'Bad Connection',
        description: 'The connection is experiencing dropouts. Please try to refresh your browser.'
    },
    api_timeout: {
        id: 111,
        type: 'alert',
        title: 'API Timeout',
        description: 'It took too long getting a response from the server, please try again later. If problem persist, please contact ' + this.helpline + '.'
    },
    incorrect_program_selected: {
      id: 112,
      type: 'popup',
      title: 'Invalid Program',
      description: 'Please select a valid program.'
    },
    incorrect_timelines_loaded: {
      id: 113,
      type: 'popup',
      title: 'API Error',
      description: 'Your user data was not properly loaded, please try to re-login to refresh the user data.'
    },
    timeline_state: {
      id: 114,
      type: 'popup',
      title: 'Inactive Program',
      description: 'Current Program isn\'t active. Please contact your program coordinator for more detail.'
    },
    congratulations_volunteer_activity: {
      id: 115,
      type: 'modal',
      title: 'Congratulations!',
      notification_icon: '/img/status/tick.png',
      description: 'You have unlocked an activity',
      button_label: 'Got it!',
      button_link: 'app.score'
    }
  }
}
