import { VarietyStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { VARIETY_LIST_PROJECTION } from '@variety/contracts/constant'
import { QueryVarietyDto } from '@variety/dto/view-variety.dto'
import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { IVarietyRepository } from '@src/variety/repositories/variety.repository'
import { Variety, VarietyDocument } from '@src/variety/schemas/variety.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'

export const IVarietyService = Symbol('IVarietyService')

export interface IVarietyService {
  create(variety: any, options?: SaveOptions | undefined): Promise<VarietyDocument>
  findById(varietyId: string, projection?: string | Record<string, any>): Promise<VarietyDocument>
  update(
    conditions: FilterQuery<Variety>,
    payload: UpdateQuery<Variety>,
    options?: QueryOptions | undefined
  ): Promise<VarietyDocument>
  list(pagination: PaginationParams, queryVarietyDto: QueryVarietyDto)
  findMany(
    conditions: FilterQuery<VarietyDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<VarietyDocument[]>
}

@Injectable()
export class VarietyService implements IVarietyService {
  constructor(
    @Inject(IVarietyRepository)
    private readonly varietyRepository: IVarietyRepository
  ) {}
  // async onModuleInit() {
  //   await this.varietyRepository.model.insertMany([
  //     {
  //       name: 'Cà phê chè',
  //       description:
  //         'Cây cà phê Arabica ưa sống ở vùng núi cao. Người ta thường trồng nó ở độ cao từ 1000-1500m. Cây có tán nhỏ, màu xanh đậm, lá hình oval. Cây cà phê trưởng thành có thể cao từ 4–6m, nếu để mọc hoang dã có thể cao đến 10m. Quả hình bầu dục, mỗi quả chứa hai hạt cà phê. Cà phê chè sau khi trồng khoảng 3 đến 4 năm thì có thể bắt đầu cho thu hoạch.',
  //       status: VarietyStatus.ACTIVE,
  //       scientificName: 'Coffea arabica',
  //       origin: 'Ethiopia',
  //       distribution: 'Khoảng 10%',
  //       suitableClimate: 'Cao nguyên, khí hậu mát mẻ',
  //       height: '4-6m',
  //       leaf: 'Nhỏ, hình oval, xanh đậm',
  //       bean: 'Hình bầu dục, 2 nhân',
  //       flavor: 'Thơm ngon, vị chua nhẹ',
  //       image: 'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735051788/coffee-plant-handbook/xquwmyecwpw1qk5xw5ir.jpg'
  //     },
  //     {
  //       name: 'Cà phê vối',
  //       description:
  //         'Cây cà phê vối có dạng cây gỗ hoặc cây bụi, chiều cao của cây trưởng thành có thể lên tới 10m. Quả cà phê có hình tròn, hạt nhỏ hơn hạt cà phê chè. Cây cà phê vối 3-4 tuổi có thể bắt đầu thu hoạch. Cây cho hạt trong khoảng từ 20 đến 30 năm.',
  //       status: VarietyStatus.ACTIVE,
  //       scientificName: 'Coffea robusta',
  //       origin: 'Châu Phi',
  //       distribution: 'Khoảng 90%',
  //       suitableClimate: 'Nhiệt đới gió mùa',
  //       height: '10m',
  //       leaf: 'To, hình oval, xanh đậm',
  //       bean: 'Hình tròn, 2 nhân',
  //       flavor: 'Đắng, vị mạnh',
  //       image: 'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735051789/coffee-plant-handbook/nuuyhnnm9zileb40airc.jpg'
  //     },
  //     {
  //       name: 'Cà phê mít',
  //       description:
  //         'Cây cao 2-5m, thân, lá và quả đều to, khác biệt hẳn so với cà phê vối. Hạt nhân to, thon dài trắng. Cây chịu hạn tốt, ít cần nước tưới nên thường trồng quảng canh. Do đặc tính chịu hạn và có sức chống chọi với sâu bệnh cao nên hiện cà phê mít được dùng làm gốc ghép cho các loại cà phê khác rất được các nhà vườn ưa chuộng.',
  //       status: VarietyStatus.ACTIVE,
  //       scientificName: 'Coffea liberica / Coffea excelsa',
  //       origin: 'Tây Phi',
  //       distribution: 'Rất ít',
  //       suitableClimate: 'Nhiều loại khí hậu',
  //       height: '2-5m',
  //       leaf: 'Rất to, giống lá mít',
  //       bean: 'Hình bầu dục, 1 nhân',
  //       flavor: 'Chua',
  //       image: 'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735051789/coffee-plant-handbook/pve7apaqllyznflot6ph.jpg'
  //     }
  //   ])
  // }

  public create(Variety: any, options?: SaveOptions | undefined) {
    return this.varietyRepository.create(Variety, options)
  }

  public async findById(varietyId: string, projection?: string | Record<string, any>) {
    const variety = await this.varietyRepository.findOne({
      conditions: {
        _id: varietyId
      },
      projection
    })
    return variety
  }

  public update(conditions: FilterQuery<Variety>, payload: UpdateQuery<Variety>, options?: QueryOptions | undefined) {
    return this.varietyRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(pagination: PaginationParams, queryVarietyDto: QueryVarietyDto, projection = VARIETY_LIST_PROJECTION) {
    const { search } = queryVarietyDto
    const filter: Record<string, any> = {
      status: VarietyStatus.ACTIVE
    }

    // const validStatus = status?.filter((status) => [VarietyStatus.ACTIVE].includes(status))
    // if (validStatus?.length > 0) {
    //   filter['status'] = {
    //     $in: validStatus
    //   }
    // }

    let textSearch = ''
    if (search) textSearch += search.trim()
    if (textSearch) {
      filter['$text'] = {
        $search: textSearch
      }
    }

    return this.varietyRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }

  public async findMany(
    conditions: FilterQuery<VarietyDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const varieties = await this.varietyRepository.findMany({
      conditions,
      projection,
      populates
    })
    return varieties
  }
}
