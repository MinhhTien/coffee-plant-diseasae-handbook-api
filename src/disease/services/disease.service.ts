import { PreventionType, SeasonType, SymptomLevel } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { DISEASE_LIST_PROJECTION } from '@disease/contracts/constant'
import { QueryDiseaseDto } from '@disease/dto/view-disease.dto'
import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { IDiseaseRepository } from '@src/disease/repositories/disease.repository'
import { Disease, DiseaseDocument } from '@src/disease/schemas/disease.schema'
import { Aggregate, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'

export const IDiseaseService = Symbol('IDiseaseService')

export interface IDiseaseService {
  create(disease: any, options?: SaveOptions | undefined): Promise<DiseaseDocument>
  findById(diseaseId: string, projection?: string | Record<string, any>): Promise<DiseaseDocument>
  update(
    conditions: FilterQuery<Disease>,
    payload: UpdateQuery<Disease>,
    options?: QueryOptions | undefined
  ): Promise<DiseaseDocument>
  list(pagination: PaginationParams, queryDiseaseDto: QueryDiseaseDto)
  findMany(
    conditions: FilterQuery<DiseaseDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<DiseaseDocument[]>
  countDisease(conditions: FilterQuery<DiseaseDocument>): Promise<number>
  countSymptom(conditions: FilterQuery<DiseaseDocument>): Promise<number>
  countPrevention(conditions: FilterQuery<DiseaseDocument>): Promise<number>
  getSymptomReportByLevel(): Aggregate<any[]>
  getDiseaseReportByMonth(): Aggregate<any[]>
}

@Injectable()
export class DiseaseService implements IDiseaseService {
  constructor(
    @Inject(IDiseaseRepository)
    private readonly diseaseRepository: IDiseaseRepository
  ) {}

  // async onModuleInit() {
  //   await this.diseaseRepository.model.insertMany([
  //     {
  //       name: 'Bệnh tảo đỏ',
  //       reason: 'Vi khuẩn Pseudomonas và nấm Colletotrichum',
  //       description:
  //         'Bệnh táo đỏ cà phê là bệnh do vi khuẩn và nấm gây ra, đặc trưng của bệnh là xuất hiện các vết đỏ, loang màu và tụ điểm màu đỏ trên lá và quả của cây cà phê. Đây là một bệnh hại rất nguy hiểm gây suy yếu cây cà phê, ảnh hưởng đến chất lượng và năng suất của cây.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Chùm, lá, quả trở nên khô héo',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Lá và quả bao phủ một lớp phấn hồng bám chặt',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Tổn thương trên bề mặt lá',
  //           level: SymptomLevel.HIGH
  //         },
  //         {
  //           name: 'Lá cây có thể bị rụng sớm',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Sử dụng thuốc bảo vệ thực vật',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 5,
  //           instruction:
  //             'Lựa chọn thuốc phù hợp: Tùy theo loại vi khuẩn hoặc nấm gây bệnh, chọn các loại thuốc trừ bệnh có tác động hiệu quả và không gây hại cho môi trường và con người.',
  //           note: 'Tuân thủ hướng dẫn sử dụng và liều lượng được đề xuất trên nhãn sản phẩm để tránh tác động phụ không mong muốn và đảm bảo hiệu quả khắc phục bệnh.'
  //         },
  //         {
  //           name: 'Sử dụng biện pháp sinh học và công nghệ',
  //           type: PreventionType.BIOLOGY,
  //           effective: 5,
  //           instruction: 'Sử dụng máy đo nông đọ đất ẩm.',
  //           note: ''
  //         },
  //         {
  //           name: 'Cắt và bảo vệ cây xanh',
  //           type: PreventionType.PHYSICS,
  //           effective: 3,
  //           instruction: 'Cắt tỉa các cành bệnh , giữ lại các cạnh còn xanh tốt.',
  //           note: ''
  //         },
  //         {
  //           name: 'Giám sát và kiểm tra thường xuyên',
  //           type: PreventionType.PHYSICS,
  //           effective: 3,
  //           instruction:
  //             'Kiểm tra thường xuyên đặc biệt là vào mùa mưa khi môi trường ẩm ướt dễ dàng cho nấm sinh trưởng.',
  //           note: ''
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-04-01'),
  //         endTime: new Date('2023-06-31'),
  //         season: SeasonType.SPRING
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735096178/coffee-plant-handbook/uctapjpj63wtbc852n2n.png'
  //     }
  //   ])
  // }

  public create(Disease: any, options?: SaveOptions | undefined) {
    return this.diseaseRepository.create(Disease, options)
  }

  public async findById(diseaseId: string, projection?: string | Record<string, any>) {
    const disease = await this.diseaseRepository.findOne({
      conditions: {
        _id: diseaseId
      },
      projection,
      populates: [
        {
          path: 'effectedVarieties',
          select: ['_id', 'name', 'scientificName', 'image']
        }
      ]
    })
    return disease
  }

  public update(conditions: FilterQuery<Disease>, payload: UpdateQuery<Disease>, options?: QueryOptions | undefined) {
    return this.diseaseRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(pagination: PaginationParams, queryDiseaseDto: QueryDiseaseDto, projection = DISEASE_LIST_PROJECTION) {
    const { search } = queryDiseaseDto
    const filter: Record<string, any> = {}

    // const validStatus = status?.filter((status) => [DiseaseStatus.ACTIVE].includes(status))
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

    return this.diseaseRepository.model.paginate(filter, {
      ...pagination,
      projection,
      populate: [
        {
          path: 'effectedVarieties',
          select: ['_id', 'name', 'scientificName', 'image']
        }
      ]
    })
  }

  public async findMany(
    conditions: FilterQuery<DiseaseDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const diseases = await this.diseaseRepository.findMany({
      conditions,
      projection,
      populates
    })
    return diseases
  }

  countDisease(conditions: FilterQuery<DiseaseDocument>): Promise<number> {
    return this.diseaseRepository.model.countDocuments(conditions)
  }

  async countSymptom(conditions: FilterQuery<DiseaseDocument>): Promise<number> {
    const result = await this.diseaseRepository.model.aggregate([
      {
        $unwind: {
          path: '$symptoms'
        }
      },
      {
        $count: 'count'
      }
    ])
    return result[0]?.count || 0
  }

  async countPrevention(conditions: FilterQuery<DiseaseDocument>): Promise<number> {
    const result = await this.diseaseRepository.model.aggregate([
      {
        $unwind: {
          path: '$preventions'
        }
      },
      {
        $count: 'count'
      }
    ])
    return result[0]?.count || 0
  }

  getSymptomReportByLevel() {
    return this.diseaseRepository.model.aggregate([
      {
        $unwind: {
          path: '$symptoms'
        }
      },
      {
        $project: {
          symptoms: 1
        }
      },
      {
        $group: {
          _id: '$symptoms.level',
          count: {
            $count: {}
          }
        }
      }
    ])
  }

  getDiseaseReportByMonth() {
    return this.diseaseRepository.model.aggregate([
      {
        $project: {
          startMonth: {
            $month: '$time.startTime'
          },
          endMonth: {
            $month: '$time.endTime'
          }
        }
      }
    ])
  }
}
