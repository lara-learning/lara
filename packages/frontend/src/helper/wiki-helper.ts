export const isWikiFeatureEnabled = (): boolean => {
  return ENVIRONMENT.nodeEnv === 'development' || ENVIRONMENT.nodeEnv === 'staging'
}
