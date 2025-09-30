import { Transform } from "class-transformer";
import { ListCastMembersOutput } from "@core/cast-member/app/use-cases/list-cast-members/list-cast-members.use-case";
import { CastMemberTypes } from "@core/cast-member/domain/cast-member-type.vo";
import { CollectionPresenter } from "../../nest-modules/shared/collection.presenter";
import { CastMemberOutput } from "@core/cast-member/app/use-cases/common/cast-member-output";

export class CastMemberPresenter {
  id: string;
  name: string;
  type: CastMemberTypes;
  @Transform(({ value }: { value: Date }) => {
    return value.toISOString();
  })
  created_at: Date;

  constructor(output: CastMemberOutput) {
    this.id = output.id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}

export class CastMemberCollectionPresenter extends CollectionPresenter {
  data: CastMemberPresenter[];

  constructor(output: ListCastMembersOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new CastMemberPresenter(item));
  }
}
