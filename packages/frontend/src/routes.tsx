import React from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'

import { Admin, Trainee, Trainer, Mentor, UserTypeEnum } from './graphql'
import { useAuthentication } from './hooks/use-authentication'
import strings from './locales/localization'
import { AdminEditUserPage } from './pages/admin-edit-user-page'
import { AdminTraineesPage } from './pages/admin-trainees-page'
import { AdminTrainerPage } from './pages/admin-trainer-page'
import { AdminMentorPage } from './pages/admin-mentor-page'
import { AlexaPage } from './pages/alexa-page'
import ArchivePage from './pages/archive-page'
import DashboardPage from './pages/dashboard-page'
import { FAQPage } from './pages/faq-page'
import LoadingPage from './pages/loading-page'
import LoginPage from './pages/login-page'
import MissingPage from './pages/missing-page'
import NoUserPage from './pages/no-user-page'
import { OAuthPage } from './pages/oauth-page'
import OnboardingPage from './pages/onboarding-page'
import ReportPage from './pages/report-page'
import ReportReviewPage from './pages/report-review-page'
import SettingsPage from './pages/settings-page'
import SupportPage from './pages/support-page'
import { TrainerPaperPage } from './pages/trainer-paper-page'
import TraineePage from './pages/trainee-page'
import TrainerReportsPage from './pages/trainer-reports-page'
import { PaperCreateBriefingPage } from './pages/paper-create-briefing-page'
import { PaperBriefingPage } from './pages/paper-briefing-page'
import { TraineePaperPage } from './pages/trainee-paper-page'
import { MentorPaperPage } from './pages/mentor-paper-page'

type RoutesProps = {
  currentUser?:
    | Pick<Trainee, 'language' | 'type' | 'course' | '__typename'>
    | (Pick<Trainer, 'type' | 'language' | '__typename'> & { trainees: Pick<Trainee, 'id'>[] })
    | Pick<Admin, 'type' | 'language' | '__typename'>
    | Pick<Mentor, 'type' | 'language' | '__typename'>
}

const Routes: React.FunctionComponent<RoutesProps> = ({ currentUser }) => {
  const { authenticated } = useAuthentication()

  const routes: RouteProps[] = []

  if (authenticated === 'unauthenticated') {
    routes.push({ component: LoginPage })
  } else if (authenticated === 'loading') {
    routes.push({ component: LoadingPage })
  } else {
    if (currentUser) {
      strings.setLanguage(currentUser.language || navigator.language)
      // Current user was found
      // eslint-disable-next-line no-underscore-dangle
      if (currentUser.type === UserTypeEnum.Trainee && currentUser.__typename === 'Trainee') {
        // Routes for trainees

        routes.push({ path: '/paper', exact: true, component: TraineePaperPage })

        if (currentUser.course) {
          // Trainee is ready to go
          routes.push({ path: '/', exact: true, component: DashboardPage })
          routes.push({ path: '/archive', component: ArchivePage })
          routes.push({ path: '/report/:year/:week', component: ReportPage })
          routes.push({ path: '/report/missing', component: MissingPage })

          routes.push({ path: '/alexa', component: AlexaPage })
        } else {
          // Trainee need onboarding!
          routes.push({ path: '/', component: OnboardingPage })
        }
      }

      if (currentUser.type === UserTypeEnum.Trainer && currentUser.__typename === 'Trainer') {
        const redirectRoute = currentUser.trainees.length > 0 ? '/reports' : '/trainees'

        // Routes for trainers
        routes.push({ path: '/', exact: true, render: () => <Redirect to={redirectRoute} /> })

        routes.push({ path: '/paper', exact: true, component: TrainerPaperPage })
        routes.push({ path: '/paper/createBriefing', exact: true, component: PaperCreateBriefingPage })
        routes.push({ path: '/paper/briefing/:paperId', exact: true, component: PaperBriefingPage })

        routes.push({ path: '/reports/:trainee?', exact: true, component: TrainerReportsPage })
        routes.push({ path: '/reports/:trainee/:year/:week', component: ReportReviewPage })
        routes.push({ path: '/trainees/:trainee?', component: TraineePage })
      }

      if (currentUser.type === UserTypeEnum.Mentor && currentUser.__typename === 'Mentor') {
        // Routes for Mentor
        routes.push({ path: '/paper', exact: true, component: MentorPaperPage })
      }

      if (currentUser.type === UserTypeEnum.Admin && currentUser.__typename === 'Admin') {
        // Routes for admins

        routes.push({ path: '/', exact: true, render: () => <Redirect to="/trainer" /> })

        routes.push({ path: '/trainer', exact: true, component: AdminTrainerPage })
        routes.push({ path: '/trainer/:id', component: AdminEditUserPage })

        routes.push({ path: '/mentor', exact: true, component: AdminMentorPage })
        routes.push({ path: '/mentor/:id', component: AdminEditUserPage })

        routes.push({ path: '/trainees', exact: true, component: AdminTraineesPage })
        routes.push({ path: '/trainees/:id', component: AdminEditUserPage })
      }

      routes.push({ path: '/settings', component: SettingsPage })
      routes.push({ path: '/oauth', component: OAuthPage })
    }

    if (!currentUser) {
      // No user was found
      routes.push({ component: NoUserPage, path: '/no-user-found' })
    }
  }

  routes.push({ path: '/support', component: SupportPage })
  routes.push({ path: '/faq', component: FAQPage })

  routes.push({ path: '/', component: MissingPage })
  return (
    <Switch>
      {routes.map((routeProps, index) => (
        <Route {...routeProps} key={index} />
      ))}
    </Switch>
  )
}

export default Routes
