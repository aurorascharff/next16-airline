'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useOptimistic, useRef } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { createSearchHref } from '@/features/booking/utils/search-params';
import type { Airport } from '@/generated/prisma/client';
import { SearchFields, searchPanelClass, searchValuesFrom, type SearchValues } from './search-fields';
import type { Route } from 'next';

export function HomeSearch({ destinations, hubs }: { destinations: Airport[]; hubs: Airport[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setOptimisticValues] = useOptimistic(searchValuesFrom(params));

  function update(next: SearchValues) {
    const query = new URLSearchParams({ from: next.from });
    if (next.to) query.set('to', next.to);
    if (next.date) query.set('date', next.date);
    startTransition(() => {
      setOptimisticValues(next);
      router.replace(`/?${query}` as Route, { scroll: false });
    });
  }

  return (
    <Boundary label="HomeSearch">
      <form className={searchPanelClass} onSubmit={event => event.preventDefault()} ref={formRef}>
        <SearchFields destinations={destinations} hubs={hubs} onChange={update} values={values} />
        {values.to ? (
          <Button
            className="h-10 sm:w-44"
            render={<PrefetchLink href={createSearchHref(values.from, values.to, values.date)} />}
          >
            Search flights <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button className="h-10 sm:w-44" onClick={() => formRef.current?.reportValidity()}>
            Search flights <ArrowRight className="size-4" />
          </Button>
        )}
      </form>
    </Boundary>
  );
}
