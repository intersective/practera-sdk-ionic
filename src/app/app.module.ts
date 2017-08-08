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
// services
import { AchievementService } from '../services/achievement.service';
import { ActivityService } from '../services/activity.service';
import { AssessmentService } from '../services/assessment.service';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { CharacterService } from '../services/character.service';
import { EventService } from '../services/event.service';
import { FilestackService } from '../shared/filestack/filestack.service';
import { GroupEmitterService } from '../components/questions/group-emitter.service';
import { LevelService } from '../services/level.service';
import { MilestoneService } from '../services/milestone.service';
import { NotificationService } from '../shared/notification/notification.service';
import { RankingService } from '../services/ranking.service';
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
// unused but necessary for build
import { AssessmentsComponent } from '../components/assessments/assessments.component';
import { LevelsComponent } from '../components/levels/levels';
import { QuestionComponent } from '../components/question/question.component';

// pages
import { AchievementsViewPage } from '../pages/achievements/view/achievements-view.page';
import { ActivitiesListPage } from '../pages/activities/list/list.page';
import { ActivityListPopupPage } from '../pages/activities/list/popup';
import { ActivitiesViewModalPage } from '../pages/activities/view/activities-view-modal.page';
import { ActivitiesViewPage } from '../pages/activities/view/activities-view.page';
import { ActivitiesClassicListPage } from '../pages/activities-classic/list/activities-classic-list.page';
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
import { GalleryPage } from '../pages/gallery/gallery';
import { LeaderboardSettingsPage } from '../pages/settings/leaderboard/leaderboard-settings.page';
import { LevelsListPage } from '../pages/levels/list/list';
import { LoginModalPage } from '../pages/login-modal/login-modal';
import { LoginPage } from '../pages/login/login';
import { MagicLinkPage } from '../pages/magic-link/magic-link';
import { RankingBadgesPage } from '../pages/rankings/view/ranking-badges';
import { RankingDetailsPage } from '../pages/rankings/view/ranking-details.page';
import { RankingsPage } from '../pages/rankings/list/rankings.page';
import { RegisterPage } from '../pages/registration/register.page';
import { RegistrationModalPage } from '../pages/registration/modal';
import { RegistrationPage } from '../pages/registration/registration.page';
import { ResetpasswordModelPage } from '../pages/resetpassword-model/resetpassword-model';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SettingsPage } from '../pages/settings/settings.page';
import { SidenavPage } from '../pages/sidenav/sidenav';
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
import { CalendarPipe } from '../pipes/CalendarPipe';
import { DateFormatPipe } from '../pipes/DateFormat';
import { OrderByPipe } from '../pipes/OrderBy';
import { UrlFilterPipe } from '../pipes/urlfilter.pipe';

// configs
import { default as Configure } from '../configs/config';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n-", ".json");
}

@NgModule({
  declarations: [
    AchievementsViewPage,
    ActivitiesClassicListPage,
    ActivitiesListPage,
    ActivitiesViewModalPage,
    ActivitiesViewPage,
    ActivityListPopupPage,
    AssessmentsComponent,
    AssessmentsGroupPage,
    AssessmentsPage,
    CalendarPipe,
    DateFormatPipe,
    EventCheckinPage,
    EventComponent,
    EventsComponent,
    EventsDownloadPage,
    EventsListPage,
    EventsPreviewPage,
    EventsViewPage,
    EventsBookingPage,
    FeedbackComponent,
    FileQuestionComponent,
    ForgetPasswordPage,
    GalleryPage,
    LeaderboardSettingsPage,
    LevelComponent,
    LevelsComponent,
    LevelsListPage,
    LoadingMarkerComponent,
    LockerComponent,
    LoginModalPage,
    LoginPage,
    MagicLinkPage,
    MemberComponent,
    ModalComponent,
    MultipleQuestionComponent,
    MyApp,
    OrderByPipe,
    OneofQuestionComponent,
    PhotoComponent,
    QuestionComponent,
    QuestionGroupComponent,
    RankingBadgesPage,
    RankingDetailsPage,
    RankingsPage,
    RegisterPage,
    RegistrationModalPage,
    RegistrationPage,
    ResetpasswordModelPage,
    ResetPasswordPage,
    SettingsPage,
    SidenavPage,
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
    UrlFilterPipe,
    EscapeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    TestModule,
    CacheModule,
    NotificationModule,
    FormsModule,
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
        }
      ]
    })
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    AchievementsViewPage,
    ActivitiesClassicListPage,
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
    GalleryPage,
    LeaderboardSettingsPage,
    LevelComponent,
    LevelsListPage,
    LoadingMarkerComponent,
    LockerComponent,
    LoginModalPage,
    LoginPage,
    MagicLinkPage,
    ModalComponent,
    MyApp,
    RankingBadgesPage,
    RankingDetailsPage,
    RankingsPage,
    RegisterPage,
    RegistrationModalPage,
    RegistrationPage,
    ResetpasswordModelPage,
    ResetPasswordPage,
    SettingsPage,
    SidenavPage,
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
    { provide: RankingService, useClass: RankingService },
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
