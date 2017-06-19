class App {
  max_achievable_points: number = 0;
}

class User {
  name: string = null;
  email: string = null;
  image: string = null;
  token: string = null;
  linkedin_url: string = null;
  timelines: any = [];
  filestackHash: string = 'usertesthash';
  program_id: number = null;
  experience_id: number = null;
  timeline_id: number = null;
  project_id: number = null;
  total_points: number = 0;
  history_score: number = 0;
  tutorial: boolean = false;
  currentProgram: any = {};
  currentTimeline: any = {};
  team: any = {};
}

export class Cache {
  app: App;
  user: User;
  timeline_id: Number;
  // @TODO: Add more later
}
