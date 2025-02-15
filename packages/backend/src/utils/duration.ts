type Milliseconds = number & { readonly __milliseconds: unique symbol };

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class Duration {
  public static ofSeconds(seconds: number): Milliseconds {
    return (seconds * 1000) as Milliseconds;
  }

  public static ofMinutes(minutes: number): Milliseconds {
    return (minutes * 60 * 1000) as Milliseconds;
  }

  public static ofHours(hours: number): Milliseconds {
    return (hours * 60 * 60 * 1000) as Milliseconds;
  }

  public static ofDays(days: number): Milliseconds {
    return (days * 24 * 60 * 60 * 1000) as Milliseconds;
  }
}
