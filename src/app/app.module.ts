// libs
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, OnInit } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CacheModule } from '../shared/cache/cache.module';
import { NotificationModule } from '../shared/notification/notification.module';
import { MyApp } from './app.component';
import { FilepickerModule } from '../shared/filepicker/filepicker.module';
import { UtilsModule } from '../shared/utils/utils.module';
import { TestModule } from '../shared/testModules/test.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { i18nData } from './assets/i18n-en';
import { TranslationModule } from '../shared/translation/translation.module';
import { MomentModule } from 'angular2-moment';
import { WindowRef } from '../shared/window';
// services
import { AchievementService } from '../services/achievement.service';
import { ActivityService } from '../services/activity.service';
import { AppService } from '../services/app.service';
import { AssessmentService } from '../services/assessment.service';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { FilepickerService } from '../shared/filepicker/filepicker.service';
import { GameService } from '../services/game.service';
import { GroupEmitterService } from '../components/questions/group-emitter.service';
import { LevelService } from '../services/level.service';
import { MilestoneService } from '../services/milestone.service';
import { NotificationService } from '../shared/notification/notification.service';
import { RequestModule } from '../shared/request/request.module';
import { SessionService } from '../services/session.service';
import { SubmissionService } from '../services/submission.service';
import { TeamService } from '../services/team.service';
// components
import { EventComponent } from '../components/event/event.component';
import { FeedbackComponent } from '../components/questions/feedback';
import { FileQuestionComponent } from '../components/questions/file';
import { LevelComponent } from '../components/level/level';
import { LoadingMarkerComponent } from '../components/loadingMarker/loadingMarker';
import { LockerComponent } from '../components/locker/locker';
import { MemberComponent } from '../components/member/member';
import { ModalComponent } from '../shared/notification/modal.component';
import { MultipleQuestionComponent } from '../components/questions/multiple';
import { OneofQuestionComponent } from '../components/questions/oneof';
import { PhotoComponent } from '../components/photo/photo';
import { QuestionGroupComponent } from '../components/question-group/question-group.component';
import { TextQuestionComponent } from '../components/questions/text';
// pages
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
import { EventsListPage } from '../pages/events/list/list.page';
import { EventsPreviewPage } from '../pages/events/download/events-preview.page';
import { EventsViewPage } from '../pages/events/view/events-view.page';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { GalleryPage } from '../pages/gallery/gallery';
import { ItemsPopupPage } from '../pages/assessments/popup/items-popup.page';
import { LeaderboardSettingsPage } from '../pages/settings/leaderboard/leaderboard-settings.page';
import { LevelsListPage } from '../pages/levels/list/list';
import { LoginPage } from '../pages/login/login';
import { MagicLinkPage } from '../pages/magic-link/magic-link';
import { RankingBadgesPage } from '../pages/rankings/view/ranking-badges';
import { RankingDetailsPage } from '../pages/rankings/view/ranking-details.page';
import { RankingsPage } from '../pages/rankings/list/rankings.page';
import { RegisterPage } from '../pages/registration/register.page';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SettingsPage } from '../pages/settings/settings.page';
import { SidenavPage } from '../pages/sidenav/sidenav';
import { TabsPage } from '../pages/tabs/tabs.page';
import { TeamPage } from '../pages/team/team';
import { TermsConditionsPage } from '../pages/registration/terms-conditions/terms-conditions.page';
import { TestPage } from '../pages/tabs/test.page';
import { TutorialPage } from '../pages/settings/tutorial/tutorial.page';
// custom pipes
import { EscapeHtmlPipe } from '../pipes/keep-html.pipe';
import { TimeAgoPipe } from '../pipes/timeago';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { UcfirstPipe } from '../pipes/ucfirst.pipe';
// configs
import { default as Configure } from '../configs/config';
// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n-", ".json");
}

@NgModule({
  declarations: [
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
    FeedbackComponent,
    FileQuestionComponent,
    ForgetPasswordPage,
    GalleryPage,
    ItemsPopupPage,
    LeaderboardSettingsPage,
    LevelComponent,
    LevelsListPage,
    LoadingMarkerComponent,
    LockerComponent,
    LoginPage,
    MagicLinkPage,
    MemberComponent,
    ModalComponent,
    MultipleQuestionComponent,
    MyApp,
    OneofQuestionComponent,
    PhotoComponent,
    QuestionGroupComponent,
    RankingBadgesPage,
    RankingDetailsPage,
    RankingsPage,
    RegisterPage,
    ResetPasswordPage,
    SettingsPage,
    SidenavPage,
    TabsPage,
    TeamPage,
    TestPage,
    TutorialPage,
    TermsConditionsPage,
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
    HttpClientModule,
    UtilsModule,
    TestModule,
    RequestModule.forRoot({
      appKey: Configure.appKey,
      prefixUrl: Configure.prefixUrl
    }),
    FilepickerModule.forRoot({
      apikey: Configure.filestack.apiKey
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
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
          component: RegisterPage,
          name: 'Registration',
          segment: 'registration',
          defaultHistory: [ RegisterPage ]
        },
        {
          component: TestPage,
          name: 'Testing',
          segment: 'test',
          defaultHistory: [TestPage]
        }
      ]
    })
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
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
    GalleryPage,
    LeaderboardSettingsPage,
    LevelComponent,
    LevelsListPage,
    LoadingMarkerComponent,
    LockerComponent,
    LoginPage,
    MagicLinkPage,
    ModalComponent,
    MyApp,
    RankingBadgesPage,
    RankingDetailsPage,
    RankingsPage,
    RegisterPage,
    ResetPasswordPage,
    SettingsPage,
    SidenavPage,
    TabsPage,
    TestPage,
    TermsConditionsPage,
    TutorialPage,
  ],
  providers: [
    { provide: AchievementService, useClass: AchievementService },
    { provide: ActivityService, useClass: ActivityService },
    { provide: AppService, useClass: AppService },
    { provide: AssessmentService, useClass: AssessmentService },
    { provide: AuthService, useClass: AuthService },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: EventService, useClass: EventService },
    { provide: FilepickerService, useClass: FilepickerService },
    { provide: LevelService, useClass: LevelService },
    { provide: LocationStrategy , useClass: HashLocationStrategy },
    { provide: MilestoneService, useClass: MilestoneService },
    { provide: NotificationService, useClass: NotificationService },
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
