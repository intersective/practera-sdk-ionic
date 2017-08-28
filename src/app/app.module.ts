// libs
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, OnInit } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CacheModule } from '../shared/cache/cache.module';
import { NotificationModule } from '../shared/notification/notification.module';
import { MyApp } from './app.component';
import { FilestackModule } from '../shared/filestack/filestack.module';
import { UtilsModule } from '../shared/utils/utils.module';
import { TestModule } from '../shared/testModules/test.module';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { i18nData } from './assets/i18n-en';
import { TranslationModule } from '../shared/translation/translation.module';
import { MomentModule } from 'angular2-moment';

// services
import { AchievementService } from '../services/achievement.service';
import { ActivityService } from '../services/activity.service';
import { AssessmentService } from '../services/assessment.service';
import { AuthService } from '../services/auth.service';
import { CharacterService } from '../services/character.service';
import { EventService } from '../services/event.service';
import { FilestackService } from '../shared/filestack/filestack.service';
import { GameService } from '../services/game.service';
import { GroupEmitterService } from '../components/questions/group-emitter.service';
import { LevelService } from '../services/level.service';
import { MilestoneService } from '../services/milestone.service';
import { NotificationService } from '../shared/notification/notification.service';
import { RequestModule } from '../shared/request/request.module';
import { ResponsiveService } from '../services/responsive.service';
import { SessionService } from '../services/session.service';
import { SubmissionService } from '../services/submission.service';
import { TeamService } from '../services/team.service';
import { WindowRef } from '../shared/window';

// components
import { ModalComponent } from '../shared/notification/modal.component';
import { QuestionGroupComponent } from '../components/questionGroup/questionGroup.component';
import { EventComponent } from '../components/event/event.component';
import { LevelComponent } from '../components/level/level';
import { LoadingMarkerComponent } from '../components/loadingMarker/loadingMarker';
import { LockerComponent } from '../components/locker/locker';
import { MemberComponent } from '../components/member/member';
import { PhotoComponent } from '../components/photo/photo';
import { TermContentComponent } from '../pages/term-condition/term-content.component';
import { FileQuestionComponent } from '../components/questions/file';
import { OneofQuestionComponent } from '../components/questions/oneof';
import { TextQuestionComponent } from '../components/questions/text';
import { MultipleQuestionComponent } from '../components/questions/multiple';
import { FeedbackComponent } from '../components/questions/feedback';
import { RankIconComponent } from '../components/rank/icon';
import { SegmentComponent } from '../pages/spinwheel/segment.component';
// unused but necessary for build
import { LevelsComponent } from '../components/levels/levels';
import { QuestionComponent } from '../components/question/question.component';
// pages
import { ActivityAchievementModalPage } from '../pages/activities/view/activity-achievement.modal.page';
import { AchievementsViewPage } from '../pages/achievements/view/achievements-view.page';
import { ActivitiesListPage } from '../pages/activities/list/list.page';
import { ActivityListPopupPage } from '../pages/activities/list/popup';
import { ActivitiesViewModalPage } from '../pages/activities/view/activities-view-modal.page';
import { ActivitiesViewPage } from '../pages/activities/view/activities-view.page';
import { AssessmentsPage } from '../pages/assessments/assessments.page';
import { AssessmentsGroupPage } from '../pages/assessments/group/assessments-group.page';
import { EventCheckinPage } from '../pages/events/checkin/event-checkin.page';
import { EventsComponent } from '../components/events/events.component';
import { EventsDownloadPage } from '../pages/events/download/events-download.page';
import { EventsBookingPage } from '../pages/events/booking/booking.page';
import { EventsListPage } from '../pages/events/list/list.page';
import { EventsPreviewPage } from '../pages/events/download/events-preview.page';
import { EventsViewPage } from '../pages/events/view/events-view.page';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { ItemsPopupPage } from '../pages/assessments/popup/items-popup.page';
import { LeaderboardSettingsPage } from '../pages/settings/leaderboard/leaderboard-settings.page';
import { LevelsListPage } from '../pages/levels/list/list';
import { LoginPage } from '../pages/login/login';
import { MagicLinkPage } from '../pages/magic-link/magic-link';
import { PopoverTextPage } from '../pages/activities/list/popover-text';
import { RankingBadgesPage } from '../pages/rankings/view/ranking-badges';
import { RankingDetailsPage } from '../pages/rankings/view/ranking-details.page';
import { RankingsPage } from '../pages/rankings/list/rankings.page';
import { RegisterPage } from '../pages/registration/register.page';
import { RegistrationPage } from '../pages/registration/registration.page';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SettingsPage } from '../pages/settings/settings.page';
import { SidenavPage } from '../pages/sidenav/sidenav';
import { SpinwheelPage } from '../pages/spinwheel/spinwheel.page';
import { SpinwheelPopOverPage } from '../pages/spinwheel/spinwheel-popover.page';
import { TabsPage } from '../pages/tabs/tabs.page';
import { TeamPage } from '../pages/team/team';
import { TermConditionPage } from '../pages/term-condition/term-condition.page';
import { TestPage } from '../pages/tabs/test.page';
import { TutorialPage } from '../pages/settings/tutorial/tutorial.page';
// custom pipes
import { TimeAgoPipe } from '../pipes/timeago';
import { UcfirstPipe } from '../pipes/ucfirst.pipe';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { EscapeHtmlPipe } from '../pipes/keep-html.pipe';
// unused but needed for build
import { OrderByPipe } from '../pipes/OrderBy';

// configs
import { default as Configure } from '../configs/config';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n-", ".json");
}

@NgModule({
  declarations: [
    ActivityAchievementModalPage,
    AchievementsViewPage,
    ActivitiesListPage,
    ActivitiesViewModalPage,
    ActivitiesViewPage,
    ActivityListPopupPage,
    AssessmentsGroupPage,
    AssessmentsPage,
    EventCheckinPage,
    EventComponent,
    EventsComponent,
    EventsDownloadPage,
    EventsListPage,
    EventsPreviewPage,
    EventsViewPage,
    EventsBookingPage,
    FeedbackComponent,
    RankIconComponent,
    FileQuestionComponent,
    ForgetPasswordPage,
    ItemsPopupPage,
    LeaderboardSettingsPage,
    LevelComponent,
    LevelsComponent,
    LevelsListPage,
    LoadingMarkerComponent,
    LockerComponent,
    LoginPage,
    MagicLinkPage,
    MemberComponent,
    ModalComponent,
    MultipleQuestionComponent,
    MyApp,
    OrderByPipe,
    OneofQuestionComponent,
    PhotoComponent,
    PopoverTextPage,
    QuestionComponent,
    QuestionGroupComponent,
    RankingBadgesPage,
    RankingDetailsPage,
    RankingsPage,
    RegisterPage,
    RegistrationPage,
    ResetPasswordPage,
    SettingsPage,
    SidenavPage,
    SpinwheelPage,
    SpinwheelPopOverPage,
    SegmentComponent,
    TabsPage,
    TeamPage,
    TestPage,
    TutorialPage,
    TermConditionPage,
    TermContentComponent,
    TextQuestionComponent,
    TimeAgoPipe,
    TruncatePipe,
    UcfirstPipe,
    EscapeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    CacheModule,
    FormsModule,
    MomentModule,
    NotificationModule,
    TestModule,
    UtilsModule,
    RequestModule.forRoot({
      appKey: Configure.appKey,
      prefixUrl: Configure.prefixUrl
    }),
    FilestackModule.forRoot({
      apikey: Configure.filestack.apiKey
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    TranslationModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        {
          component: LoginPage,
          name: 'Login',
          segment: 'login',
          defaultHistory: [ LoginPage ]
        },
        {
          component: ResetPasswordPage,
          name: 'ResetPassword',
          segment: 'resetpassword', //resetpassword?email=XXX&key=XXX
          defaultHistory: [ ResetPasswordPage ]
        },
        {
          component: MagicLinkPage,
          name: 'MagiclinkPage',
          segment: 'secure/:auth_token', //secure?auth_token=XXXXXX
          defaultHistory: [ MagicLinkPage ]
        },
        {
          component: RegistrationPage,
          name: 'Registration',
          segment: 'registration',
          defaultHistory: [ RegistrationPage ]
        },
        {
          component: TestPage,
          name: 'Testing',
          segment: 'testing',
          defaultHistory: [ TestPage ]
        }
      ]
    })
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    ActivityAchievementModalPage,
    AchievementsViewPage,
    ActivitiesListPage,
    ActivitiesViewModalPage,
    ActivitiesViewPage,
    ActivityListPopupPage,
    AssessmentsGroupPage,
    AssessmentsPage,
    EventCheckinPage,
    EventComponent,
    EventsComponent,
    EventsDownloadPage,
    EventsListPage,
    EventsPreviewPage,
    EventsViewPage,
    ForgetPasswordPage,
    ItemsPopupPage,
    LeaderboardSettingsPage,
    LevelComponent,
    LevelsListPage,
    LoadingMarkerComponent,
    LockerComponent,
    LoginPage,
    MagicLinkPage,
    ModalComponent,
    MyApp,
    PopoverTextPage,
    RankingBadgesPage,
    RankingDetailsPage,
    RankingsPage,
    RegisterPage,
    RegistrationPage,
    ResetPasswordPage,
    SettingsPage,
    SidenavPage,
    SpinwheelPage,
    SpinwheelPopOverPage,
    TabsPage,
    TestPage,
    TermConditionPage,
    TutorialPage,
    TermContentComponent,
  ],
  providers: [
    { provide: AchievementService, useClass: AchievementService },
    { provide: ActivityService, useClass: ActivityService },
    { provide: AssessmentService, useClass: AssessmentService },
    { provide: AuthService, useClass: AuthService },
    { provide: CharacterService, useClass: CharacterService },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: EventService, useClass: EventService },
    { provide: FilestackService, useClass: FilestackService },
    { provide: LevelService, useClass: LevelService },
    { provide: LocationStrategy , useClass: HashLocationStrategy },
    { provide: MilestoneService, useClass: MilestoneService },
    { provide: NotificationService, useClass: NotificationService },
    { provide: ResponsiveService, useClass: ResponsiveService },
    { provide: SessionService, useClass: SessionService },
    { provide: SubmissionService, useClass: SubmissionService },
    { provide: TeamService, useClass: TeamService },
    WindowRef,
    GroupEmitterService,
    GameService,
    // { provide: RequestOptions, useClass: CustomRequestOptions }
  ]
})
export class AppModule {}
