import { NextResponse } from 'next/server';

import { revalidateFullAppCache } from '@/api-service';

// Needed for E2E tests.
export async function POST() {
  try {
    await revalidateFullAppCache();

    return NextResponse.json({ message: 'Cache revalidated' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 },
    );
  }
}
