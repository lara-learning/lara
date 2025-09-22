import React from 'react'
import { Navigate, Route, Routes } from 'react-router'

import { Admin, Trainee, Trainer, UserTypeEnum } from './graphql'
import { useAuthentication } from './hooks/use-authentication'
import strings from './locales/localization'
import { AdminEditUserPage } from './pages/admin-edit-user-page'
import { AdminTraineesPage } from './pages/admin-trainees-page'
import { AdminTrainerPage } from './pages/admin-trainer-page'
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
import TraineePage from './pages/trainee-page'
import TrainerReportsPage from './pages/trainer-reports-page'
import AzubiWikiPage from './pages/azubi-wiki-page'
import { isWikiFeatureEnabled } from './helper/wiki-helper'

type RoutesProps = {
  currentUser?:
    | Pick<Trainee, 'language' | 'type' | 'course' | '__typename'>
    | (Pick<Trainer, 'type' | 'language' | '__typename'> & { trainees: Pick<Trainee, 'id'>[] })
    | Pick<Admin, 'type' | 'language' | '__typename'>
}

const AppRoutes: React.FunctionComponent<RoutesProps> = ({ currentUser }) => {
  const { authenticated } = useAuthentication()

  if (authenticated === 'unauthenticated') {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  if (authenticated === 'loading') {
    return (
      <Routes>
        <Route path="*" element={<LoadingPage />} />
      </Routes>
    )
  }

  if (currentUser) {
    strings.setLanguage(currentUser.language || navigator.language)

    return (
      <Routes>
        {/* Common Routes */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/oauth" element={<OAuthPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Trainee Routes */}
        {currentUser.type === UserTypeEnum.Trainee && currentUser.__typename === 'Trainee' && (
          <>
            {currentUser.course ? (
              <>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/report/:year/:week" element={<ReportPage />} />
                <Route path="/report/missing" element={<MissingPage />} />
                <Route path="/alexa" element={<AlexaPage />} />
                {isWikiFeatureEnabled() && <Route path="/wiki" element={<AzubiWikiPage />} />}
              </>
            ) : (
              <Route path="/" element={<OnboardingPage />} />
            )}
          </>
        )}

        {/* Trainer Routes */}
        {currentUser.type === UserTypeEnum.Trainer && currentUser.__typename === 'Trainer' && (
          <>
            <Route path="/" element={<Navigate to={currentUser.trainees.length > 0 ? '/reports' : '/trainees'} />} />
            <Route path="/reports/:trainee?" element={<TrainerReportsPage />} />
            <Route path="/reports/:trainee/:year/:week" element={<ReportReviewPage />} />
            <Route path="/trainees/:trainee?" element={<TraineePage />} />
          </>
        )}

        {/* Admin Routes */}
        {currentUser.type === UserTypeEnum.Admin && currentUser.__typename === 'Admin' && (
          <>
            <Route path="/" element={<Navigate to="/trainer" />} />
            <Route path="/trainer" element={<AdminTrainerPage />} />
            <Route path="/trainer/:id" element={<AdminEditUserPage />} />
            <Route path="/trainees" element={<AdminTraineesPage />} />
            <Route path="/trainees/:id" element={<AdminEditUserPage />} />
          </>
        )}

        {/* Fallback Route */}
        <Route path="*" element={<MissingPage />} />
      </Routes>
    )
  }

  // No user found
  return (
    <Routes>
      <Route path="/no-user-found" element={<NoUserPage />} />
      <Route path="*" element={<MissingPage />} />
    </Routes>
  )
}

export default AppRoutes
