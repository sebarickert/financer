module.exports = {
  schemaFile: './src/redux/schema/api-spec.json',
  apiFile: './src/redux/api/emptyFinancerApi.ts',
  apiImport: 'emptyFinancerApi',
  outputFile: './src/redux/api/generated/financerApi.ts',
  exportName: 'financerApi',
  hooks: true,
};