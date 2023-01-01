import { financerApi } from '../generated/financerApi';

enum ApiTag {
  ACCOUNT = 'accounts',
}

financerApi.enhanceEndpoints({
  addTagTypes: Object.values(ApiTag),
  endpoints: {
    accountsFindAllByUser: {
      providesTags: (res) => [
        ApiTag.ACCOUNT,
        { type: ApiTag.ACCOUNT, id: 'LIST' },
        { type: ApiTag.ACCOUNT, id: `PAGE-${res?.currentPage}` },
        ...(res?.data.map(({ _id }) => ({ type: ApiTag.ACCOUNT, id: _id })) ??
          []),
      ],
    },
  },
});
