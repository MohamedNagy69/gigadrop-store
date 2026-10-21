import { prisma } from './prisma';

/**
 * Executes a Prisma query safely with timeout and error fallback.
 * Guarantees zero unhandled promise rejections and fast SSR failover.
 */
export async function safePrismaQuery<T>(
  queryFn: (p: typeof prisma) => Promise<T>,
  fallback: T,
  timeoutMs: number = 1500
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), timeoutMs);
  });

  try {
    const dataPromise = queryFn(prisma)
      .then((data) => {
        if (timer) clearTimeout(timer);
        return data;
      })
      .catch((err) => {
        if (timer) clearTimeout(timer);
        console.warn('Prisma DB query failed, using safe fallback:', err?.message || err);
        return fallback;
      });

    return await Promise.race([dataPromise, timeoutPromise]);
  } catch (err) {
    if (timer) clearTimeout(timer);
    console.warn('Safe Prisma query error:', err);
    return fallback;
  }
}
