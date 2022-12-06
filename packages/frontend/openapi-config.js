module.exports = {
  schemaFile: './redux/schema/api-docs.json',
  apiFile: './redux/api/emptyPortalApi.ts',
  apiImport: 'emptyPortalApi',
  outputFile: './redux/api/generated/portalApi.ts',
  exportName: 'portalApi',
  hooks: true,
};