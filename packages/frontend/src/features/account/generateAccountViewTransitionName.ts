export const generateAccountViewTransitionName = (id: string) => ({
  name: `account-${id}-name`,
  balance: `account-${id}-balance`,
  type: `account-${id}-type`,
  typeIcon: `account-${id}-type-icon`,
});
