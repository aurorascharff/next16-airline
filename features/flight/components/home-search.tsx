'use client';

import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { createSearchHref } from '@/features/flight/utils/search-params';
import { DEFAULT_SEARCH_VALUES, SearchFields, type SearchFieldsProps, searchPanelClass } from './search-fields';

export function HomeSearch(options: SearchFieldsProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState(DEFAULT_SEARCH_VALUES);

  return (
    <Boundary label="HomeSearch">
      <form className={searchPanelClass} data-stage="shell" onSubmit={event => event.preventDefault()} ref={formRef}>
        <SearchFields {...options} onChange={setValues} values={values} />
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
