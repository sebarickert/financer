export const generateUserPreferenceViewTransitionName = (
  type:
    | 'dashboard'
    | 'transactions-and-statistics'
    | 'default-account'
    | 'market-update',
) => ({
  title: `user-preference-${type}-title`,
});
