import { NextResponse } from 'next/server';

import { clearAllCaches } from '$ssr/api/clear-cache';

// eslint-disable-next-line import/prefer-default-export
export async function POST() {
  try {
    await clearAllCaches();

    return NextResponse.json({ message: 'Cache revalidated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 },
    );
  }
}
