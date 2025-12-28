import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Video, VideoId } from "../../../domain/video.aggregate";
import {
  IVideoRepository,
  VideoSearchTerm,
} from "../../../domain/video.repository";

export class VideoInMemoryRepository
  extends InMemorySearchableRepository<Video, VideoId, VideoSearchTerm>
  implements IVideoRepository
{
  sortableFields: string[] = ["title", "created_at"];

  getEntity(): new (...args: any[]) => Video {
    return Video;
  }

  protected async applySearchTerm(
    items: Video[],
    searchTerm: VideoSearchTerm | null,
  ): Promise<Video[]> {
    if (!searchTerm) {
      return items;
    }

    return items.filter((i) => {
      const containsTitle =
        searchTerm.title &&
        i.title.toLowerCase().includes(searchTerm.title.toLowerCase());
      const containsCategoriesId =
        searchTerm.categories_id &&
        searchTerm.categories_id.some((c) => i.categories_id.has(c.id));
      const containsGenresId =
        searchTerm.genres_id &&
        searchTerm.genres_id.some((c) => i.genres_id.has(c.id));
      const containsCastMembersId =
        searchTerm.cast_members_id &&
        searchTerm.cast_members_id.some((c) => i.cast_members_id.has(c.id));

      const searchTermMap = [
        [searchTerm.title, containsTitle],
        [searchTerm.categories_id, containsCategoriesId],
        [searchTerm.genres_id, containsGenresId],
        [searchTerm.cast_members_id, containsCastMembersId],
      ].filter((i) => i[0]);

      return searchTermMap.every((i) => i[1]);
    });
  }

  protected applySort(
    items: Video[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Video[] {
    return !sort
      ? super.applySort(items, "created_at", SortDirection.DESC)
      : super.applySort(items, sort, sort_dir);
  }
}
