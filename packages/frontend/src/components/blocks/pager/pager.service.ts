import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

import { CustomHeader } from 'src/types/custom-headers';

export type PagerOptions = {
  nextPage: {
    load(): Promise<void>;
    isAvailable: boolean;
  };
  previousPage: {
    load(): Promise<void>;
    isAvailable: boolean;
  };
  pageCount?: number;
  currentPage?: number;
};

// TODO rebuild pager concept and control flow to work better with new SSR approach

export class PagerService {
  public static getCurrentDateFilter(): Date {
    const headersList = headers();
    const searchParams = new URLSearchParams(
      headersList.get(CustomHeader.QUERY) ?? '',
    );

    const date = searchParams.get('date');

    if (!date) {
      return new Date();
    }

    return new Date(date);
  }

  private static endOfMonth(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    newDate.setDate(0);

    return newDate;
  }

  private static gotoYearMonthPage(date: Date): void {
    const headersList = headers();
    const searchParams = new URLSearchParams(
      headersList.get(CustomHeader.QUERY) ?? '',
    );
    const pathname = headersList.get(CustomHeader.PATHNAME) ?? '';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const dateString = `${year}-${month}`;
    searchParams.set('date', dateString);

    if (searchParams.has('page')) {
      searchParams.set('page', '1');
    }

    const url = `${pathname}?${searchParams.toString()}`;

    redirect(url, RedirectType.push);
  }

  public static getYearMonthPageOptions(
    firstAvailableDate: Date,
    lastAvailableDate: Date,
  ): PagerOptions {
    const selectedMonth = this.getCurrentDateFilter();
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1;

    const now = new Date();
    const monthsAfterFirstDate =
      (now.getFullYear() - firstAvailableDate.getFullYear()) * 12 +
      now.getMonth() -
      firstAvailableDate.getMonth() +
      1;
    const currentPage =
      (year - firstAvailableDate.getFullYear()) * 12 +
      month -
      firstAvailableDate.getMonth() +
      1;

    return {
      nextPage: {
        load: async () => {
          'use server';

          const newFilter = PagerService.getCurrentDateFilter();

          newFilter.setMonth(newFilter.getMonth() + 1);
          PagerService.gotoYearMonthPage(newFilter);
        },
        isAvailable: this.endOfMonth(selectedMonth) < lastAvailableDate,
      },
      previousPage: {
        load: async () => {
          'use server';
          const currentFilter = PagerService.getCurrentDateFilter();

          currentFilter.setMonth(currentFilter.getMonth() - 1);
          PagerService.gotoYearMonthPage(currentFilter);
        },
        isAvailable: !(
          year === firstAvailableDate.getFullYear() &&
          month === firstAvailableDate.getMonth() + 1
        ),
      },
      pageCount: monthsAfterFirstDate,
      currentPage,
    };
  }
}
