import { NextResponse } from 'next/server';

import { revalidateFullAppCache } from '$actions/revalidateFullAppCache';

// eslint-disable-next-line import/prefer-default-export
export async function POST() {
  try {
    await revalidateFullAppCache();

    return NextResponse.json({ message: 'Cache revalidated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 },
    );
  }
}
