import { Stack } from '@mui/material';
import Spinner from '#root/components/Spinner/Spinner';
import {
  DataListItem,
  DataListItemProps as DataListItemProperties,
} from './DataListItem/DataListItem';

type DataListProperties = {
  items: DataListItemProperties[];
  isLoading: boolean;
};

function DataList({ items, isLoading }: DataListProperties) {
  return (
    <Stack spacing={2} alignItems="center">
      {isLoading ? (
        <Spinner fullscreen />
      ) : (
        items.map(({ id, header, body }) => (
          <DataListItem id={id} header={header} body={body} key={id} />
        ))
      )}
    </Stack>
  );
}

export default DataList;
