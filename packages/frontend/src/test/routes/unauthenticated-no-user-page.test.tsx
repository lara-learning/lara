import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

jest.mock('../../hooks/use-authentication', () => ({
  useAuthentication: () => ({ authenticated: 'unauthenticated' }),
}))

jest.mock('../../graphql', () => ({
  UserTypeEnum: { Trainee: 'Trainee', Trainer: 'Trainer', Admin: 'Admin' },
}))

jest.mock('../../locales/localization', () => ({
  __esModule: true,
  default: { setLanguage: jest.fn() },
}))

jest.mock('../../helper/wiki-helper', () => ({
  isWikiFeatureEnabled: () => false,
}))

jest.mock('../../pages/login-page', () => ({
  __esModule: true,
  default: () => <div>LoginPage</div>,
}))

jest.mock('../../pages/no-user-page', () => ({
  __esModule: true,
  default: () => <div>NoUserPage</div>,
}))

jest.mock('../../pages/loading-page', () => ({
  __esModule: true,
  default: () => <div>LoadingPage</div>,
}))

jest.mock('../../pages/missing-page', () => ({
  __esModule: true,
  default: () => <div>MissingPage</div>,
}))

jest.mock('../../pages/admin-edit-user-page', () => ({ AdminEditUserPage: () => null }))
jest.mock('../../pages/admin-trainees-page', () => ({ AdminTraineesPage: () => null }))
jest.mock('../../pages/admin-trainer-page', () => ({ AdminTrainerPage: () => null }))
jest.mock('../../pages/admin-admins-page', () => ({ AdminAdminsPage: () => null }))
jest.mock('../../pages/alexa-page', () => ({ AlexaPage: () => null }))
jest.mock('../../pages/archive-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/dashboard-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/faq-page', () => ({ FAQPage: () => null }))
jest.mock('../../pages/oauth-page', () => ({ OAuthPage: () => null }))
jest.mock('../../pages/onboarding-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/report-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/report-review-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/settings-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/support-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/trainee-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/trainer-reports-page', () => ({ __esModule: true, default: () => null }))
jest.mock('../../pages/azubi-wiki-page', () => ({ __esModule: true, default: () => null }))

import AppRoutes from '../../routes'

const renderAt = (path: string): string =>
  renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  )

describe('unauthenticated NoUserPage routing', () => {
  it('renders NoUserPage at /no-user-found without marking the user authenticated', () => {
    expect(renderAt('/no-user-found')).toContain('NoUserPage')
    expect(renderAt('/no-user-found')).not.toContain('LoginPage')
  })

  it('still renders LoginPage for other unauthenticated routes', () => {
    expect(renderAt('/')).toContain('LoginPage')
    expect(renderAt('/settings')).toContain('LoginPage')
  })
})
