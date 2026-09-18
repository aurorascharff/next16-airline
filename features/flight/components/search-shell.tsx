'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { createSearchHref } from '@/features/flight/utils/search-params';
import { SearchFields, type SearchFieldsProps, searchPanelClass, searchValuesFrom, type SearchValues } from './search-fields';

type Props = SearchFieldsProps & { children: React.ReactNode };

export function SearchShell(props: Props) {
  const params = useSearchParams();
  return <SearchForm key={params.toString()} {...props} initial={searchValuesFrom(params)} />;
}

function SearchForm({ children, initial, ...options }: Props & { initial: SearchValues }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState(initial);

  return (
    <Boundary label="SearchShell">
      <form
        className={searchPanelClass}
        onSubmit={event => {
          event.preventDefault();
          startTransition(() => router.push(createSearchHref(values.from, values.to, values.date)));
        }}
      >
        <SearchFields {...options} onChange={setValues} values={values} />
        <Button className="h-10 sm:w-44" type="submit">
          Search flights <ArrowRight className="size-4" />
        </Button>
      </form>
      <div
        className="transition-opacity duration-200 ease-out data-pending:opacity-60"
        data-pending={isPending ? '' : undefined}
      >
        {children}
      </div>
    </Boundary>
  );
}
